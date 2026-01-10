<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pemilik_kendaraan', function (Blueprint $table) {
            $table->id();

            $table->string('nama_pemilik', 150);
            $table->string('merk_mobil', 120);
            $table->string('warna_mobil', 50);
            $table->text('alamat')->nullable();
            $table->text('keterangan')->nullable();

            $table->boolean('aktif')->default(true);

            // tetap pakai standar Laravel
            $table->timestamps();

            $table->index(['nama_pemilik', 'merk_mobil', 'warna_mobil']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pemilik_kendaraan');
    }
};
