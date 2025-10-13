const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const nxbSchema = new mongoose.Schema({
    TENNXB: { type: String, required: true },
    DIACHI: { type: String, required: true }
}, { collection: 'NHAXUATBAN' });
nxbSchema.plugin(AutoIncrement, { inc_field: 'MANXB' });

module.exports = mongoose.model('NHAXUATBAN', nxbSchema);
