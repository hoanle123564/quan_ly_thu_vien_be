const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const sachSchema = new mongoose.Schema({
    TENSACH: { type: String, required: true },
    DONGIA: { type: Number, required: true, min: 0 },
    SOQUYEN: { type: Number, required: true, min: 0 },
    NAMXUATBAN: { type: Number, required: true },
    MANXB: { type: String, required: true, ref: 'NHAXUATBAN' },
    TACGIA: { type: String }
}, { collection: 'SACH' });
sachSchema.plugin(AutoIncrement, { inc_field: 'MASACH' });
module.exports = mongoose.model('SACH', sachSchema);
