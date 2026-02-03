import express from 'express';
import dotenv from 'dotenv';
import route from './routers/index.js';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.APP_PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

route(app);

app.listen(PORT, () => {
  console.log(`SeedGame chạy tại: http://localhost:${PORT}`);
});
