const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const nhanVienSchema = new mongoose.Schema({
    HoTenNV: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true,
        minlength: 6
    },
    ChucVu: {
        type: String,
        required: true
    },
    DiaChi: {
        type: String,
        required: true
    },
    SoDienThoai: {
        type: String,
        required: true,
        match: /^[0-9]{9,11}$/ // regex pattern
    }
}, { collection: 'NhanVien' });
nhanVienSchema.plugin(AutoIncrement, { inc_field: 'MSNV' });
module.exports = mongoose.model('NhanVien', nhanVienSchema);
