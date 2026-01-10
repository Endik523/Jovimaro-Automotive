<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kendaraan extends Model
{
    protected $table = 'kendaraan';

    protected $fillable = [
        'pemilik_id',
        'merk',
        'warna',
        'keterangan',
        'aktif',
    ];

    protected $casts = [
        'aktif' => 'boolean',
    ];

    public function pemilik()
    {
        return $this->belongsTo(Pemilik::class, 'pemilik_id');
    }
}
