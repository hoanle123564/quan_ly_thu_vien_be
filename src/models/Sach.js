const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const sachSchema = new mongoose.Schema(
  {
    TENSACH: { type: String, required: true },
    DONGIA: { type: Number, required: true, min: 0 },
    SOQUYEN: { type: Number, required: true, min: 0 },
    NAMXUATBAN: { type: Number, required: true },
    ANH: { type: String, default: "" },
    MANXB: { type: Number, required: true, ref: "NHAXUATBAN" },
    TACGIA: { type: String },
  },
  { collection: "SACH" }
);
sachSchema.plugin(AutoIncrement, { inc_field: "MASACH" });
sachSchema.pre("save", async function (next) {
  try {
    const NXB = mongoose.model("NHAXUATBAN");
    const exist = await NXB.exists({ MANXB: this.MANXB });

    if (!exist) return next(new Error(`Mã NXB ${this.MANXB} không tồn tại`));

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("SACH", sachSchema);
