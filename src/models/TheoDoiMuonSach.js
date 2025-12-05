const mongoose = require("mongoose");

const theoDoiMuonSchema = new mongoose.Schema(
  {
    MADOCGIA: { type: String, required: true, ref: "DOCGIA" },
    MASACH: { type: Number, required: true, ref: "SACH" },
    SOLUONG: { type: Number, required: true },
    NGAYMUON: { type: Date, required: true },
    DATRASACH: { type: Boolean, default: false },
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
theoDoiMuonSchema.virtual("docgia", {
  ref: "DOCGIA",
  localField: "MADOCGIA",
  foreignField: "MADOCGIA",
  justOne: true,
});

theoDoiMuonSchema.virtual("sach", {
  ref: "SACH",
  localField: "MASACH",
  foreignField: "MASACH",
  justOne: true,
});
theoDoiMuonSchema.set("toObject", { virtuals: true });
theoDoiMuonSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("THEODOIMUONSACH", theoDoiMuonSchema);
