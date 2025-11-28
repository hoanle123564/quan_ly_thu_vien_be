const SACH = require("../models/Sach");

const ThemSACH = async (req, res) => {
  try {
    // const newSACH = new SACH(req.body);
    const newSACH = new SACH({
      TENSACH: "Đế mèn phiêu lưu ký",
      DONGIA: 50000,
      SOQUYEN: 10,
      NAMXUATBAN: 2008,
      MANXB: 1,
      TACGIA: "Tô Hoài",
    });
    const result = await newSACH.save(); // Mongoose tự validate ở đây
    res.status(201).json({ message: "Sách thêm thành công", data: result });
  } catch (err) {
    res.status(400).json({ message: "Lỗi thêm sách", error: err.message });
  }
};
const EditSACH = async (req, res) => {
  try {
    await SACH.updateOne({ MASACH: 1 }, req.body);
    const result = await SACH.findOne({ MASACH: 1 });
    return res.status(200).json({ message: "SACH updated!", data: result });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
const GetSACH = async (req, res) => {
  try {
    const list = await SACH.find();
    return res.status(200).json({ message: "list SACH!", data: list });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Can't get list SACH", error: err.message });
  }
};
const DeleteSACH = async (req, rs) => {
  try {
    await SACH.deleteOne({ MASACH: 1 });
    const result = await SACH.findOne({ MASACH: 1 });
    return res.status(200).json({ message: "Delete complete !" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Can't delete", error: err.message });
  }
};
module.exports = { ThemSACH, EditSACH, GetSACH, DeleteSACH };
