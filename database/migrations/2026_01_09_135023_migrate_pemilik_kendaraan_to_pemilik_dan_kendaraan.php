<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        // 1) Insert pemilik unik (berdasarkan nama + alamat + aktif)
        // Catatan: ini asumsi. Kalau ada 2 orang namanya sama alamat sama, dianggap 1.
        DB::statement("
            INSERT INTO pemilik (nama, alamat, aktif, created_at, updated_at)
            SELECT
                pk.nama_pemilik as nama,
                pk.alamat as alamat,
                pk.aktif as aktif,
                MIN(pk.created_at) as created_at,
                MAX(pk.updated_at) as updated_at
            FROM pemilik_kendaraan pk
            GROUP BY pk.nama_pemilik, pk.alamat, pk.aktif
        ");

        // 2) Insert kendaraan, sambungkan ke pemilik via join nama+alamat+aktif
        DB::statement("
            INSERT INTO kendaraan (pemilik_id, merk, warna, keterangan, aktif, created_at, updated_at)
            SELECT
                p.id as pemilik_id,
                pk.merk_mobil as merk,
                pk.warna_mobil as warna,
                pk.keterangan as keterangan,
                pk.aktif as aktif,
                pk.created_at as created_at,
                pk.updated_at as updated_at
            FROM pemilik_kendaraan pk
            JOIN pemilik p
              ON p.nama = pk.nama_pemilik
             AND ( (p.alamat IS NULL AND pk.alamat IS NULL) OR p.alamat = pk.alamat )
             AND p.aktif = pk.aktif
        ");
    }

    public function down(): void
    {
        // rollback aman: hapus kendaraan dulu baru pemilik
        DB::table('kendaraan')->truncate();
        DB::table('pemilik')->truncate();
    }
};
