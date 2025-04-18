const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const imageCompressionRouter = require('./routes/ImageCompression.route');
const videoCompressionRouter = require('./routes/VideoCompression.route');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/compression/image', imageCompressionRouter);
app.use('/api/compression/video', videoCompressionRouter);

const PORT = process.env.PORT || 5006;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
