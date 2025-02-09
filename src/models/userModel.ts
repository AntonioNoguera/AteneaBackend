import { pool } from '../config/database';

export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
}

export const getAllUsers = async (): Promise<User[]> => {
  const [rows] = await pool.query('SELECT * FROM users');
  return rows as User[];
};

export const createUser = async (user: User) => {
  const [result] = await pool.query('INSERT INTO users SET ?', user);
  return result;
};
