import app from './app';
import dotenv from 'dotenv';
import { connectDatabase } from './providers/database';
import routes from './routes/userRoutes';

dotenv.config();
connectDatabase()
const port = process.env.PORT || 3001;

app.use('/', routes);



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
