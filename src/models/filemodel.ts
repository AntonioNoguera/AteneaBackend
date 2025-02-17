import { pool } from '../config/database';

export interface File {
  id?: number;
  name: string;
  type: string;
  
  size: string;
  addedAt: string;
}
