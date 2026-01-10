<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PemilikKendaraan extends Model
{
    protected $table = 'pemilik_kendaraan';

    protected $fillable = [
        'nama_pemilik',
        'merk_mobil',
        'warna_mobil',
        'alamat',
        'keterangan',
        'aktif',
    ];

    protected $casts = [
        'aktif' => 'boolean',
    ];
}
