const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const imageCompressionRouter = require('./routes/compression.route');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', imageCompressionRouter);

const PORT = process.env.PORT || 8084;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
