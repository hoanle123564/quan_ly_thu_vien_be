const NhanVien = require("../models/NhanVien");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ThemNV = async (req, res) => {
  try {
    const newNV = new NhanVien(req.body);
    //         {
    //   MSNV: "1",
    //   HoTenNV: "Le Ngoc Hoan",
    //   Password: "123456",
    //   ChucVu: "NhanVien",
    //   DiaChi: "CanTho City",
    //   SoDienThoai: "0868487499"
    // }
    const result = await newNV.save(); // Mongoose tự validate ở đây
    res
      .status(201)
      .json({ message: "Nhân viên thêm thành công", data: result });
  } catch (err) {
    res.status(400).json({ message: "Lỗi thêm nhân viên", error: err.message });
  }
};
const EditNV = async (req, res) => {
  try {
    await NhanVien.updateOne({ MSNV: 1 }, req.body);
    const result = await NhanVien.findOne({ MSNV: 1 });
    return res.status(200).json({ message: "NhanVien updated!", data: result });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
const GetNV = async (req, res) => {
  try {
    const list = await NhanVien.find();
    return res.status(200).json({ message: "list NhanVien!", data: list });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Can't get list NhanVien", error: err.message });
  }
};
const DeleteNV = async (req, rs) => {
  try {
    await NhanVien.deleteOne({ MSNV: 1 });
    const result = await NhanVien.findOne({ MSNV: 1 });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Can't delete", error: err.message });
  }
};
const LoginNhanVien = async (req, res) => {
  try {
    const { masnv, password } = req.body;

    const nv = await NhanVien.findOne({ MSNV: masnv });
    if (!nv) return res.status(400).json({ message: "MSNV không tồn tại" });

    // So sánh bcrypt
    const check = await bcrypt.compare(password, nv.Password);

    if (!check) return res.status(400).json({ message: "Sai mật khẩu" });

    const token = jwt.sign({ id: nv.MSNV, role: "admin" }, "secretkey", {
      expiresIn: "2h",
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { ThemNV, EditNV, GetNV, DeleteNV, LoginNhanVien };
