import express from 'express';
import cors from 'cors';
import publicRoutes from './routes/public.js'
import privateRoutes from './routes/private.js'
import auth from '../middlewares/auth.js'

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use('/', publicRoutes);
app.use('/', auth, privateRoutes);

export default app;