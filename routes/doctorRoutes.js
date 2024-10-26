const express = require('express');
const doctorController = require('../controller/doctorController');
const router = express.Router();

// Randevu al
router.post('/book-appointment', doctorController.bookAppointment);

// Admin randevu al
router.post('/book-appointment-admin', doctorController.adminBookAppointment);


// Belirli bir gün için boş saat dilimlerini al
router.get('/available-time-slots/:doctorId/:date', doctorController.getAvailableTimeSlots);

// Randevu zamanı uygunluğunu kontrol et
router.post('/check-availability', doctorController.checkAvailability);

// Admin için randevu zamanı uygunluğunu kontrol et
router.post('/check-availability-admin', doctorController.adminCheckAvailability);

//doktor ekle
router.post('/', doctorController.addDoctor)

//Randevu onayla
router.post('/confirm', doctorController.confirmAppointment)

//Randevu terihi kapatma
router.post('/closeDate', doctorController.closeDate)

//Tek randevu getir
router.post('/getAppointment', doctorController.getAppointment)

//tüm doktorları getir
router.get('/', doctorController.getAllDoctor);

//Tüm randevuları getir
router.get('/getAllAppointment', doctorController.getAllAppointment);

router.get('/:slug', doctorController.getADoctor)

module.exports = router