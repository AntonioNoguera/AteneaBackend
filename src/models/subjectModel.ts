import { pool } from '../config/database';

export interface Academy {
  id?: number;
  name: string;
  parentAcademy: string;
  
  lastModification: string;
  lastContributor: string;
}
