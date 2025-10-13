const THEODOIMUONSACH = require('../models/TheoDoiMuonSach');

const ThemTHEODOIMUONSACH = async (req, res) => {
    try {
        const nowVN = new Date();
        const next7days = new Date(nowVN);
        next7days.setDate(nowVN.getDate() + 7);
        // const newSACH = new THEODOIMUONSACH(req.body);
        const newTheoDoi = new THEODOIMUONSACH({
            MADOCGIA: 1,
            MASACH: 2,
            NGAYMUON: nowVN,
            NGAYTRA: next7days
        });
        const result = await newTheoDoi.save(); // Mongoose tự validate ở đây
        res.status(201).json({ message: 'Thêm theo dõi thành công', data: result });
    } catch (err) {
        res.status(400).json({ message: 'Lỗi thêm theo dõi', error: err.message });
    }
};
const EditTHEODOIMUONSACH = async (req, res) => {
    try {
        await THEODOIMUONSACH.updateOne({ MASACH: 1 }, req.body);
        const result = await THEODOIMUONSACH.findOne({ MASACH: 1 });
        return res.status(200).json({ message: 'THEODOIMUONSACH updated!', data: result });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
const GetTHEODOIMUONSACH = async (req, res) => {
    try {
        const list = await THEODOIMUONSACH.find();
        return res.status(200).json({ message: 'list THEODOIMUONSACH!', data: list });
    } catch (error) {
        return res.status(500).json({ message: "Can't get list THEODOIMUONSACH", error: err.message });

    }
}
const DeleteTHEODOIMUONSACH = async (req, rs) => {
    try {
        await THEODOIMUONSACH.deleteOne({ MASACH: 1 });
        const result = await THEODOIMUONSACH.findOne({ MASACH: 1 });
        return res.status(200).json({ message: 'Delete complete !' });

    } catch (error) {
        return res.status(500).json({ message: "Can't delete", error: err.message });
    }
}
module.exports = { ThemTHEODOIMUONSACH, EditTHEODOIMUONSACH, GetTHEODOIMUONSACH, DeleteTHEODOIMUONSACH };