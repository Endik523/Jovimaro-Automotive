<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PemilikKendaraanController;


Route::get('/pemilik-kendaraan', [PemilikKendaraanController::class, 'index']);
Route::post('/pemilik-kendaraan', [PemilikKendaraanController::class, 'store']);
Route::get('/pemilik-kendaraan/{pemilikKendaraan}', [PemilikKendaraanController::class, 'show']);
Route::put('/pemilik-kendaraan/{pemilikKendaraan}', [PemilikKendaraanController::class, 'update']);
