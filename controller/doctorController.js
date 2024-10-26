const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// Randevu oluştur
exports.bookAppointment = async (req, res) => {
  const {
    doctorId,
    patientName,
    date,
    timeSlot,
    patientSurName,
    patientEmail,
    patientPhone,
    patientAddress,
    patientMessage,
    patientDepartment,
    confirm,
  } = req.body;

  try {
    // Önce zaman diliminin uygun olup olmadığını kontrol et
    const isSlotTaken = await Appointment.findOne({
      doctorId,
      date,
      timeSlot,
    });

    if (isSlotTaken) {
      return res.status(400).send("This time slot is already booked.");
    }

    // Randevu oluştur ve kaydet
    const newAppointment = new Appointment({
      patientName,
      date,
      timeSlot,
      doctorId,
      patientSurName,
      patientEmail,
      patientPhone,
      patientAddress,
      patientMessage,
      patientDepartment,
      confirm: confirm ? confirm : false,
    });

    const savedAppointment = await newAppointment.save();

    // Doktorun randevu listesine ekle
    const doctor = await Doctor.findById(doctorId);
    doctor.appointments.push(savedAppointment._id);
    await doctor.save();

    res.status(200).json({
      appointment: savedAppointment,
      message: "Randevu Oluşturuldu",
    });
  } catch (error) {
    res.status(500).send("Bir Hata Oluştu.");
  }
};

// Randevu oluştur
exports.adminBookAppointment = async (req, res) => {
  const {
    doctorId,
    patientName,
    date,
    timeSlot,
    patientSurName,
    patientEmail,
    patientPhone,
  } = req.body;

  try {
    // Önce zaman diliminin uygun olup olmadığını kontrol et
    const isSlotTaken = await Appointment.findOne({
      doctorId,
      date,
      timeSlot,
    });

    if (isSlotTaken) {
      return res.status(400).send("This time slot is already booked.");
    }

    // Randevu oluştur ve kaydet
    const newAppointment = new Appointment({
      patientName,
      date,
      timeSlot,
      doctorId,
      patientSurName,
      patientEmail,
      patientPhone,
    });

    const savedAppointment = await newAppointment.save();

    // Doktorun randevu listesine ekle
    const doctor = await Doctor.findById(doctorId);
    doctor.appointments.push(savedAppointment._id);
    await doctor.save();

    res.status(200).json({
      appointment: savedAppointment,
      message: "Randevu Oluşturuldu",
    });
  } catch (error) {
    res.status(500).send("Bir Hata Oluştu.");
  }
};

exports.confirmAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.body.id);
    appointment.confirm = true;
    appointment.save();
    res.status(200).json({ message: "Randevu Onaylandı" });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.body.id);
    res.json({ message: "Randevu getirildi", appointment: appointment });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", status: 500 });
  }
};

exports.getAllAppointment = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json({ message: "Randevular getirildi", appointments: appointments });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", status: 500 });
  }
};

// Belirtilen tarih için uygun zaman dilimlerini kontrol et
exports.checkAvailability = async (req, res) => {
  const { doctorId, date } = req.body;

  console.log('date', date);
  

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).send("Doctor not found");
    
    const d = doctor.unavailableDates.find((item)=> item === date)
    
    if (d) {
      return res.status(200).json({ message: "Doktor için bu tarihte randevu alınamıyor" });
    }
   
    const timeSlots = [
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
    ];

    // O doktora ait, belirtilen tarihteki randevuları bul
    const appointments = await Appointment.find({
      doctorId,
      date,
    });

    // Dolu olan zaman dilimlerini bul
    const bookedSlots = appointments.map((appointment) => appointment.timeSlot);

    // Boş olan zaman dilimlerini hesapla
    const availableSlots = timeSlots.filter(
      (slot) => !bookedSlots.includes(slot)
    );

    res.status(200).json({
      availableSlots,
      message: "Müsait saatler getirildi",
    });
  } catch (error) {
    res
      .status(500)
      .send("An error occurred while fetching the available time slots.");
  }
};

exports.adminCheckAvailability = async (req, res) => {
  const { doctorId, date } = req.body;

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).send("Doctor not found");

    const timeSlots = [
      "09:30",
      "10:30",
      "11:30",
      "12:30",
      "13:30",
      "14:30",
      "15:30",
      "16:30",
    ];

    // O doktora ait, belirtilen tarihteki randevuları bul
    const appointments = await Appointment.find({
      doctorId,
      date,
    });

    // Dolu olan zaman dilimlerini bul
    const bookedSlots = appointments.map((appointment) => appointment.timeSlot);

    // Boş olan zaman dilimlerini hesapla
    const availableSlots = timeSlots.filter(
      (slot) => !bookedSlots.includes(slot)
    );

    res.status(200).json({
      availableSlots,
      message: "Müsait saatler getirildi",
    });
  } catch (error) {
    res
      .status(500)
      .send("An error occurred while fetching the available time slots.");
  }
};

exports.addDoctor = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "smartEdu",
    }
  );

  try {
    const doctor = await Doctor.create({
      name: req.body.name,
      department: req.body.department,
      experience: req.body.experience,
      certificates: req.body.certificates,
      awards: req.body.awards,
      photoUrl: result.secure_url,
    });
    res.status(201).json({ message: "Doktor oluşturuldu" });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.getAllDoctor = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json({ message: "Doktorlar getirildi", doctors: doctors });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", status: 500 });
  }
};

exports.getADoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ slug: req.params.slug });
    res.status(200).json({
      doctor,
      message: "Doctor getirildi",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

// Belirli bir gün için boş saat dilimlerini al
exports.getAvailableTimeSlots = async (req, res) => {
  const { doctorId, date } = req.params;

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).send("Doctor not found");
    }

    const timeSlots = [
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
    ];

    // O doktora ait randevuları bul
    const appointments = await Appointment.find({
      doctorId,
      date,
    });

    // O gün dolu olan zaman dilimlerini bul
    const bookedSlots = appointments.map((appointment) => appointment.timeSlot);

    // Boş olan zaman dilimlerini hesapla
    const availableSlots = timeSlots.filter(
      (slot) => !bookedSlots.includes(slot)
    );

    res.status(200).json(availableSlots);
  } catch (error) {
    res
      .status(500)
      .send("An error occurred while fetching available time slots.");
  }
};

exports.closeDate = async (req, res) => {
  const { doctorId } = req.body;
  const { date } = req.body;

  try {
    // Tarihi `Date` formatına dönüştürme
    // const closedDate = new Date(date);

    // Doktoru güncelleme
    await Doctor.findByIdAndUpdate(
      doctorId,
      { $addToSet: { unavailableDates: date } }, // Belirtilen tarihi `unavailableDates`'e ekle
      { new: true }
    );

    res.status(200).json({ message: "Tarih kapatıldı." });
  } catch (error) {
    console.error("Tarih kapatma hatası:", error);
    res.status(500).json({ message: "Tarih kapatılamadı." });
  }
};