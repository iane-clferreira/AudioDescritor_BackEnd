import express from 'express';
import cors from 'cors';
import publicRoutes from './routes/public.js'


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use('/', publicRoutes);

export default app;