const mongoose = require("mongoose");

const theoDoiMuonSchema = new mongoose.Schema(
  {
    MADOCGIA: { type: Number, required: true, ref: "DOCGIA" },
    MASACH: { type: Number, required: true, ref: "SACH" },
    NGAYMUON: { type: Date, required: true },
    NGAYTRA: { type: Date },
    PHAT: { type: Number, default: 0 },
  },
  { collection: "THEODOIMUONSACH" }
);

//  Middleware kiểm tra khóa ngoại có tồn tại hay không
theoDoiMuonSchema.pre("save", async function (next) {
  try {
    const DOCGIA = mongoose.model("DOCGIA");
    const SACH = mongoose.model("SACH");

    // Kiểm tra MADOCGIA có tồn tại không
    const docGiaExists = await DOCGIA.exists({ MADOCGIA: this.MADOCGIA });
    if (!docGiaExists) {
      throw new Error(`Mã độc giả ${this.MADOCGIA} không tồn tại.`);
    }

    // Kiểm tra MASACH có tồn tại không
    const sachExists = await SACH.exists({ MASACH: this.MASACH });
    if (!sachExists) {
      throw new Error(`Mã sách ${this.MASACH} không tồn tại.`);
    }

    next(); // Cho phép lưu nếu hợp lệ
  } catch (err) {
    next(err); // Báo lỗi ra controller
  }
});
module.exports = mongoose.model("THEODOIMUONSACH", theoDoiMuonSchema);
