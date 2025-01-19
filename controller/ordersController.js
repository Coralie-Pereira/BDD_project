const {
  SUCCESS_STATUS,
  NETWORK_ERROR_STATUS,
  NOTFOUND_STATUS,
  BADREQUEST_STATUS,
} = require("../constants/constants");
const ErrorResponseDTO = require("../dto/ErrorReponseDTO");
const ResponseDTO = require("../dto/ResponseDTO");
const { getConnectionDb } = require("../utils/db");

const updateProductOfOrders = async (
  productBody,
  connection,
  res,
  isPut = false,
  oldProducts = []
) => {
  let productsWhereString = "";
  let productsWhereTab = [];

  const stockUpdates = [];

  productBody.map((product) => {
    productsWhereString += `${
      productsWhereString.length > 0 ? " OR " : ""
    }product_reference=?`;
    productsWhereTab.push(product.product_reference);
  });

  const sqlGetProductsId = `SELECT id, product_reference, product_name, product_price, product_stock FROM Products WHERE ${productsWhereString}`;
  const [productsInfo] = await connection.execute(
    sqlGetProductsId,
    productsWhereTab
  );
  if (productBody.length !== productsInfo.length) {
    return res
      .status(BADREQUEST_STATUS)
      .json(
        new ErrorResponseDTO(
          "La liste de produits est incorrecte !",
          {},
          BADREQUEST_STATUS
        )
      );
  }

  const removedProducts = oldProducts.filter(
    (oldProduct) =>
      !productsInfo.some(
        (newProduct) => newProduct.id === oldProduct.product_id
      )
  );

  await Promise.all(
    removedProducts.map(async (removedProduct) => {
      const sqlGetProduct = `SELECT product_stock FROM Products WHERE id=?`;
      const [[productInfo]] = await connection.execute(sqlGetProduct, [
        removedProduct.product_id,
      ]);

      const newStock = productInfo.product_stock + removedProduct.quantity;
      stockUpdates.push({ id: removedProduct.product_id, newStock });
    })
  );

  let total_price = 0;
  const mergedProducts = await Promise.all(
    productsInfo.map(async (item) => {
      const match = productBody.find(
        (product) => product.product_reference === item.product_reference
      );
      let stock = item.product_stock;
      if (isPut) {
        const oldMatch = oldProducts.find(
          (product) => product.product_id === item.id
        );
        if (oldMatch) {
          stock += oldMatch.quantity;
        }
      }
      if (!match) {
        throw new Error(
          `Produit non trouvé : ${item.product_name} (${item.product_reference}).`,
          {
            cause: { status: BADREQUEST_STATUS },
          }
        );
      }
      const newStock = stock - match.quantity;

      if (newStock < 0) {
        throw new Error(
          `La quantité demandée pour le produit ${item.product_name} (${item.product_reference}) dépasse le stock disponible.`,
          { cause: { status: BADREQUEST_STATUS } }
        );
      }
      stockUpdates.push({ id: item.id, newStock });
      total_price += item.product_price * match.quantity;
      return {
        ...item,
        quantity: match.quantity,
      };
    })
  );
  return { mergedProducts, total_price, stockUpdates };
};

exports.getOrders = async (req, res, next) => {
  try {
    const { start, end } = req.query;
    const tabSql = [];
    const connection = await getConnectionDb();
    let querySql = "";

    let sql = `WITH all_keys AS (
            SELECT id FROM Orders
            UNION
            SELECT product_id AS id FROM Orders_Products
        )

        SELECT
            CONCAT(c.client_firstname, ' ', c.client_lastname) AS client_name,
            o.order_number, o.order_date, o.order_total_price,
            op.quantity, p.product_name AS product
        FROM all_keys k
        LEFT JOIN Orders o ON o.id = k.id
        LEFT JOIN Clients c ON c.id = o.client_id
        LEFT JOIN Orders_Products op ON k.id = op.order_id
        LEFT JOIN Products p ON op.product_id = p.id`;

    if (start) {
      querySql += " WHERE o.order_date >= ?";
      tabSql.push(start);
    }
    if (end) {
      querySql += `${
        querySql.length > 0 ? " AND " : " WHERE "
      }o.order_date <=?`;
      tabSql.push(`${end}T23:59:59.000Z`);
    }
    sql += querySql;

    const [data] = await connection.execute(sql, tabSql);
    const groupedData = Object.values(
      data.reduce((acc, item) => {
        const orderKey = item.order_number;
        if (!acc[orderKey]) {
          acc[orderKey] = {
            client_name: item.client_name,
            order_number: item.order_number,
            order_date: item.order_date,
            order_total_price: item.order_total_price,
            products: [],
          };
        }
        if (item.product) {
          acc[orderKey].products.push({
            name: item.product,
            quantity: item.quantity,
          });
        }
        return acc;
      }, {})
    );
    await connection.end();
    res
      .status(SUCCESS_STATUS)
      .json(new ResponseDTO("Données récupérées", groupedData, SUCCESS_STATUS));
  } catch (error) {
    res
      .status(NETWORK_ERROR_STATUS)
      .json(
        new ErrorResponseDTO("Problème serveur.", error, NETWORK_ERROR_STATUS)
      );
  }
};

exports.postOrders = async (req, res, next) => {
  try {
    const { client_email, products } = req.body;
    let order_number;
    const connection = await getConnectionDb();
    await connection.beginTransaction();

    const sqlClient = `SELECT id FROM Clients WHERE client_email=?`;
    const [[client]] = await connection.execute(sqlClient, [client_email]);
    if (!client) {
      return res
        .status(NOTFOUND_STATUS)
        .json(
          new ErrorResponseDTO("Le client n'existe pas !", {}, NOTFOUND_STATUS)
        );
    }
    try {
      const { mergedProducts, total_price, stockUpdates } =
        await updateProductOfOrders(products, connection, res);

      const sqlGetLastOrder = `SELECT * FROM Orders ORDER BY ID DESC LIMIT 1`;
      const [[last_order]] = await connection.execute(sqlGetLastOrder);
      if (!last_order.order_number) {
        order_number = "0000000001";
      } else {
        let parsedString = parseInt(last_order.order_number) + 1;
        order_number = parsedString.toString().padStart(10, "0");
      }

      const sqlOrders = `INSERT INTO Orders (order_number, order_total_price, client_id) VALUES (?,?,?)`;
      const [data] = await connection.execute(sqlOrders, [
        order_number,
        total_price,
        client.id,
      ]);

      const result = await Promise.all(
        mergedProducts.map(async (product) => {
          const sqlOrdersProducts = `INSERT INTO Orders_Products (order_id, product_id, quantity) VALUES (?, ?, ?)`;
          const [insertRelation] = await connection.execute(sqlOrdersProducts, [
            data.insertId,
            product.id,
            product.quantity,
          ]);
          return insertRelation;
        })
      );

      await Promise.all(
        stockUpdates.map(async ({ id, newStock }) => {
          const sqlUpdateProduct = `UPDATE Products SET product_stock=? WHERE id=?`;
          await connection.execute(sqlUpdateProduct, [newStock, id]);
        })
      );

      const response = { orders_products: result, orders: data };
      await connection.commit();
      await connection.end();
      res
        .status(SUCCESS_STATUS)
        .json(new ResponseDTO("Donnée insérée", response, SUCCESS_STATUS));
    } catch (error) {
      return res
        .status(NOTFOUND_STATUS)
        .json(new ErrorResponseDTO(error.message, error, NOTFOUND_STATUS));
    }
  } catch (error) {
    res
      .status(NETWORK_ERROR_STATUS)
      .json(
        new ErrorResponseDTO("Problème serveur.", error, NETWORK_ERROR_STATUS)
      );
  }
};
