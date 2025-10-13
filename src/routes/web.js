const express = require('express')
const router = express.Router();
const { ThemNV, EditNV, GetNV, DeleteNV } = require('../controllers/NhanVienController')
const { ThemDocGia, EditDocGia, GetDocGia, DeleteDocGia } = require('../controllers/DocGiaController');
const { ThemNHAXUATBAN, EditNHAXUATBAN, GetNHAXUATBAN, DeleteNHAXUATBAN } = require('../controllers/NhaXuatBanController');

router.get('/', (req, res) => {
    return res.send('hello')
})
router.get('/hello', (req, res) => {
    return res.render('hello.ejs')
})

// CRUD NhanVien
router.post('/api/add-staff', ThemNV)
router.patch('/api/edit-staff', EditNV)
router.get('/api/get-all-staff', GetNV)
router.delete('/api/delete-staff', DeleteNV)

// CRUD DOCGIA
router.post('/api/add-docgia', ThemDocGia)
router.patch('/api/edit-docgia', EditDocGia)
router.get('/api/get-all-docgia', GetDocGia)
router.delete('/api/delete-docgia', DeleteDocGia)

// CRUD NHAXUATBAN
router.post('/api/add-NXB', ThemNHAXUATBAN)
router.patch('/api/edit-NXB', EditNHAXUATBAN)
router.get('/api/get-all-NXB', GetNHAXUATBAN)
router.delete('/api/delete-NXB', DeleteNHAXUATBAN)
module.exports = router