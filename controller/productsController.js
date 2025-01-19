const {
  SUCCESS_STATUS,
  NETWORK_ERROR_STATUS,
  NOTFOUND_STATUS,
  BADREQUEST_STATUS,
} = require("../constants/constants");
const ErrorResponseDTO = require("../dto/ErrorReponseDTO");
const ResponseDTO = require("../dto/ResponseDTO");
const { getConnectionDb } = require("../utils/db");

exports.getItems = async (req, res, next) => {
  try {
    const connection = await getConnectionDb();
    const sql = `WITH all_ids AS (
            SELECT id FROM Inventory
            UNION
            SELECT item_id AS id FROM Suppliers_Items
        )

        SELECT
            s.supplier_name AS supplier,
            i.item_name AS item, i.item_code, i.quantity, i.price, c.category_name AS category 
        FROM all_ids ids
        LEFT JOIN Inventory i ON i.id = ids.id
        LEFT JOIN Categories c ON c.id = i.category_id
        LEFT JOIN Suppliers_Items si ON ids.id = si.item_id
        LEFT JOIN Suppliers s ON si.supplier_id = s.id;`;
    const [data] = await connection.execute(sql);
    const groupedData = Object.values(
      data.reduce((acc, item) => {
        const itemKey = item.item;
        if (!acc[itemKey]) {
          acc[itemKey] = {
            ...item,
            supplier: [],
          };
        }
        if (item.supplier) {
          acc[itemKey].supplier.push(item.supplier);
        }
        return acc;
      }, {})
    );
    await connection.end();
    res
      .status(SUCCESS_STATUS)
      .json(new ResponseDTO("Data retrieved", groupedData, SUCCESS_STATUS));
  } catch (error) {
    res
      .status(NETWORK_ERROR_STATUS)
      .json(new ErrorResponseDTO("Server issue.", error, NETWORK_ERROR_STATUS));
  }
};

exports.addItem = async (req, res, next) => {
  try {
    const { category, supplier, item_name, item_code, quantity, price } =
      req.body;
    const connection = await getConnectionDb();
    await connection.beginTransaction();

    const sqlCategory = `SELECT id FROM Categories WHERE category_name = ?`;
    const [[categoryInfo]] = await connection.execute(sqlCategory, [category]);
    if (!categoryInfo) {
      return res
        .status(NOTFOUND_STATUS)
        .json(
          new ErrorResponseDTO("Category does not exist!", {}, NOTFOUND_STATUS)
        );
    }

    const sqlSupplier = `SELECT id FROM Suppliers WHERE supplier_name = ?`;
    const [[supplierInfo]] = await connection.execute(sqlSupplier, [supplier]);
    if (!supplierInfo) {
      return res
        .status(NOTFOUND_STATUS)
        .json(
          new ErrorResponseDTO("Supplier does not exist!", {}, NOTFOUND_STATUS)
        );
    }

    const sqlItems = `INSERT INTO Inventory (item_name, item_code, quantity, price, category_id) VALUES (?, ?, ?, ?, ?)`;
    const [data] = await connection.execute(sqlItems, [
      item_name,
      item_code,
      quantity,
      price,
      categoryInfo.id,
    ]);

    const sqlItemsSuppliers = `INSERT INTO Suppliers_Items (supplier_id, item_id) VALUES (?, ?)`;
    await connection.execute(sqlItemsSuppliers, [
      supplierInfo.id,
      data.insertId,
    ]);
    await connection.commit();
    await connection.end();
    res
      .status(SUCCESS_STATUS)
      .json(new ResponseDTO("Data inserted", data, SUCCESS_STATUS));
  } catch (error) {
    res
      .status(NETWORK_ERROR_STATUS)
      .json(new ErrorResponseDTO("Server issue.", error, NETWORK_ERROR_STATUS));
  }
};

exports.updateItem = async (req, res, next) => {
  try {
    const { item_code, item_name, quantity, price, category, supplier } =
      req.body;
    const connection = await getConnectionDb();
    await connection.beginTransaction();

    const sqlSelectItems = `SELECT * FROM Inventory WHERE item_code = ?`;
    const [[item]] = await connection.execute(sqlSelectItems, [item_code]);
    if (!item) {
      return res
        .status(NOTFOUND_STATUS)
        .json(
          new ErrorResponseDTO("Item does not exist.", {}, NOTFOUND_STATUS)
        );
    }

    let updates = "";
    let updatesTab = [];
    if (item_name) {
      updates += `${updates.length > 0 ? "," : ""}item_name = ?`;
      updatesTab.push(item_name);
    }
    if (quantity) {
      updates += `${updates.length > 0 ? "," : ""}quantity = ?`;
      updatesTab.push(quantity);
    }
    if (price) {
      updates += `${updates.length > 0 ? "," : ""}price = ?`;
      updatesTab.push(price);
    }

    const itemInfo = item;
    if (category) {
      const sqlCategory = `SELECT id FROM Categories WHERE category_name = ?`;
      const [[resultCategory]] = await connection.execute(sqlCategory, [
        category,
      ]);
      if (!resultCategory) {
        throw new Error("Error updating data.");
      }
      updates += `${updates.length > 0 ? "," : ""}category_id = ?`;
      updatesTab.push(resultCategory.id);
    }
    if (supplier) {
      const sqlSupplier = `SELECT id FROM Suppliers WHERE supplier_name = ?`;
      const [[supplierInfo]] = await connection.execute(sqlSupplier, [
        supplier,
      ]);
      if (!supplierInfo) {
        return res
          .status(NOTFOUND_STATUS)
          .json(
            new ErrorResponseDTO(
              "Supplier does not exist!",
              {},
              NOTFOUND_STATUS
            )
          );
      }

      const sqlItemsSuppliersSelect = `SELECT * FROM Suppliers_Items WHERE item_id = ? AND supplier_id = ?`;
      const [[result]] = await connection.execute(sqlItemsSuppliersSelect, [
        itemInfo.id,
        supplierInfo.id,
      ]);
      if (result) {
        return res
          .status(BADREQUEST_STATUS)
          .json(
            new ResponseDTO(
              "Supplier is already associated with this item.",
              result,
              BADREQUEST_STATUS
            )
          );
      }

      const sqlItemsSuppliersInsert = `INSERT INTO Suppliers_Items (item_id, supplier_id) VALUES (?, ?)`;
      await connection.execute(sqlItemsSuppliersInsert, [
        itemInfo.id,
        supplierInfo.id,
      ]);
    }

    const sqlItems = `UPDATE Inventory SET ${updates} WHERE id = ?`;
    const [result] = await connection.execute(sqlItems, [
      ...updatesTab,
      itemInfo.id,
    ]);
    await connection.commit();
    await connection.end();
    res
      .status(SUCCESS_STATUS)
      .json(new ResponseDTO("Data updated.", result, SUCCESS_STATUS));
  } catch (error) {
    res
      .status(NETWORK_ERROR_STATUS)
      .json(new ErrorResponseDTO("Server issue.", error, NETWORK_ERROR_STATUS));
  }
};

exports.deleteItem = async (req, res, next) => {
  try {
    const { item_code } = req.params;
    const connection = await getConnectionDb();
    await connection.beginTransaction();

    const sqlSelectItems = `SELECT id FROM Inventory WHERE item_code = ?`;
    const [[item]] = await connection.execute(sqlSelectItems, [item_code]);
    if (!item) {
      return res
        .status(NOTFOUND_STATUS)
        .json(
          new ErrorResponseDTO("Item does not exist.", {}, NOTFOUND_STATUS)
        );
    }

    const sql = `DELETE FROM Inventory WHERE id = ?`;
    const [data] = await connection.execute(sql, [item.id]);
    await connection.commit();
    await connection.end();
    res
      .status(SUCCESS_STATUS)
      .json(new ResponseDTO("Data deleted", data, SUCCESS_STATUS));
  } catch (error) {
    res
      .status(NETWORK_ERROR_STATUS)
      .json(new ErrorResponseDTO("Server issue.", error, NETWORK_ERROR_STATUS));
  }
};

exports.getItemOrders = async (req, res, next) => {
  try {
    const { item_code } = req.params;
    const connection = await getConnectionDb();
    const sql = `
        SELECT
            o.order_number, o.order_date, o.total_price
        FROM Inventory i
        LEFT JOIN Orders_Items oi ON i.id = oi.item_id
        LEFT JOIN Orders o ON oi.order_id = o.id
        WHERE i.item_code = ?`;

    const [data] = await connection.execute(sql, [item_code]);
    await connection.end();
    res
      .status(SUCCESS_STATUS)
      .json(new ResponseDTO("Data retrieved", data, SUCCESS_STATUS));
  } catch (error) {
    res
      .status(NETWORK_ERROR_STATUS)
      .json(new ErrorResponseDTO("Server issue.", error, NETWORK_ERROR_STATUS));
  }
};
