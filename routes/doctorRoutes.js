const express = require('express');
const doctorController = require('../controller/doctorController');
const router = express.Router();

// Randevu al
router.post('/book-appointment', doctorController.bookAppointment);

// Belirli bir gün için boş saat dilimlerini al
router.get('/available-time-slots/:doctorId/:date', doctorController.getAvailableTimeSlots);

// Randevu zamanı uygunluğunu kontrol et
router.post('/check-availability', doctorController.checkAvailability);

//doktor ekle
router.post('/', doctorController.addDoctor)

//tüm doktorları getir
router.get('/', doctorController.getAllDoctor);

module.exports = router