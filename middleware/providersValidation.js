const z = require("zod");
const { stringValidator } = require("../lib/validators");
const { BADREQUEST_STATUS } = require("../constants/constants");
const ErrorResponseDTO = require("../dto/ErrorReponseDTO");
const { checkValidation } = require("../utils/checkValidation");

const createProviderValidation = z.object({
  providerName: stringValidator(50),
});

exports.createProviderValidationMiddleware = async (req, res, next) => {
  try {
    await checkValidation(createProviderValidation, req.body);
    next();
  } catch (error) {
    return res
      .status(BADREQUEST_STATUS)
      .json(
        new ErrorResponseDTO(error.message, error.cause, BADREQUEST_STATUS)
      );
  }
};

const deleteProviderValidation = z.object({
  providerName: stringValidator(50),
});

exports.deleteProviderValidationMiddleware = async (req, res, next) => {
  try {
    await checkValidation(deleteProviderValidation, req.params);
    next();
  } catch (error) {
    return res
      .status(BADREQUEST_STATUS)
      .json(
        new ErrorResponseDTO(error.message, error.cause, BADREQUEST_STATUS)
      );
  }
};

const updateProviderValidation = z.object({
  providerName: stringValidator(50),
  updatedProviderName: stringValidator(50),
});

exports.updateProviderValidationMiddleware = async (req, res, next) => {
  try {
    await checkValidation(updateProviderValidation, req.body);
    next();
  } catch (error) {
    return res
      .status(BADREQUEST_STATUS)
      .json(
        new ErrorResponseDTO(error.message, error.cause, BADREQUEST_STATUS)
      );
  }
};
