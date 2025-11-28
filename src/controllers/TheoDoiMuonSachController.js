const THEODOIMUONSACH = require("../models/TheoDoiMuonSach");

const ThemTHEODOIMUONSACH = async (req, res) => {
  try {
    const nowVN = new Date();
    const next7days = new Date(nowVN);
    next7days.setDate(nowVN.getDate() + 7);
    // const newSACH = new THEODOIMUONSACH(req.body);
    const newTheoDoi = new THEODOIMUONSACH({
      MADOCGIA: 1,
      MASACH: 2,
      NGAYMUON: nowVN,
      NGAYTRA: next7days,
    });
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
    const list = await THEODOIMUONSACH.find();
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
    const { MADOCGIA, MASACH } = req.body;

    const sach = await SACH.findOne({ MASACH });
    if (!sach) return res.status(404).json({ message: "Sách không tồn tại" });

    if (sach.SOQUYEN == 0)
      return res.status(400).json({ message: "Sách đã hết số lượng!" });

    // Giảm số lượng sách
    await SACH.updateOne({ MASACH }, { $inc: { SOQUYEN: -1 } });

    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() + 14); // hạn trả 14 ngày

    const newBorrow = new THEODOIMUONSACH({
      MADOCGIA,
      MASACH,
      NGAYMUON: today,
      NGAYTRA: dueDate,
      PHAT: 0,
    });

    const result = await newBorrow.save();

    return res.status(201).json({
      message: "Mượn sách thành công",
      data: result,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Lỗi mượn sách", error: err.message });
  }
};

const TraSach = async (req, res) => {
  try {
    const { MADOCGIA, MASACH } = req.body;

    let record = await THEODOIMUONSACH.findOne({
      MADOCGIA,
      MASACH,
      PHAT: 0, // chưa trả
    });

    if (!record)
      return res
        .status(404)
        .json({ message: "Không tìm thấy phiếu mượn hợp lệ" });

    const today = new Date();
    let fine = 0;

    if (today > record.NGAYTRA) {
      const lateDays = Math.ceil(
        (today - new Date(record.NGAYTRA)) / (1000 * 60 * 60 * 24)
      );
      fine = lateDays * 5000; // 5000đ/ngày
    }

    record.PHAT = fine;
    record.NGAYTRA = today;
    await record.save();

    // trả lại 1 quyển sách
    await SACH.updateOne({ MASACH }, { $inc: { SOQUYEN: 1 } });

    return res.status(200).json({
      message: "Trả sách thành công",
      fine,
      data: record,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Lỗi trả sách", error: err.message });
  }
};

module.exports = {
  ThemTHEODOIMUONSACH,
  EditTHEODOIMUONSACH,
  GetTHEODOIMUONSACH,
  DeleteTHEODOIMUONSACH,
  MuonSach,
  TraSach,
};
