import { pool } from '../config/database';
import {Academy} from './academyModel'

export interface Subject {
  id?: number;
  name: string;
  parentAcademy: Academy;
  
  lastModification: string;
  lastContributor: string;
}
