import * as express from 'express';
import cors = require('cors');
import * as dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api', userRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});