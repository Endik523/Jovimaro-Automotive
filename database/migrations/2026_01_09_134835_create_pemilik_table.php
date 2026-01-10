<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pemilik', function (Blueprint $table) {
            $table->id();
            $table->string('nama', 150);
            $table->text('alamat')->nullable();
            $table->boolean('aktif')->default(true);
            $table->timestamps();

            // optional: untuk mempercepat pencarian nama
            $table->index('nama');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pemilik');
    }
};
