import pool from "../config/db";
import { User } from "../model/userModel";

export const loginUserDB = async (
  email: string,
  password: string
): Promise<User | null> => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1 AND password = $2",
    [email, password]
  );
  return result.rows.length ? result.rows[0] : null;
};

export const getUsers = async (): Promise<User[]> => {
  const result = await pool.query("SELECT * FROM users");
  return result.rows;
};

export const getUserByIdFromDb = async (id: number): Promise<User | null> => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows.length ? result.rows[0] : null;
};

export const create = async (user: Omit<User, "id">): Promise<User> => {
  const { firstName, lastName, email, password, isActive } = user;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      firstName VARCHAR(100) NOT NULL,
      lastName VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      isActive BOOLEAN DEFAULT TRUE
    )
  `);

  const result = await pool.query(
    "INSERT INTO users (firstName, lastName, email, password, isActive) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [firstName, lastName, email, password, isActive]
  );

  return result.rows[0];
};

export const updateUserDB = async (
  id: number,
  user: Partial<User>
): Promise<User> => {
  const { firstName, lastName, email, password, isActive } = user;
  const result = await pool.query(
    "UPDATE users SET firstName = $1, lastName = $2, email = $3, password = $4, isActive = $5 WHERE id = $6 RETURNING *",
    [firstName, lastName, email, password, isActive, id]
  );
  return result.rows[0];
};

export const deleteUserFromDB = async (id: number): Promise<void> => {
  await pool.query("DELETE FROM users WHERE id = $1", [id]);
};
