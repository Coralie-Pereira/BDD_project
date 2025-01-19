const express = require("express");
const {
  getClients,
  postClients,
  putClients,
  deleteClients,
  getClientsOrders,
} = require("../controller/clientsController");
const {
  postClientsValidation,
  putClientsValidation,
  deleteClientsValidation,
  getClientsValidation,
} = require("../middleware/clientsValidation");
const router = express.Router();

router.get("/", getClients);
router.get("/:clientEmail/orders", getClientsValidation, getClientsOrders);
router.post("/", postClientsValidation, postClients);
router.put("/", putClientsValidation, putClients);
router.delete("/:clientEmail", deleteClientsValidation, deleteClients);

module.exports = router;
