import { pool } from '../config/database';

export interface Theme {
  id?: number;
  content: string; 

  addedAt: string;
}
