const validator = require("validator");

const validateSignupData = (data) => {
  const { firstname, lastname, emailId, password, age, gender } = data;

  // ✅ Required fields
  if (!firstname || !emailId || !password || !gender) {
    throw new Error("Required fields missing");
  }

  // ✅ Email validation
  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email format");
  }

  // ✅ Password validation
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  // ✅ Age validation
  if (age && age < 18) {
    throw new Error("Age must be 18+");
  }

  // ✅ Gender validation
  if (!["male", "female", "other"].includes(gender)) {
    throw new Error("Invalid gender");
  }

  // ✅ Allowed fields (security 🔥)
  const allowedFields = [
    "firstname",
    "lastname",
    "emailId",
    "password",
    "age",
    "gender"
  ];

  const isValidOperation = Object.keys(data).every((key) =>
    allowedFields.includes(key)
  );

  if (!isValidOperation) {
    throw new Error("Invalid fields in request");
  }
};

module.exports = { validateSignupData };