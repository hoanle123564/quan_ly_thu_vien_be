const SACH = require("../models/Sach");

const ThemSACH = async (req, res) => {
  try {
    // const newSACH = new SACH(req.body);
    const newSACH = new SACH(req.body);
    console.log("newSACH", newSACH);
    const result = await newSACH.save(); // Mongoose tự validate ở đây
    res.status(201).json({ message: "Sách thêm thành công", data: result });
  } catch (err) {
    res.status(400).json({ message: "Lỗi thêm sách", error: err.message });
  }
};

const EditSACH = async (req, res) => {
  try {
    const { MASACH } = req.body;

    const result = await SACH.findOneAndUpdate({ MASACH }, req.body, {
      new: true,
    });

    if (!result)
      return res.status(404).json({ message: "Không tìm thấy sách" });

    res.json({ message: "Cập nhật thành công", data: result });
  } catch (error) {
    res.status(500).json({ message: "Lỗi update", error: error.message });
  }
};
const GetSACH = async (req, res) => {
  try {
    const list = await SACH.aggregate([
      {
        $lookup: {
          from: "NHAXUATBAN", // tên collection NXB
          localField: "MANXB", // số MANXB bên SACH
          foreignField: "MANXB", // số MANXB bên NHAXUATBAN
          as: "NXB",
        },
      },
      {
        $unwind: "$NXB", // tách object
      },
      {
        $project: {
          MASACH: 1,
          TENSACH: 1,
          TACGIA: 1,
          SOQUYEN: 1,
          NAMXUATBAN: 1,
          DONGIA: 1,
          MANXB: 1,
          ANH: 1,
          TENNXB: "$NXB.TENNXB",
          DIACHI: "$NXB.DIACHI",
        },
      },
    ]);

    return res.status(200).json({ message: "list SACH!", data: list });
  } catch (error) {
    return res.status(500).json({
      message: "Can't get list SACH",
      error: error.message,
    });
  }
};

const DeleteSACH = async (req, res) => {
  try {
    const { MASACH } = req.body;

    if (!MASACH) {
      return res.status(400).json({ message: "MASACH is required" });
    }

    // 1. Kiểm tra sách có tồn tại không
    const sach = await SACH.findOne({ MASACH });
    if (!sach) {
      return res.status(404).json({ message: "Sách không tồn tại" });
    }

    // 2. Kiểm tra sách có đang được độc giả mượn không
    const dangMuon = await THEODOIMUONSACH.findOne({
      MASACH: MASACH,
      DATRASACH: false,
    });

    if (dangMuon) {
      return res.status(400).json({
        message: "Không thể xóa! Sách đang được độc giả mượn và chưa trả.",
      });
    }

    // 3. Xóa sách nếu không ai đang mượn
    const result = await SACH.deleteOne({ MASACH });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Sách không tồn tại" });
    }

    return res.status(200).json({ message: "Xóa sách thành công!" });
  } catch (error) {
    return res.status(500).json({
      message: "Không thể xóa sách!",
      error: error.message,
    });
  }
};

module.exports = { ThemSACH, EditSACH, GetSACH, DeleteSACH };
