const {
  SUCCESS_STATUS,
  NETWORK_ERROR_STATUS,
  NOTFOUND_STATUS,
} = require("../constants/constants");
const ErrorResponseDTO = require("../dto/ErrorReponseDTO");
const ResponseDTO = require("../dto/ResponseDTO");
const { getConnectionDb } = require("../utils/db");

exports.getCategories = async (req, res, next) => {
  try {
    const connection = await getConnectionDb();
    const sql = `SELECT * FROM Categories ORDER BY id`;
    const [data] = await connection.execute(sql);
    await connection.end();
    res
      .status(SUCCESS_STATUS)
      .json(new ResponseDTO("Données récupérées", data, SUCCESS_STATUS));
  } catch (error) {
    res
      .status(NETWORK_ERROR_STATUS)
      .json(
        new ErrorResponseDTO("Problème serveur.", error, NETWORK_ERROR_STATUS)
      );
  }
};

exports.postCategories = async (req, res, next) => {
  try {
    const { nameCategory } = req.body;
    const connection = await getConnectionDb();
    const sqlCategories = `INSERT INTO Categories (name_category) VALUES (?)`;
    const data = await connection.execute(sqlCategories, [nameCategory]);
    await connection.end();
    res
      .status(SUCCESS_STATUS)
      .json(new ResponseDTO("Donnée insérée", data, SUCCESS_STATUS));
  } catch (error) {
    res
      .status(NETWORK_ERROR_STATUS)
      .json(
        new ErrorResponseDTO("Problème serveur.", error, NETWORK_ERROR_STATUS)
      );
  }
};

exports.putCategories = async (req, res, next) => {
  try {
    const { nameCategory, newNameCategory } = req.body;
    const connection = await getConnectionDb();
    await connection.beginTransaction();
    const sqlSelectCategories = `SELECT * FROM Categories WHERE name_category=?`;
    const [[category]] = await connection.execute(sqlSelectCategories, [
      nameCategory,
    ]);
    if (!category) {
      return res
        .status(NOTFOUND_STATUS)
        .json(
          new ErrorResponseDTO(
            "La catégorie n'existe pas.",
            {},
            NOTFOUND_STATUS
          )
        );
    }
    const sqlCategories = `UPDATE Categories SET name_category=? WHERE id=?`;
    const [result] = await connection.execute(sqlCategories, [
      newNameCategory,
      category.id,
    ]);
    await connection.commit();
    await connection.end();
    res
      .status(SUCCESS_STATUS)
      .json(new ResponseDTO("Données mises à jour.", result, SUCCESS_STATUS));
  } catch (error) {
    res
      .status(NETWORK_ERROR_STATUS)
      .json(
        new ErrorResponseDTO("Problème serveur.", error, NETWORK_ERROR_STATUS)
      );
  }
};

exports.deleteCategories = async (req, res, next) => {
  try {
    const { nameCategory } = req.params;
    const connection = await getConnectionDb();
    await connection.beginTransaction();
    const sqlSelectCategories = `SELECT id FROM Categories WHERE name_category=?`;
    const [[category]] = await connection.execute(sqlSelectCategories, [
      nameCategory,
    ]);
    if (!category) {
      return res
        .status(NOTFOUND_STATUS)
        .json(
          new ErrorResponseDTO(
            "La catégorie n'existe pas.",
            {},
            NOTFOUND_STATUS
          )
        );
    }
    const sql = `DELETE FROM Categories WHERE id=?`;
    const [data] = await connection.execute(sql, [category.id]);
    await connection.commit();
    await connection.end();
    res
      .status(SUCCESS_STATUS)
      .json(new ResponseDTO("Donnée supprimée", data, SUCCESS_STATUS));
  } catch (error) {
    res
      .status(NETWORK_ERROR_STATUS)
      .json(
        new ErrorResponseDTO("Problème serveur.", error, NETWORK_ERROR_STATUS)
      );
  }
};
