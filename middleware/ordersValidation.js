const z = require("zod");
const {
  stringValidator,
  emailValidator,
  arrayValidator,
  numberValidator,
  dateValidator,
} = require("../lib/validators");
const { BADREQUEST_STATUS } = require("../constants/constants");
const ErrorResponseDTO = require("../dto/ErrorReponseDTO");
const { checkValidation } = require("../utils/checkValidation");

const createOrderValidation = z.object({
  userEmail: emailValidator(50),
  orderItems: arrayValidator(
    z.object({
      productName: stringValidator(10),
      productQuantity: numberValidator,
    }),
    1
  ),
});

exports.createOrderValidationMiddleware = async (req, res, next) => {
  try {
    await checkValidation(createOrderValidation, req.body);
    next();
  } catch (error) {
    return res
      .status(BADREQUEST_STATUS)
      .json(
        new ErrorResponseDTO(error.message, error.cause, BADREQUEST_STATUS)
      );
  }
};

const fetchOrdersValidation = z.object({
  startDate: dateValidator.optional(),
  endDate: dateValidator.optional(),
});

exports.fetchOrdersValidationMiddleware = async (req, res, next) => {
  try {
    await checkValidation(fetchOrdersValidation, req.query);
    next();
  } catch (error) {
    return res
      .status(BADREQUEST_STATUS)
      .json(
        new ErrorResponseDTO(error.message, error.cause, BADREQUEST_STATUS)
      );
  }
};

const deleteOrderValidation = z.object({
  orderNumber: stringValidator(10),
});

exports.deleteOrderValidationMiddleware = async (req, res, next) => {
  try {
    await checkValidation(deleteOrderValidation, req.params);
    next();
  } catch (error) {
    return res
      .status(BADREQUEST_STATUS)
      .json(
        new ErrorResponseDTO(error.message, error.cause, BADREQUEST_STATUS)
      );
  }
};

const updateOrderValidation = z.object({
  orderNumber: stringValidator(10),
  orderItems: arrayValidator(
    z.object({
      productName: stringValidator(10),
      productQuantity: numberValidator,
    }),
    1
  ),
});

exports.updateOrderValidationMiddleware = async (req, res, next) => {
  try {
    await checkValidation(updateOrderValidation, req.body);
    next();
  } catch (error) {
    return res
      .status(BADREQUEST_STATUS)
      .json(
        new ErrorResponseDTO(error.message, error.cause, BADREQUEST_STATUS)
      );
  }
};
