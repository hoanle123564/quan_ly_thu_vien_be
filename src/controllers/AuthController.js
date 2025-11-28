const ACCOUNT = require("../models/Account");
const DOCGIA = require("../models/DocGia");
const NhanVien = require("../models/NhanVien");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "SIEU_BI_MAT_123"; // nên đưa vào .env

// USER REGISTER
const RegisterUser = async (req, res) => {
  try {
    const {
      username,
      password,
      holot,
      ten,
      phai,
      ngaysinh,
      diachi,
      dienthoai,
    } = req.body;

    // check trùng username
    const check = await ACCOUNT.findOne({ USERNAME: username });
    if (check) return res.status(400).json({ message: "Username đã tồn tại!" });

    // tạo user trong DOCGIA
    const newUser = new DOCGIA({
      HOLOT: holot,
      TEN: ten,
      NGAYSINH: ngaysinh,
      PHAI: phai,
      DIACHI: diachi,
      DIENTHOAI: dienthoai,
    });
    const savedUser = await newUser.save();

    // tạo tài khoản
    const hashed = await bcrypt.hash(password, 10);
    await ACCOUNT.create({
      USERNAME: username,
      PASSWORD: hashed,
      ROLE: "user",
      REF_ID: savedUser.MADOCGIA,
    });

    return res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi đăng ký", error: err.message });
  }
};

// USER LOGIN
const LoginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const acc = await ACCOUNT.findOne({ USERNAME: username, ROLE: "user" });
    if (!acc)
      return res.status(400).json({ message: "Sai username hoặc mật khẩu" });

    const check = await bcrypt.compare(password, acc.PASSWORD);
    if (!check)
      return res.status(400).json({ message: "Sai username hoặc mật khẩu" });

    const token = jwt.sign({ role: "user", refId: acc.REF_ID }, JWT_SECRET, {
      expiresIn: "2h",
    });

    return res.status(200).json({ token });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Lỗi login user", error: err.message });
  }
};

// ADMIN LOGIN
const LoginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const acc = await ACCOUNT.findOne({ USERNAME: username, ROLE: "admin" });
    if (!acc) return res.status(400).json({ message: "Sai tài khoản admin!" });
    console.log("PASSWORD INPUT:", password);
    console.log("PASSWORD IN DB:", acc.PASSWORD);
    const check = await bcrypt.compare(password, acc.PASSWORD);
    if (!check) return res.status(400).json({ message: "Sai mật khẩu!" });

    const token = jwt.sign({ role: "admin", refId: acc.REF_ID }, JWT_SECRET, {
      expiresIn: "2h",
    });

    return res.status(200).json({ token });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Lỗi login admin", error: err.message });
  }
};

// LOGOUT
// FE sẽ tự xóa token, không cần xử lý thêm
const Logout = async (req, res) => {
  return res.status(200).json({ message: "Đã logout" });
};

module.exports = {
  RegisterUser,
  LoginUser,
  LoginAdmin,
  Logout,
};
