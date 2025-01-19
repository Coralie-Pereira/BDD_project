const z = require("zod");
exports.urlvalidator = z.string().url();

exports.stringValidator = (maxLength) =>
  z
    .string({ message: "Erreur: Le type d'entrée est incorrecte." })
    .max(maxLength, "Erreur: L'entrée est trop longue.")
    .nonempty("Erreur : L'entrée est incorrecte.");

exports.numberValidator = z.number({
  message: "Le type d'entrée est incorrecte.",
});

exports.emailValidator = (maxLength) =>
  z
    .string({ message: "Le type d'entrée est incorrecte." })
    .email("L'email est invalide.")
    .max(maxLength, "L'entrée est trop longue.");

exports.booleanValidator = z.boolean();

exports.dateValidator = z.string().date();

exports.arrayValidator = (type, length) =>
  z
    .array(type, { message: "Erreur sur le tableau d'entrée" })
    .min(length, "Le tableau est vide");
