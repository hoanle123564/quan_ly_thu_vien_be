const NHAXUATBAN = require("../models/NhaXuatBan");
const SACH = require("../models/Sach");

const ThemNHAXUATBAN = async (req, res) => {
  try {
    // const newNHAXUATBAN = new NHAXUATBAN(req.body);
    const newNHAXUATBAN = new NHAXUATBAN(req.body);
    const result = await newNHAXUATBAN.save(); // Mongoose tự validate ở đây
    res
      .status(201)
      .json({ message: "Nhà xuất bản thêm thành công", data: result });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Lỗi thêm nhà xuất bản", error: err.message });
  }
};
const EditNHAXUATBAN = async (req, res) => {
  try {
    const { MANXB } = req.body;
    const result = await NHAXUATBAN.findOneAndUpdate({ MANXB }, req.body, {
      new: true,
    });
    if (!result)
      return res.status(404).json({ message: "Không tìm thấy nhà xuất bản" });

    res.json({ message: "Cập nhật thành công", data: result });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
const GetNHAXUATBAN = async (req, res) => {
  try {
    const list = await NHAXUATBAN.find();
    return res.status(200).json({ message: "list NHAXUATBAN!", data: list });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Can't get list NHAXUATBAN", error: err.message });
  }
};
const DeleteNHAXUATBAN = async (req, res) => {
  try {
    const { MANXB } = req.body;

    if (!MANXB)
      return res.status(400).json({ message: "Thiếu mã nhà xuất bản" });

    // Kiểm tra xem nhà xuất bản có tồn tại không
    const nxb = await NHAXUATBAN.findOne({ MANXB });
    if (!nxb)
      return res.status(404).json({ message: "Nhà xuất bản không tồn tại" });

    // Kiểm tra xem nhà xuất bản có được sử dụng trong sách nào không
    const sachSuDung = await SACH.findOne({ MANXB });
    if (sachSuDung) {
      return res.status(400).json({
        message: `Không thể xóa! Nhà xuất bản đang được sử dụng trong sách "${sachSuDung.TENSACH}"`,
        sach: sachSuDung,
      });
    }

    // Nếu không có sách nào sử dụng, cho phép xóa
    await NHAXUATBAN.deleteOne({ MANXB });
    return res
      .status(200)
      .json({ message: "Xóa nhà xuất bản thành công!", data: nxb });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Không thể xóa", error: error.message });
  }
};
module.exports = {
  ThemNHAXUATBAN,
  EditNHAXUATBAN,
  GetNHAXUATBAN,
  DeleteNHAXUATBAN,
};
