const express = require('express');
const searchRoutes = require('./search.js');
const uploadRoutes = require('./upload_update_download_rate.js');

const app = express();

app.use(searchRoutes);
app.use(uploadRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));