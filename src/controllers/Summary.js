const DOCGIA = require("../models/DocGia");
const SACH = require("../models/Sach");
const NHAXUATBAN = require("../models/NhaXuatBan");
const NhanVien = require("../models/NhanVien");
const THEODOIMUONSACH = require("../models/TheoDoiMuonSach");

const getSummary = async (req, res) => {
  try {
    const totalBooks = await SACH.countDocuments();
    const totalReaders = await DOCGIA.countDocuments();
    const totalEmployees = await NhanVien.countDocuments();
    const totalBorrow = await THEODOIMUONSACH.countDocuments();
    const totalNXB = await NHAXUATBAN.countDocuments();

    const borrowing = await THEODOIMUONSACH.countDocuments({
      DATRASACH: false,
    });

    const today = new Date();

    const overdue = await THEODOIMUONSACH.find({
      DATRASACH: false,
    });

    const overdueCount = overdue.filter((item) => {
      const due = new Date(item.NGAYMUON);
      due.setDate(due.getDate() + 7);
      return due < today;
    }).length;

    return res.json({
      totalBooks,
      totalReaders,
      totalEmployees,
      totalNXB,
      totalBorrow,
      borrowing,
      overdue: overdueCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const borrowByMonth = async (req, res) => {
  const year = parseInt(req.params.year) || new Date().getFullYear();

  try {
    const data = await THEODOIMUONSACH.aggregate([
      {
        $match: {
          NGAYMUON: {
            $gte: new Date(year, 0, 1),
            $lte: new Date(year, 11, 31),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$NGAYMUON" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    return res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const topBooks = async (req, res) => {
  try {
    const top = await THEODOIMUONSACH.aggregate([
      {
        $group: { _id: "$MASACH", total: { $sum: "$SOLUONG" } },
      },
      { $sort: { total: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "SACH",
          localField: "_id",
          foreignField: "MASACH",
          as: "book",
        },
      },
      { $unwind: "$book" },
    ]);

    res.json(top);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const borrowStatus = async (req, res) => {
  try {
    const today = new Date();

    // Số đang mượn
    const borrowing = await THEODOIMUONSACH.countDocuments({
      DATRASACH: false,
    });

    // Số đã trả
    const returned = await THEODOIMUONSACH.countDocuments({
      DATRASACH: true,
    });

    // Lấy toàn bộ đang mượn để kiểm tra hạn
    const allBorrowing = await THEODOIMUONSACH.find({
      DATRASACH: false,
    });

    // Tính đúng số lượng quá hạn
    const overdue = allBorrowing.filter((item) => {
      const due = new Date(item.NGAYMUON);
      due.setDate(due.getDate() + 7);
      return due < today;
    }).length;

    res.json({
      borrowing,
      returned,
      overdue,
      total: borrowing + returned,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = {
  getSummary,
  borrowByMonth,
  topBooks,
  borrowStatus,
};
