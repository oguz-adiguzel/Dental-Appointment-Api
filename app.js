const express = require('express');
const mongoose = require('mongoose');
const doctorRoutes = require('./routes/doctorRoutes');
const emailRoutes = require('./routes/emailRoutes');
const blogRoutes = require('./routes/blogRoutes')
const authRoutes = require('./routes/authRoute')
const cors = require('cors')
const app = express();
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
const path = require('path'); // path modülünü ekliyoruz
require('dotenv').config();

// Middleware
app.use(express.json());
app.use(cors())
app.use(fileUpload({ useTempFiles: true }));
app.use(express.static(path.join(__dirname, 'public/Site2')));
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

mongoose
  .connect(`mongodb+srv://oguzadiguzel:${process.env.MONGO_DB_PASSWORD}@cluster0.nesm6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useFindAndModify: false,
    // useCreateIndex: true,
  })
  .then(() => {
    console.log("DB Connected Susccesfuly");
  });


// Rotalar
app.use('/doctors', doctorRoutes);
app.use('/email', emailRoutes);
app.use('/blog', blogRoutes)
app.use('/admin', authRoutes)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Site2', 'index.html'));
});

// Sunucuyu başlat
const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));