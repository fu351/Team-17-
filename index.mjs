import express from 'express';
import searchRoutes from './search.js';
import uploadRoutes from './upload_update_download_rate.js';
import cors from 'cors';
const app = express();

app.use(cors());
app.use(express.json());



app.use(searchRoutes);
app.use(uploadRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));