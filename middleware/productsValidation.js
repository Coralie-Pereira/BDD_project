const z = require("zod");
const { stringValidator, numberValidator } = require("../lib/validators");
const { BADREQUEST_STATUS } = require("../constants/constants");
const ErrorResponseDTO = require("../dto/ErrorReponseDTO");
const { checkValidation } = require("../utils/checkValidation");

const createProductValidation = z.object({
  productCategory: stringValidator(50),
  productProvider: stringValidator(50),
  productName: stringValidator(50),
  productReference: stringValidator(10),
  productStock: numberValidator,
  productPrice: numberValidator,
});

exports.createProductValidationMiddleware = async (req, res, next) => {
  try {
    await checkValidation(createProductValidation, req.body);
    next();
  } catch (error) {
    return res
      .status(BADREQUEST_STATUS)
      .json(
        new ErrorResponseDTO(error.message, error.cause, BADREQUEST_STATUS)
      );
  }
};

const deleteProductValidation = z.object({
  productReference: stringValidator(10),
});

exports.deleteProductValidationMiddleware = async (req, res, next) => {
  try {
    await checkValidation(deleteProductValidation, req.params);
    next();
  } catch (error) {
    return res
      .status(BADREQUEST_STATUS)
      .json(
        new ErrorResponseDTO(error.message, error.cause, BADREQUEST_STATUS)
      );
  }
};

const fetchProductValidation = z.object({
  productReference: stringValidator(10),
});

exports.fetchProductValidationMiddleware = async (req, res, next) => {
  try {
    await checkValidation(fetchProductValidation, req.params);
    next();
  } catch (error) {
    return res
      .status(BADREQUEST_STATUS)
      .json(
        new ErrorResponseDTO(error.message, error.cause, BADREQUEST_STATUS)
      );
  }
};

const updateProductValidation = z
  .object({
    productCategory: stringValidator(50).optional(),
    productProvider: stringValidator(50).optional(),
    productName: stringValidator(50).optional(),
    productReference: stringValidator(10),
    productStock: numberValidator.optional(),
    productPrice: numberValidator.optional(),
  })
  .refine((data) => Object.keys(data).length > 1, {
    message: "Il n'y a rien à mettre à jour.",
  });

exports.updateProductValidationMiddleware = async (req, res, next) => {
  try {
    await checkValidation(updateProductValidation, req.body);
    next();
  } catch (error) {
    return res
      .status(BADREQUEST_STATUS)
      .json(
        new ErrorResponseDTO(error.message, error.cause, BADREQUEST_STATUS)
      );
  }
};
