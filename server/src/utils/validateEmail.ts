import validator from "validator";

const validateEmail = (email: string): string | null => {
  const normalized = validator.normalizeEmail(email);
  if (normalized && validator.isEmail(normalized)) {
    return normalized; // return the clean, validated email
  }
  return null; // invalid email
};

export default validateEmail;
