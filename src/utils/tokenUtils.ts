import jwt from "jsonwebtoken";

interface User {
  id: number;
}

export const generateToken = (user: User): string => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });

  return token;
};
