const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");

let verificationCodes = {};

// Email doğrulama kodu gönderme fonksiyonu
exports.sendVerificationCode = async (req, res) => {
  const { email } = req.body;

  // Benzersiz bir doğrulama kodu oluştur
  const verificationCode = uuidv4().split("-")[0];

  // Kodu geçici objeye kaydet
  verificationCodes[email] = verificationCode;

  const outputMessage = `
   <div style="width:100%; display:flex; justify-content:center; align-items:center">
    <div style="width:80%; padding: 20px 0px;">
      <h1>Dental Online Randevu Sistemi</h1>
      <h1>Randevu Doğrulma Kodunuz</h1>
      <p>${verificationCode}</p>
    </div>
   </div>
<<<<<<< HEAD
    `;
  const transporter = nodemailer.createTransport({
      host: 'smtp.elasticemail.com',
      port: 2525,
      auth: {
          user: 'oguz_adiguzel@outlook.com',
          pass: process.env.MAIl_PASSWORD
      }
  });

  let mailOptions = {
    from: '"oguz_adiguzel@outlook.com',
    to: 'oguz_adiguzel@outlook.com',
    subject: "Email Doğrulama Kodu",
    html: outputMessage,
  };

  try {
    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ message: "Doğrulama kodu e-posta adresinize gönderildi." });
  } catch (error) {
    console.error("Email gönderim hatası:", error);
    res.status(500).json({ message: "Doğrulama kodu gönderilemedi.", error });
  }
};

// Email doğrulama fonksiyonu
exports.verifyCode = (req, res) => {
  const { email, code } = req.body;

  // Gönderilen kod ile kaydedilen kodu karşılaştır
  if (verificationCodes[email] && verificationCodes[email] === code) {
    delete verificationCodes[email]; // Kod doğruysa sil
    res.status(200).json({ message: "Email başarıyla doğrulandı." });
  } else {
    res.status(400).json({ message: "Geçersiz veya hatalı doğrulama kodu." });
  }
};
