import { pool } from '../config/database';

export interface Academy {
  id?: number;
  name: string;
  parentDepartment: string;
  
  lastModification: string;
  lastContributor: string;
}