import { pool } from '../config/database';
import { Department } from "./departmentModel";


export interface Academy {
  id?: number;
  name: string;
  parentDepartment: Department;
  
  lastModification: string;
  lastContributor: string;
}