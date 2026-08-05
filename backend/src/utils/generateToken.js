import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || "super_secret_jwt_key_study_abroad_2026";
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign({ id: userId }, secret, { expiresIn });
};

export const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || "super_secret_jwt_key_study_abroad_2026";
  return jwt.verify(token, secret);
};

export default generateToken;