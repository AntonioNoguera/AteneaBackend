import { pool } from '../config/database';

export interface Department {
  id?: number;
  name: string;
  
  lastContributor: string;
  lastModification: string;
}
