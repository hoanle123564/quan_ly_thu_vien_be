const DOCGIA = require("../models/DocGia");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const THEODOIMUONSACH = require("../models/TheoDoiMuonSach");
const ThemDocGia = async (req, res) => {
  try {
    const {
      MADOCGIA,
      HOLOT,
      TEN,
      NGAYSINH,
      PHAI,
      DIACHI,
      DIENTHOAI,
      Password,
    } = req.body;

    // Kiểm tra thông tin bắt buộc
    if (!MADOCGIA || !HOLOT || !TEN || !DIENTHOAI || !Password) {
      return res.status(400).json({
        message:
          "Thiếu thông tin bắt buộc: MADOCGIA, HOLOT, TEN, DIENTHOAI, PASSWORD!",
      });
    }

    // Kiểm tra mã độc giả trùng
    const exist = await DOCGIA.findOne({ MADOCGIA });
    if (exist) {
      return res.status(400).json({
        message: "Mã độc giả đã tồn tại!",
      });
    }

    // Validate số điện thoại (10 số)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(DIENTHOAI)) {
      return res.status(400).json({
        message: "Số điện thoại không hợp lệ! Phải gồm 10 chữ số.",
      });
    }

    // Validate ngày sinh
    if (NGAYSINH && new Date(NGAYSINH) > new Date()) {
      return res.status(400).json({
        message: "Ngày sinh không được vượt quá ngày hiện tại!",
      });
    }

    // 🔐 Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    // Tạo độc giả
    const newDocGia = new DOCGIA({
      MADOCGIA,
      HOLOT,
      TEN,
      NGAYSINH,
      PHAI,
      DIACHI,
      DIENTHOAI,
      Password: hashedPassword,
    });

    const result = await newDocGia.save();

    // Không trả password về client
    const { Password: pw, ...safeData } = result.toObject();

    return res.status(201).json({
      message: "Thêm độc giả thành công!",
      data: safeData,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi thêm độc giả!",
      error: err.message,
    });
  }
};

const EditDocGia = async (req, res) => {
  try {
    const { _id, ...updateData } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "Thiếu _id độc giả!" });
    }

    // Kiểm tra tồn tại
    const exist = await DOCGIA.findById(_id);
    if (!exist) {
      return res.status(404).json({ message: "Độc giả không tồn tại!" });
    }

    // Cập nhật
    await DOCGIA.updateOne({ _id: _id }, updateData);

    // Lấy lại dữ liệu mới nhất
    const updated = await DOCGIA.findById(_id);

    return res.status(200).json({
      message: "Cập nhật độc giả thành công!",
      data: updated,
    });
  } catch (err) {
    console.log("err", err);
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
const DeleteDocGia = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Kiểm tra độc giả có tồn tại không
    const docgia = await DOCGIA.findById(id);
    if (!docgia) {
      return res.status(404).json({ message: "Độc giả không tồn tại!" });
    }

    // 2. Kiểm tra độc giả có đang mượn sách (chưa trả)
    const dangMuon = await THEODOIMUONSACH.findOne({
      MADOCGIA: docgia.MADOCGIA,
      DATRASACH: false,
    });

    if (dangMuon) {
      return res.status(400).json({
        message: "Không thể xóa! Độc giả đang mượn sách và chưa trả.",
      });
    }

    // 3. XÓA toàn bộ lịch sử mượn trả của độc giả
    await THEODOIMUONSACH.deleteMany({ MADOCGIA: docgia.MADOCGIA });

    // 4. Xóa độc giả chính
    await DOCGIA.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Xóa độc giả và toàn bộ lịch sử mượn trả thành công!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi xóa độc giả!",
      error: error.message,
    });
  }
};

const LoginDocGia = async (req, res) => {
  try {
    const { madocgia, password } = req.body;

    // 1. Tìm độc giả theo mã
    const user = await DOCGIA.findOne({ MADOCGIA: madocgia });
    if (!user)
      return res.status(400).json({ message: "Mã độc giả không tồn tại" });

    // 2. So sánh mật khẩu HASH bằng bcrypt
    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu" });

    // 3. Tạo token như cũ
    const token = jwt.sign({ id: user.MADOCGIA, role: "user" }, "secretkey", {
      expiresIn: "1d",
    });

    // 4. Trả về y như code ban đầu
    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const GetDetailDocGia = async (req, res) => {
  try {
    const { madocgia } = req.query;
    const docgia = await DOCGIA.findOne({ MADOCGIA: madocgia });
    if (!docgia)
      return res.status(404).json({ message: "Độc giả không tồn tại" });
    return res.status(200).json({ message: "Detail DOCGIA!", data: docgia });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Can't get detail DOCGIA", error: err.message });
  }
};
module.exports = {
  ThemDocGia,
  EditDocGia,
  GetDocGia,
  DeleteDocGia,
  LoginDocGia,
  GetDetailDocGia,
};
