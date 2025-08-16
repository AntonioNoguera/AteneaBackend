//index.ts

import * as express from 'express';
import * as dotenv from 'dotenv';

import cors = require('cors'); 
 
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import departmentRoutes from './routes/departmentRoutes'; 
import academyRoutes from './routes/academyRoutes';
import subjectRoutes from './routes/subjectRoutes';
import fileRoutes from './routes/filesRoutes';

import { errorHandler } from "./middleware/errorHandler";
import { authMiddleware } from './middleware/auth';
 
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/v1', authRoutes); //Endpoints sin validación
 
app.use("/v1", fileRoutes);
app.use('/v1', authMiddleware);
app.use('/v1', userRoutes); 
app.use('/v1', departmentRoutes); 
app.use('/v1', academyRoutes);
app.use('/v1', subjectRoutes);
 

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

console.log("S3 region:", process.env.AWS_REGION, "bucket:", process.env.AWS_BUCKET_NAME);
