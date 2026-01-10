<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('kendaraan', function (Blueprint $table) {
            $table->id();

            $table->foreignId('pemilik_id')
                ->constrained('pemilik')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->string('merk', 120);
            $table->string('warna', 50);
            $table->text('keterangan')->nullable();
            $table->boolean('aktif')->default(true);

            $table->timestamps();

            $table->index(['merk', 'warna']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kendaraan');
    }
};
