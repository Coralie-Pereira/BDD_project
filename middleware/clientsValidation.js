const z = require("zod");
const {
  stringValidator,
  emailValidator,
  arrayValidator,
  numberValidator,
  dateValidator,
} = require("../lib/validators");
const { BADREQUEST_STATUS } = require("../constants/constants");
const ErrorResponseDTO = require("../dto/ErrorResponseDTO");
const { checkValidation } = require("../utils/checkValidation");

const clientValidationPOST = z.object({
  email_client: emailValidator(50),
  purchases: arrayValidator(
    z.object({ product_name: stringValidator(10), quantity: numberValidator }),
    1
  ),
});

exports.postClientsValidation = async (req, res, next) => {
  try {
    await checkValidation(clientValidationPOST, req.body);
    next();
  } catch (error) {
    return res
      .status(BADREQUEST_STATUS)
      .json(
        new ErrorResponseDTO(error.message, error.cause, BADREQUEST_STATUS)
      );
  }
};

const clientValidationGET = z.object({
  start_date: dateValidator.optional(),
  end_date: dateValidator.optional(),
});

exports.getClientsValidation = async (req, res, next) => {
  try {
    await checkValidation(clientValidationGET, req.query);
    next();
  } catch (error) {
    return res
      .status(BADREQUEST_STATUS)
      .json(
        new ErrorResponseDTO(error.message, error.cause, BADREQUEST_STATUS)
      );
  }
};

const clientValidationDELETE = z.object({
  client_id: stringValidator(10),
});

exports.deleteClientsValidation = async (req, res, next) => {
  try {
    await checkValidation(clientValidationDELETE, req.params);
    next();
  } catch (error) {
    return res
      .status(BADREQUEST_STATUS)
      .json(
        new ErrorResponseDTO(error.message, error.cause, BADREQUEST_STATUS)
      );
  }
};

const clientValidationPUT = z.object({
  client_id: stringValidator(10),
  purchases: arrayValidator(
    z.object({ product_name: stringValidator(10), quantity: numberValidator }),
    1
  ),
});

exports.putClientsValidation = async (req, res, next) => {
  try {
    await checkValidation(clientValidationPUT, req.body);
    next();
  } catch (error) {
    return res
      .status(BADREQUEST_STATUS)
      .json(
        new ErrorResponseDTO(error.message, error.cause, BADREQUEST_STATUS)
      );
  }
};
