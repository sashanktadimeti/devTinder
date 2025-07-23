const validator = require("validator");
const validateSignup = (req) => {
  const { emailId, firstName, lastName, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("emailid is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("password is not strong...");
  }
};
const validateEditProfileData = (req) => {
  const editableFields = ["firstName", "lastName", "age", "skills", "photoUrl", "about"];
  const isEditAllowed = Object.keys(req.body).every((key) => {
    return editableFields.includes(key);
  });
  return isEditAllowed;
};
module.exports = { validateSignup, validateEditProfileData };
