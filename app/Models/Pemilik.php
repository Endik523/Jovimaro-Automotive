<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pemilik extends Model
{
    protected $table = 'pemilik';

    protected $fillable = ['nama', 'alamat', 'aktif'];

    protected $casts = [
        'aktif' => 'boolean',
    ];

    public function kendaraan()
    {
        return $this->hasMany(Kendaraan::class, 'pemilik_id');
    }
}
