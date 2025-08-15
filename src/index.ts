//index.ts

import * as express from 'express';
import * as dotenv from 'dotenv';
import cors = require('cors'); 
 
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes'
import departmentRoutes from './routes/departmentRoutes'; 
import academyRoutes from './routes/academyRoutes'

import { errorHandler } from "./middleware/errorHandler";
import { authMiddleware } from './middleware/auth';
 
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes); //Endpoints sin validación

app.use('/api', authMiddleware);
app.use('/api', userRoutes); 
app.use('/api', departmentRoutes); 
app.use('/api', academyRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});