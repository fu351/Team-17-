import express from 'express';
import searchRoutes from './search.js';
import uploadRoutes from './upload_update_download_rate.js';
import deleteRoutes from './delete.js';
import bodyParser from 'body-parser';

import cors from 'cors';
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(express.json());

app.use(searchRoutes);
app.use(uploadRoutes);
app.use(deleteRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));
