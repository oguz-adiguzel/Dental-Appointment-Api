const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

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
    patientDepartment
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
      patientDepartment
    });

    const savedAppointment = await newAppointment.save();

    // Doktorun randevu listesine ekle
    const doctor = await Doctor.findById(doctorId);
    doctor.appointments.push(savedAppointment._id);
    await doctor.save();

    res.status(200).json({
      appointment: savedAppointment,
      message: "Randevu Oluşturuldu",
    })
  } catch (error) {
    res.status(500).send("Bir Hata Oluştu.");
  }
};

// Belirtilen tarih için uygun zaman dilimlerini kontrol et
exports.checkAvailability = async (req, res) => {
  const { doctorId, date } = req.body;

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).send("Doctor not found");

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

exports.addDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
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
