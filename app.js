import express from 'express';
import searchRoutes from './search.js';
import uploadRoutes from './upload_update_download_rate.js';
import { console } from 'console';
import cors from 'cors';
const app = express();

app.use(cors());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


app.use(searchRoutes);
app.use(uploadRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));