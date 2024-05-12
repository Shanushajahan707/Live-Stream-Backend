import app from './app';
import dotenv from 'dotenv';
import { connectDatabase } from './providers/database';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes'
import channelRoutes from './routes/channeRoutes'
dotenv.config();
connectDatabase()
const port = process.env.PORT || 3001;

app.use('/', userRoutes);
app.use('/',adminRoutes)
app.use('/',channelRoutes)


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
