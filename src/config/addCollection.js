const add = async (db) => {
    await db.createCollection("NHAXUATBAN", {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["MANXB", "TENNXB", "DIACHI"],
                additionalProperties: false,
                properties: {
                    MANXB: { bsonType: "string", description: "Mã nhà xuất bản (PK)" },
                    TENNXB: { bsonType: "string", description: "Tên nhà xuất bản" },
                    DIACHI: { bsonType: "string", description: "Địa chỉ" }
                }
            }
        }
    })
    await db.createCollection("SACH", {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["MASACH", "TENSACH", "DONGIA", "SOQUYEN", "NAMXUATBAN", "MANXB"],
                additionalProperties: false,
                properties: {
                    MASACH: { bsonType: "string", description: "Mã sách (PK)" },
                    TENSACH: { bsonType: "string", description: "Tên sách" },
                    DONGIA: { bsonType: "double", minimum: 0 },
                    SOQUYEN: { bsonType: "int", minimum: 1 },
                    NAMXUATBAN: { bsonType: "int" },
                    MANXB: { bsonType: "string", description: "Mã NXB (FK → NHAXUATBAN.MANXB)" },
                    NGUON_GOC_TACGIA: { bsonType: ["string", "null"], description: "Nguồn gốc hoặc tác giả" }
                }
            }
        }
    })
    await db.createCollection("DOCGIA", {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["MADOCGIA", "HOLOT", "TEN", "NGAYSINH", "PHAI", "DIACHI", "DIENTHOAI"],
                additionalProperties: false,
                properties: {
                    MADOCGIA: { bsonType: "string", description: "Mã độc giả (PK)" },
                    HOLOT: { bsonType: "string" },
                    TEN: { bsonType: "string" },
                    NGAYSINH: { bsonType: "date" },
                    PHAI: { bsonType: "string", enum: ["Nam", "Nữ"] },
                    DIACHI: { bsonType: "string" },
                    DIENTHOAI: { bsonType: "string", pattern: "^[0-9]{9,11}$" }
                }
            }
        }
    })
    await db.createCollection("THEODOIMUONSACH", {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["MADOCGIA", "MASACH", "NGAYMUON", "NGAYTRA"],
                additionalProperties: false,
                properties: {
                    MADOCGIA: { bsonType: "string", description: "FK → DOCGIA.MADOCGIA" },
                    MASACH: { bsonType: "string", description: "FK → SACH.MASACH" },
                    NGAYMUON: { bsonType: "date" },
                    NGAYTRA: { bsonType: ["date", "null"] }
                }
            }
        }
    })
    await db.createCollection("NhanVien", {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["MSNV", "HoTenNV", "Password", "ChucVu", "DiaChi", "SoDienThoai"],
                additionalProperties: false,
                properties: {
                    MSNV: { bsonType: "string", description: "Mã nhân viên (PK)" },
                    HoTenNV: { bsonType: "string" },
                    Password: { bsonType: "string", minLength: 6 },
                    ChucVu: { bsonType: "string" },
                    DiaChi: { bsonType: "string" },
                    SoDienThoai: { bsonType: "string", pattern: "^[0-9]{9,11}$" }
                }
            }
        }
    })
    return db;
}
module.exports = add;