const express = require("express");
const mongoose = require("mongoose");
const doctorRoutes = require("./routes/doctorRoutes");
const emailRoutes = require("./routes/emailRoutes");
const blogRoutes = require("./routes/blogRoutes");
const authRoutes = require("./routes/authRoute");
const cors = require("cors");
const app = express();
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
const path = require("path"); // path modülünü ekliyoruz
require("dotenv").config();

app.use(express.json());

// İsteklerdeki gizli anahtarı kontrol eden middleware
const authMiddleware = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (apiKey && apiKey === process.env.API_SECRET_KEY) {
    next();
  } else {
    res.status(403).json({ message: "Erişim reddedildi" });
  }
};

// Middleware
app.use(cors());
app.use(fileUpload({ useTempFiles: true }));
app.use(express.static(path.join(__dirname, "public/Site2")));
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

mongoose
  .connect(
    `mongodb+srv://oguzadiguzel:${process.env.MONGO_DB_PASSWORD}@cluster0.nesm6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
    {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useFindAndModify: false,
      // useCreateIndex: true,
    }
  )
  .then(() => {
    console.log("DB Connected Susccesfuly");
  });

// Rotalar
app.use("/doctors", authMiddleware, doctorRoutes);
app.use("/email", authMiddleware, emailRoutes);
app.use("/blog", authMiddleware, blogRoutes);
app.use("/admin", authMiddleware, authRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/Site2", "index.html"));
});

// Sunucuyu başlat
const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
