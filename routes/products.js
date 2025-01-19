const express = require("express");
const {
  getProducts,
  postProducts,
  deleteProducts,
  putProducts,
  getProductsOrders,
} = require("../controller/productsController");
const {
  postProductsValidation,
  putProductsValidation,
  deleteProductsValidation,
  getProductsValidation,
} = require("../middleware/productsValidation");
const router = express.Router();

router.get("/", getProducts);
router.get(
  "/:productReference/orders",
  getProductsValidation,
  getProductsOrders
);
router.post("/", postProductsValidation, postProducts);
router.put("/", putProductsValidation, putProducts);
router.delete("/:productReference", deleteProductsValidation, deleteProducts);

module.exports = router;
