const THEODOIMUONSACH = require("../models/TheoDoiMuonSach");
const SACH = require("../models/Sach");
const ThemTHEODOIMUONSACH = async (req, res) => {
  try {
    const nowVN = new Date();
    const next7days = new Date(nowVN);
    next7days.setDate(nowVN.getDate() + 7);
    const newSACH = new THEODOIMUONSACH(req.body);

    const result = await newTheoDoi.save(); // Mongoose tự validate ở đây
    res.status(201).json({ message: "Thêm theo dõi thành công", data: result });
  } catch (err) {
    res.status(400).json({ message: "Lỗi thêm theo dõi", error: err.message });
  }
};
const EditTHEODOIMUONSACH = async (req, res) => {
  try {
    await THEODOIMUONSACH.updateOne({ MASACH: 1 }, req.body);
    const result = await THEODOIMUONSACH.findOne({ MASACH: 1 });
    return res
      .status(200)
      .json({ message: "THEODOIMUONSACH updated!", data: result });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
const GetTHEODOIMUONSACH = async (req, res) => {
  try {
    const list = await THEODOIMUONSACH.find()
      .populate({
        path: "docgia",
        select: "MADOCGIA HOLOT TEN DIACHI DIENTHOAI PHAI NGAYSINH",
      })
      .populate({
        path: "sach",
        select: "MASACH TENSACH TACGIA DONGIA SOQUYEN NAMXUATBAN MANXB ANH",
      });
    return res
      .status(200)
      .json({ message: "list THEODOIMUONSACH!", data: list });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Can't get list THEODOIMUONSACH", error: err.message });
  }
};

const DeleteTHEODOIMUONSACH = async (req, rs) => {
  try {
    await THEODOIMUONSACH.deleteOne({ MASACH: 1 });
    const result = await THEODOIMUONSACH.findOne({ MASACH: 1 });
    return res.status(200).json({ message: "Delete complete !" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Can't delete", error: err.message });
  }
};

const MuonSach = async (req, res) => {
  try {
    const { MADOCGIA, MASACH, SOLUONG } = req.body;

    if (!MADOCGIA || !MASACH || !SOLUONG)
      return res.status(400).json({ message: "Thiếu thông tin mượn sách!" });

    const sach = await SACH.findOne({ MASACH });
    if (!sach) return res.status(404).json({ message: "Sách không tồn tại!" });

    if (sach.SOQUYEN < SOLUONG)
      return res.status(400).json({
        message: `Chỉ còn ${sach.SOQUYEN} quyển, không đủ ${SOLUONG} quyển để mượn!`,
      });

    // Cập nhật kho
    await SACH.updateOne({ MASACH }, { $inc: { SOQUYEN: -SOLUONG } });

    const today = new Date();

    // KHÔNG lưu ngày trả dự kiến - để NULL
    const newBorrow = new THEODOIMUONSACH({
      MADOCGIA,
      MASACH,
      SOLUONG,
      NGAYMUON: today,
      NGAYTRA: null,
      PHAT: 0,
      DATRASACH: false,
    });

    const result = await newBorrow.save();

    return res.status(201).json({
      message: "Mượn sách thành công!",
      data: result,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Lỗi mượn sách!",
      error: err.message,
    });
  }
};

const TraSach = async (req, res) => {
  try {
    const { MADOCGIA, MASACH } = req.body;

    let record = await THEODOIMUONSACH.findOne({
      MADOCGIA,
      MASACH,
      DATRASACH: false, // chỉ lấy phiếu đang mượn
    });

    if (!record)
      return res
        .status(404)
        .json({ message: "Không tìm thấy phiếu mượn hợp lệ" });

    const today = new Date();
    let fine = 0;

    // ngày dự kiến = NGAYMUON + 7 ngày
    const dueDate = new Date(record.NGAYMUON);
    dueDate.setDate(dueDate.getDate() + 7);

    if (today > dueDate) {
      const lateDays = Math.ceil((today - dueDate) / 86400000);
      fine = lateDays * 5000;
    }

    // cập nhật vào DB
    record.PHAT = fine;
    record.NGAYTRA = today; // <<<<<< cập nhật ngày trả thực tế
    record.DATRASACH = true;

    await record.save();

    // trả lại sách vào kho
    await SACH.updateOne({ MASACH }, { $inc: { SOQUYEN: record.SOLUONG } });

    return res.status(200).json({
      message: "Trả sách thành công!",
      fine,
      data: record,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi trả sách",
      error: err.message,
    });
  }
};

const GetTHEODOIprivate = async (req, res) => {
  try {
    const { MADOCGIA } = req.query;

    const list = await THEODOIMUONSACH.find({ MADOCGIA, DATRASACH: false })
      .populate({
        path: "docgia",
        select: "MADOCGIA HOLOT TEN DIACHI DIENTHOAI PHAI NGAYSINH",
      })
      .populate({
        path: "sach",
        select: "MASACH TENSACH TACGIA DONGIA SOQUYEN NAMXUATBAN MANXB ANH",
      });

    return res.status(200).json({
      message: "Danh sách mượn sách (kèm đầy đủ thông tin)",
      data: list,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Không thể lấy dữ liệu",
      error: err.message,
    });
  }
};

const GetLichSuMuonPrivate = async (req, res) => {
  try {
    const { MADOCGIA } = req.query;

    const list = await THEODOIMUONSACH.find({ MADOCGIA })
      .populate({
        path: "docgia",
        select: "MADOCGIA HOLOT TEN DIACHI DIENTHOAI PHAI NGAYSINH",
      })
      .populate({
        path: "sach",
        select: "MASACH TENSACH TACGIA DONGIA SOQUYEN NAMXUATBAN MANXB ANH",
      });

    return res.status(200).json({
      message: "Lịch sử mượn sách (kèm đầy đủ thông tin)",
      data: list,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Không thể lấy dữ liệu",
      error: err.message,
    });
  }
};

module.exports = {
  ThemTHEODOIMUONSACH,
  EditTHEODOIMUONSACH,
  GetTHEODOIMUONSACH,
  DeleteTHEODOIMUONSACH,
  MuonSach,
  TraSach,
  GetTHEODOIprivate,
  GetLichSuMuonPrivate,
};
