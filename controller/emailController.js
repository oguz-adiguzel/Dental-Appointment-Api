const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid'); // Kod üretmek için uuid paketi kullanıyoruz.

let verificationCodes = {}; // Doğrulama kodlarını saklamak için geçici bir obje (Bu objeyi prod ortamda veritabanında tutmanız daha güvenlidir).

// Email doğrulama kodu gönderme fonksiyonu
exports.sendVerificationCode = async (req, res) => {
    const { email } = req.body;

    // Benzersiz bir doğrulama kodu oluştur
    const verificationCode = uuidv4().split('-')[0]; // UUID'den sadece ilk kısmı alıyoruz (6 karakter)

    // Kodu geçici objeye kaydet
    verificationCodes[email] = verificationCode;

    // Nodemailer ile email gönderme işlemi
    // const transporter = nodemailer.createTransport({
    //     host: 'smtp.outlook.com',
    //     port: 587,
    //     secure:false,
    //     auth: {
    //         user: 'ogzdgzl@hotmail.com',
    //         pass: '05442385843',
    //     }
    // });

    const outputMessage = `
   <div style="width:100%; display:flex; justify-content:center; align-items:center">
    <div style="width:80%; padding: 20px 0px;">
      <h1>Dental Online Randevu Sistemi</h1>
      <h1>Randevu Doğrulma Kodunuz</h1>
      <p>${verificationCode}</p>
    </div>
   </div>
    `
  
    

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'kenya.klein11@ethereal.email',
            pass: 'K6S3uZBv9FXQYmYG3s'
        }
    });

    // const transporter = nodemailer.createTransport({
    //     service: 'hotmail',  // Hotmail veya Outlook kullanıyorsanız bu alanı 'hotmail' olarak bırakın
    //     auth: {
    //         user: 'oguz_adiguzel@outlook.com',    // Outlook e-posta adresiniz
    //         pass: '2015ea2019zaa'          // Outlook uygulama şifreniz (normal şifre değil!)
    //     }
    // });

    // const transporter = nodemailer.createTransport({
    //     host: 'smtp.outlook.com',
    // port: 465,
    // secure: true, // use SSL
    //     auth: {
    //         user: 'ogzdgzl@hotmail.com',
    //         pass: '05442385843'
    //     }
    // });

    // E-posta içeriğini ayarla
    let mailOptions = {
        from: '"Dental Online Randevu Sistemi" <ogzdgzl@hotmail.com>',
        to: email,
        subject: 'Email Doğrulama Kodu',
        html: outputMessage
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Doğrulama kodu e-posta adresinize gönderildi.' });
    } catch (error) {
        console.error('Email gönderim hatası:', error);
        res.status(500).json({ message: 'Doğrulama kodu gönderilemedi.', error });
    }
};

// Email doğrulama fonksiyonu
exports.verifyCode = (req, res) => {
    const { email, code } = req.body;

    // Gönderilen kod ile kaydedilen kodu karşılaştır
    if (verificationCodes[email] && verificationCodes[email] === code) {
        delete verificationCodes[email]; // Kod doğruysa sil
        res.status(200).json({ message: 'Email başarıyla doğrulandı.' });
    } else {
        res.status(400).json({ message: 'Geçersiz veya hatalı doğrulama kodu.' });
    }
};
