const express = require("express");
const {
  getProviders,
  postProviders,
  putProviders,
  deleteProviders,
} = require("../controller/providersController");
const {
  postProvidersValidation,
  putProvidersValidation,
  deleteProvidersValidation,
} = require("../middleware/providersValidation");
const router = express.Router();

router.get("/", getProviders);
router.post("/", postProvidersValidation, postProviders);
router.put("/", putProvidersValidation, putProviders);
router.delete("/:providerName", deleteProvidersValidation, deleteProviders);

module.exports = router;
