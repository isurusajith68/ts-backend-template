import { Request, Response } from "express";
import {
  loginUserDB,
  getUsers,
  getUserByIdFromDb,
  create,
  updateUserDB,
  deleteUserFromDB,
} from "../services/userService";
import { User } from "../model/userModel";

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await loginUserDB(email, password);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await getUserByIdFromDb(Number(id));
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, isActive } = req.body;
  try {
    const newUser: Omit<User, "id"> = {
      firstName,
      lastName,
      email,
      password,
      isActive: isActive ?? true,
    };
    const createdUser = await create(newUser);
    res.status(201).json(createdUser);
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { firstName, lastName, email, password, isActive } = req.body;
  try {
    const updatedUser = await updateUserDB(Number(id), {
      firstName,
      lastName,
      email,
      password,
      isActive,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await deleteUserFromDB(Number(id));
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};
