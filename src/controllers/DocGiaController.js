const DOCGIA = require("../models/DocGia");
const bcrypt = require("bcryptjs");

const ThemDocGia = async (req, res) => {
  try {
    const newDocGia = new DOCGIA(req.body);
    const result = await newDocGia.save();
    res.status(201).json({ message: "Độc giả thêm thành công", data: result });
  } catch (err) {
    res.status(400).json({ message: "Lỗi thêm độc giả", error: err.message });
  }
};

const EditDocGia = async (req, res) => {
  try {
    await DOCGIA.updateOne({ MADOCGIA: 1 }, req.body);
    const result = await DOCGIA.findOne({ MADOCGIA: 1 });
    return res.status(200).json({ message: "DOCGIA updated!", data: result });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
const GetDocGia = async (req, res) => {
  try {
    const list = await DOCGIA.find();
    return res.status(200).json({ message: "list DOCGIA!", data: list });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Can't get list DOCGIA", error: err.message });
  }
};
const DeleteDocGia = async (req, rs) => {
  try {
    await DOCGIA.deleteOne({ MADOCGIA: 1 });
    const result = await DOCGIA.findOne({ MADOCGIA: 1 });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Can't delete", error: err.message });
  }
};

const jwt = require("jsonwebtoken");

const LoginDocGia = async (req, res) => {
  try {
    const { madocgia, password } = req.body;

    const user = await DOCGIA.findOne({ MADOCGIA: madocgia });
    if (!user)
      return res.status(400).json({ message: "Mã độc giả không tồn tại" });

    if (user.Password !== password)
      return res.status(400).json({ message: "Sai mật khẩu" });

    const token = jwt.sign({ id: user.MADOCGIA, role: "user" }, "secretkey", {
      expiresIn: "2h",
    });

    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
module.exports = {
  ThemDocGia,
  EditDocGia,
  GetDocGia,
  DeleteDocGia,
  LoginDocGia,
};
