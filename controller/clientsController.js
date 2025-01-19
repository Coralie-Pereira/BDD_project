const {
  SUCCESS_STATUS,
  NETWORK_ERROR_STATUS,
  NOTFOUND_STATUS,
} = require("../constants/constants");
const ErrorResponseDTO = require("../dto/ErrorReponseDTO");
const ResponseDTO = require("../dto/ResponseDTO");
const { getConnectionDb } = require("../utils/db");

exports.fetchCustomers = async (req, res, next) => {
  try {
    const connection = await getConnectionDb();
    const sql = `
            SELECT 
                cust.first_name, 
                cust.last_name, 
                cust.email, 
                cust.address, 
                ord.order_number, 
                ord.order_date, 
                ord.total_cost 
            FROM Customers cust 
            LEFT JOIN Orders ord ON ord.customer_id = cust.id 
            ORDER BY cust.id
        `;
    const [data] = await connection.execute(sql);
    const groupedData = Object.values(
      data.reduce((acc, item) => {
        const customerKey = item.email;
        if (!acc[customerKey]) {
          acc[customerKey] = {
            firstName: item.first_name,
            lastName: item.last_name,
            email: item.email,
            address: item.address,
            orders: [],
          };
        }
        if (item.order_number) {
          acc[customerKey].orders.push({
            orderNumber: item.order_number,
            orderDate: item.order_date,
            totalCost: item.total_cost,
          });
        }
        return acc;
      }, {})
    );
    await connection.end();
    res
      .status(SUCCESS_STATUS)
      .json(
        new ResponseDTO(
          "Clients et commandes récupérés avec succès",
          groupedData,
          SUCCESS_STATUS
        )
      );
  } catch (error) {
    res
      .status(NETWORK_ERROR_STATUS)
      .json(
        new ErrorResponseDTO(
          "Erreur serveur lors de la récupération des données",
          error,
          NETWORK_ERROR_STATUS
        )
      );
  }
};

exports.createCustomer = async (req, res, next) => {
  try {
    const { firstName, lastName, address, email } = req.body;
    const connection = await getConnectionDb();
    const sqlInsertCustomer = `
            INSERT INTO Customers (first_name, last_name, address, email) 
            VALUES (?, ?, ?, ?)
        `;
    const [data] = await connection.execute(sqlInsertCustomer, [
      firstName,
      lastName,
      address,
      email,
    ]);
    await connection.end();
    res
      .status(SUCCESS_STATUS)
      .json(new ResponseDTO("Client ajouté avec succès", data, SUCCESS_STATUS));
  } catch (error) {
    res
      .status(NETWORK_ERROR_STATUS)
      .json(
        new ErrorResponseDTO(
          "Erreur serveur lors de l'ajout du client",
          error,
          NETWORK_ERROR_STATUS
        )
      );
  }
};

exports.updateCustomer = async (req, res, next) => {
  try {
    const { firstName, lastName, address, email } = req.body;
    const connection = await getConnectionDb();
    await connection.beginTransaction();
    const sqlSelectCustomer = `SELECT id FROM Customers WHERE email = ?`;
    const [[customer]] = await connection.execute(sqlSelectCustomer, [email]);
    if (!customer) {
      return res
        .status(NOTFOUND_STATUS)
        .json(new ErrorResponseDTO("Client introuvable", {}, NOTFOUND_STATUS));
    }

    let updates = "";
    let updatesParams = [];
    if (firstName) {
      updates += `${updates.length > 0 ? "," : ""} first_name = ?`;
      updatesParams.push(firstName);
    }
    if (lastName) {
      updates += `${updates.length > 0 ? "," : ""} last_name = ?`;
      updatesParams.push(lastName);
    }
    if (address) {
      updates += `${updates.length > 0 ? "," : ""} address = ?`;
      updatesParams.push(address);
    }
    const sqlUpdateCustomer = `UPDATE Customers SET ${updates} WHERE id = ?`;
    const [result] = await connection.execute(sqlUpdateCustomer, [
      ...updatesParams,
      customer.id,
    ]);
    await connection.commit();
    await connection.end();
    res
      .status(SUCCESS_STATUS)
      .json(
        new ResponseDTO("Client mis à jour avec succès", result, SUCCESS_STATUS)
      );
  } catch (error) {
    res
      .status(NETWORK_ERROR_STATUS)
      .json(
        new ErrorResponseDTO(
          "Erreur serveur lors de la mise à jour du client",
          error,
          NETWORK_ERROR_STATUS
        )
      );
  }
};

exports.deleteCustomer = async (req, res, next) => {
  try {
    const { email } = req.params;
    const connection = await getConnectionDb();
    await connection.beginTransaction();
    const sqlSelectCustomer = `SELECT id FROM Customers WHERE email = ?`;
    const [[customer]] = await connection.execute(sqlSelectCustomer, [email]);
    if (!customer) {
      return res
        .status(NOTFOUND_STATUS)
        .json(new ErrorResponseDTO("Client introuvable", {}, NOTFOUND_STATUS));
    }
    const sqlDeleteCustomer = `DELETE FROM Customers WHERE id = ?`;
    const [data] = await connection.execute(sqlDeleteCustomer, [customer.id]);
    await connection.commit();
    await connection.end();
    res
      .status(SUCCESS_STATUS)
      .json(
        new ResponseDTO("Client supprimé avec succès", data, SUCCESS_STATUS)
      );
  } catch (error) {
    res
      .status(NETWORK_ERROR_STATUS)
      .json(
        new ErrorResponseDTO(
          "Erreur serveur lors de la suppression du client",
          error,
          NETWORK_ERROR_STATUS
        )
      );
  }
};

exports.fetchCustomerOrders = async (req, res, next) => {
  try {
    const { email } = req.params;
    const connection = await getConnectionDb();
    const sql = `
            SELECT 
                ord.order_number, 
                ord.order_date, 
                ord.total_cost 
            FROM Orders ord 
            LEFT JOIN Customers cust ON ord.customer_id = cust.id 
            WHERE cust.email = ?
        `;
    const [data] = await connection.execute(sql, [email]);
    await connection.end();
    res
      .status(SUCCESS_STATUS)
      .json(
        new ResponseDTO(
          "Commandes du client récupérées avec succès",
          data,
          SUCCESS_STATUS
        )
      );
  } catch (error) {
    res
      .status(NETWORK_ERROR_STATUS)
      .json(
        new ErrorResponseDTO(
          "Erreur serveur lors de la récupération des commandes",
          error,
          NETWORK_ERROR_STATUS
        )
      );
  }
};
const {
  SUCCESS_STATUS,
  NETWORK_ERROR_STATUS,
  NOTFOUND_STATUS,
} = require("../constants/constants");
const ErrorResponseDTO = require("../dto/ErrorReponseDTO");
const ResponseDTO = require("../dto/ResponseDTO");
const { getConnectionDb } = require("../utils/db");

exports.fetchCustomers = async (req, res, next) => {
  try {
    const connection = await getConnectionDb();
    const sql = `
            SELECT 
                cust.first_name, 
                cust.last_name, 
                cust.email, 
                cust.address, 
                ord.order_number, 
                ord.order_date, 
                ord.total_cost 
            FROM Customers cust 
            LEFT JOIN Orders ord ON ord.customer_id = cust.id 
            ORDER BY cust.id
        `;
    const [data] = await connection.execute(sql);
    const groupedData = Object.values(
      data.reduce((acc, item) => {
        const customerKey = item.email;
        if (!acc[customerKey]) {
          acc[customerKey] = {
            firstName: item.first_name,
            lastName: item.last_name,
            email: item.email,
            address: item.address,
            orders: [],
          };
        }
        if (item.order_number) {
          acc[customerKey].orders.push({
            orderNumber: item.order_number,
            orderDate: item.order_date,
            totalCost: item.total_cost,
          });
        }
        return acc;
      }, {})
    );
    await connection.end();
    res
      .status(SUCCESS_STATUS)
      .json(
        new ResponseDTO(
          "Clients et commandes récupérés avec succès",
          groupedData,
          SUCCESS_STATUS
        )
      );
  } catch (error) {
    res
      .status(NETWORK_ERROR_STATUS)
      .json(
        new ErrorResponseDTO(
          "Erreur serveur lors de la récupération des données",
          error,
          NETWORK_ERROR_STATUS
        )
      );
  }
};

exports.createCustomer = async (req, res, next) => {
  try {
    const { firstName, lastName, address, email } = req.body;
    const connection = await getConnectionDb();
    const sqlInsertCustomer = `
            INSERT INTO Customers (first_name, last_name, address, email) 
            VALUES (?, ?, ?, ?)
        `;
    const [data] = await connection.execute(sqlInsertCustomer, [
      firstName,
      lastName,
      address,
      email,
    ]);
    await connection.end();
    res
      .status(SUCCESS_STATUS)
      .json(new ResponseDTO("Client ajouté avec succès", data, SUCCESS_STATUS));
  } catch (error) {
    res
      .status(NETWORK_ERROR_STATUS)
      .json(
        new ErrorResponseDTO(
          "Erreur serveur lors de l'ajout du client",
          error,
          NETWORK_ERROR_STATUS
        )
      );
  }
};

exports.updateCustomer = async (req, res, next) => {
  try {
    const { firstName, lastName, address, email } = req.body;
    const connection = await getConnectionDb();
    await connection.beginTransaction();
    const sqlSelectCustomer = `SELECT id FROM Customers WHERE email = ?`;
    const [[customer]] = await connection.execute(sqlSelectCustomer, [email]);
    if (!customer) {
      return res
        .status(NOTFOUND_STATUS)
        .json(new ErrorResponseDTO("Client introuvable", {}, NOTFOUND_STATUS));
    }

    let updates = "";
    let updatesParams = [];
    if (firstName) {
      updates += `${updates.length > 0 ? "," : ""} first_name = ?`;
      updatesParams.push(firstName);
    }
    if (lastName) {
      updates += `${updates.length > 0 ? "," : ""} last_name = ?`;
      updatesParams.push(lastName);
    }
    if (address) {
      updates += `${updates.length > 0 ? "," : ""} address = ?`;
      updatesParams.push(address);
    }
    const sqlUpdateCustomer = `UPDATE Customers SET ${updates} WHERE id = ?`;
    const [result] = await connection.execute(sqlUpdateCustomer, [
      ...updatesParams,
      customer.id,
    ]);
    await connection.commit();
    await connection.end();
    res
      .status(SUCCESS_STATUS)
      .json(
        new ResponseDTO("Client mis à jour avec succès", result, SUCCESS_STATUS)
      );
  } catch (error) {
    res
      .status(NETWORK_ERROR_STATUS)
      .json(
        new ErrorResponseDTO(
          "Erreur serveur lors de la mise à jour du client",
          error,
          NETWORK_ERROR_STATUS
        )
      );
  }
};

exports.deleteCustomer = async (req, res, next) => {
  try {
    const { email } = req.params;
    const connection = await getConnectionDb();
    await connection.beginTransaction();
    const sqlSelectCustomer = `SELECT id FROM Customers WHERE email = ?`;
    const [[customer]] = await connection.execute(sqlSelectCustomer, [email]);
    if (!customer) {
      return res
        .status(NOTFOUND_STATUS)
        .json(new ErrorResponseDTO("Client introuvable", {}, NOTFOUND_STATUS));
    }
    const sqlDeleteCustomer = `DELETE FROM Customers WHERE id = ?`;
    const [data] = await connection.execute(sqlDeleteCustomer, [customer.id]);
    await connection.commit();
    await connection.end();
    res
      .status(SUCCESS_STATUS)
      .json(
        new ResponseDTO("Client supprimé avec succès", data, SUCCESS_STATUS)
      );
  } catch (error) {
    res
      .status(NETWORK_ERROR_STATUS)
      .json(
        new ErrorResponseDTO(
          "Erreur serveur lors de la suppression du client",
          error,
          NETWORK_ERROR_STATUS
        )
      );
  }
};

exports.fetchCustomerOrders = async (req, res, next) => {
  try {
    const { email } = req.params;
    const connection = await getConnectionDb();
    const sql = `
            SELECT 
                ord.order_number, 
                ord.order_date, 
                ord.total_cost 
            FROM Orders ord 
            LEFT JOIN Customers cust ON ord.customer_id = cust.id 
            WHERE cust.email = ?
        `;
    const [data] = await connection.execute(sql, [email]);
    await connection.end();
    res
      .status(SUCCESS_STATUS)
      .json(
        new ResponseDTO(
          "Commandes du client récupérées avec succès",
          data,
          SUCCESS_STATUS
        )
      );
  } catch (error) {
    res
      .status(NETWORK_ERROR_STATUS)
      .json(
        new ErrorResponseDTO(
          "Erreur serveur lors de la récupération des commandes",
          error,
          NETWORK_ERROR_STATUS
        )
      );
  }
};
