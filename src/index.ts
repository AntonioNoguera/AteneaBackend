//index.ts

import * as express from 'express';
import * as dotenv from 'dotenv';
import cors = require('cors'); 
 
import userRoutes from './routes/userRoutes';
import departmentRoutes from './routes/departmentRoutes';
import authRoutes from './routes/authRoutes'

import { errorHandler } from "./middleware/errorHandler";
 
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', userRoutes); 
app.use('/api', departmentRoutes);
app.use("/api", authRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});