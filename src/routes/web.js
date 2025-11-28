const express = require("express");
const router = express.Router();
const {
  ThemNV,
  EditNV,
  GetNV,
  DeleteNV,
  LoginNhanVien,
} = require("../controllers/NhanVienController");
const {
  ThemDocGia,
  EditDocGia,
  GetDocGia,
  DeleteDocGia,
  LoginDocGia,
} = require("../controllers/DocGiaController");
const {
  ThemNHAXUATBAN,
  EditNHAXUATBAN,
  GetNHAXUATBAN,
  DeleteNHAXUATBAN,
} = require("../controllers/NhaXuatBanController");
const {
  ThemSACH,
  EditSACH,
  GetSACH,
  DeleteSACH,
} = require("../controllers/SachController");
const {
  ThemTHEODOIMUONSACH,
  EditTHEODOIMUONSACH,
  GetTHEODOIMUONSACH,
  DeleteTHEODOIMUONSACH,
  MuonSach,
  TraSach,
} = require("../controllers/TheoDoiMuonSachController");

const {
  RegisterUser,
  LoginUser,
  LoginAdmin,
  Logout,
} = require("../controllers/AuthController");

router.get("/", (req, res) => {
  return res.send("hello");
});
router.get("/hello", (req, res) => {
  return res.render("hello.ejs");
});

// CRUD NhanVien
router.post("/api/add-staff", ThemNV);
router.patch("/api/edit-staff", EditNV);
router.get("/api/get-all-staff", GetNV);
router.delete("/api/delete-staff", DeleteNV);
router.post("/api/login-nhanvien", LoginNhanVien);

// CRUD DOCGIA
router.post("/api/add-docgia", ThemDocGia);
router.patch("/api/edit-docgia", EditDocGia);
router.get("/api/get-all-docgia", GetDocGia);
router.delete("/api/delete-docgia", DeleteDocGia);
router.post("/api/login-docgia", LoginDocGia);

// CRUD NHAXUATBAN
router.post("/api/add-NXB", ThemNHAXUATBAN);
router.patch("/api/edit-NXB", EditNHAXUATBAN);
router.get("/api/get-all-NXB", GetNHAXUATBAN);
router.delete("/api/delete-NXB", DeleteNHAXUATBAN);

// CRUD SACH
router.post("/api/add-sach", ThemSACH);
router.patch("/api/edit-sach", EditSACH);
router.get("/api/get-all-sach", GetSACH);
router.delete("/api/delete-sach", DeleteSACH);

// CRUD THEODOIMUONSACH
router.post("/api/add-theodoi", ThemTHEODOIMUONSACH);
router.patch("/api/edit-theodoi", EditTHEODOIMUONSACH);
router.get("/api/get-all-theodoi", GetTHEODOIMUONSACH);
router.delete("/api/delete-theodoi", DeleteTHEODOIMUONSACH);
router.post("/api/muon-sach", MuonSach);
router.post("/api/tra-sach", TraSach);

// AUTH USER
router.post("/api/register-user", RegisterUser);
router.post("/api/login-user", LoginUser);

// AUTH ADMIN
router.post("/api/login-admin", LoginAdmin);

// LOGOUT (FE sẽ tự xoá token)
router.post("/api/logout", Logout);

module.exports = router;
