import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

app.use(
    cors({
        origin: ["http://127.0.0.1:8000", "http://localhost:8000"],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Accept"],
    })
);

const pool = mysql.createPool({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "jovimaroproject",
    waitForConnections: true,
    connectionLimit: 10,
});

app.get("/api/pemilik-kendaraan", async (req, res) => {
    try {
        const page = Math.max(1, Number(req.query.page || 1));
        const perPage = 10;
        const offset = (page - 1) * perPage;

        const nama = (req.query.nama || "").trim();
        const merk = (req.query.merk || "").trim();

        const where = [];
        const params = [];

        if (nama) {
            where.push("p.nama LIKE ?");
            params.push(`%${nama}%`);
        }
        if (merk) {
            where.push("k.merk LIKE ?");
            params.push(`%${merk}%`);
        }

        const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

        const [countRows] = await pool.query(
            `SELECT COUNT(*) AS total
       FROM kendaraan k
       JOIN pemilik p ON p.id = k.pemilik_id
       ${whereSql}`,
            params
        );

        const total = countRows[0].total;

        const [rows] = await pool.query(
            `SELECT
         k.id, k.merk, k.warna, k.keterangan, k.aktif,
         JSON_OBJECT('id', p.id, 'nama', p.nama, 'alamat', p.alamat, 'aktif', p.aktif) AS pemilik
       FROM kendaraan k
       JOIN pemilik p ON p.id = k.pemilik_id
       ${whereSql}
       ORDER BY k.id DESC
       LIMIT ? OFFSET ?`,
            [...params, perPage, offset]
        );

        res.json({
            current_page: page,
            data: rows.map((r) => ({ ...r, pemilik: JSON.parse(r.pemilik) })),
            from: total ? offset + 1 : 0,
            to: Math.min(offset + perPage, total),
            per_page: perPage,
            total,
            prev_page_url:
                page > 1
                    ? `http://127.0.0.1:3000/api/pemilik-kendaraan?page=${
                          page - 1
                      }`
                    : null,
            next_page_url:
                offset + perPage < total
                    ? `http://127.0.0.1:3000/api/pemilik-kendaraan?page=${
                          page + 1
                      }`
                    : null,
            links: [
                {
                    url:
                        page > 1
                            ? `http://127.0.0.1:3000/api/pemilik-kendaraan?page=${
                                  page - 1
                              }`
                            : null,
                    label: "Previous",
                    active: false,
                },
                {
                    url: `http://127.0.0.1:3000/api/pemilik-kendaraan?page=${page}`,
                    label: String(page),
                    active: true,
                },
                {
                    url:
                        offset + perPage < total
                            ? `http://127.0.0.1:3000/api/pemilik-kendaraan?page=${
                                  page + 1
                              }`
                            : null,
                    label: "Next",
                    active: false,
                },
            ],
        });
    } catch (e) {
        res.status(500).json({
            message: "Server error",
            error: String(e.message || e),
        });
    }
});

app.put("/api/pemilik-kendaraan/:id", async (req, res) => {
    const id = Number(req.params.id);
    const { nama, alamat, merk, warna, keterangan, aktif } = req.body;

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const [kRows] = await conn.query(
            "SELECT pemilik_id FROM kendaraan WHERE id = ?",
            [id]
        );
        if (!kRows.length)
            return res.status(404).json({ message: "Data tidak ditemukan" });

        const pemilikId = kRows[0].pemilik_id;

        await conn.query(
            "UPDATE kendaraan SET merk=?, warna=?, keterangan=?, aktif=? WHERE id=?",
            [merk, warna, keterangan ?? null, aktif ? 1 : 0, id]
        );

        await conn.query(
            "UPDATE pemilik SET nama=?, alamat=?, aktif=? WHERE id=?",
            [nama, alamat ?? null, aktif ? 1 : 0, pemilikId]
        );

        await conn.commit();
        res.json({ message: "Data berhasil diperbarui" });
    } catch (e) {
        await conn.rollback();
        res.status(500).json({
            message: "Server error",
            error: String(e.message || e),
        });
    } finally {
        conn.release();
    }
});

app.listen(3000, () =>
    console.log("Node API running on http://127.0.0.1:3000")
);
