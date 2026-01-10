<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kendaraan;
use App\Models\Pemilik;
use Illuminate\Http\Request;

class PemilikKendaraanController extends Controller
{
    public function index(Request $request)
    {
        $q = Kendaraan::with('pemilik');

        if ($request->filled('nama')) {
            $q->whereHas('pemilik', function ($sub) use ($request) {
                $sub->where('nama', 'like', '%' . $request->nama . '%');
            });
        }

        if ($request->filled('merk')) {
            $q->where('merk', 'like', '%' . $request->merk . '%');
        }

        if ($request->filled('warna')) {
            $q->where('warna', 'like', '%' . $request->warna . '%');
        }

        return $q->orderByDesc('id')->paginate(10)->withQueryString();
    }



    public function store(Request $request)
    {
        $valid = $request->validate([
            'nama'       => ['required', 'string', 'max:150'],
            'alamat'     => ['nullable', 'string'],
            'merk'       => ['required', 'string', 'max:120'],
            'warna'      => ['required', 'string', 'max:50'],
            'keterangan' => ['nullable', 'string'],
            'aktif'      => ['nullable', 'boolean'],
        ]);

        // 1) buat pemilik
        $pemilik = Pemilik::create([
            'nama'  => $valid['nama'],
            'alamat' => $valid['alamat'] ?? null,
            'aktif' => $valid['aktif'] ?? true,
        ]);

        // 2) buat kendaraan terkait pemilik
        $kendaraan = Kendaraan::create([
            'pemilik_id' => $pemilik->id,
            'merk'       => $valid['merk'],
            'warna'      => $valid['warna'],
            'keterangan' => $valid['keterangan'] ?? null,
            'aktif'      => $valid['aktif'] ?? true,
        ]);

        return response()->json([
            'pesan' => 'Data berhasil disimpan',
            'data'  => $kendaraan->load('pemilik'),
        ], 201);
    }
    public function show(Kendaraan $pemilikKendaraan)
    {
        return response()->json($pemilikKendaraan);
    }


    public function update(Request $request, Kendaraan $pemilikKendaraan)
    {
        $valid = $request->validate([
            'nama'       => ['sometimes', 'required', 'string', 'max:150'],
            'alamat'     => ['nullable', 'string'],
            'merk'       => ['sometimes', 'required', 'string', 'max:120'],
            'warna'      => ['sometimes', 'required', 'string', 'max:50'],
            'keterangan' => ['nullable', 'string'],
            'aktif'      => ['nullable', 'boolean'],
        ]);

        // update kendaraan
        $pemilikKendaraan->update([
            'merk'       => $valid['merk'] ?? $pemilikKendaraan->merk,
            'warna'      => $valid['warna'] ?? $pemilikKendaraan->warna,
            'keterangan' => array_key_exists('keterangan', $valid) ? $valid['keterangan'] : $pemilikKendaraan->keterangan,
            'aktif'      => array_key_exists('aktif', $valid) ? $valid['aktif'] : $pemilikKendaraan->aktif,
        ]);

        // update pemilik relasi (kalau ada inputnya)
        if ($pemilikKendaraan->pemilik) {
            $pemilikKendaraan->pemilik->update([
                'nama'   => $valid['nama'] ?? $pemilikKendaraan->pemilik->nama,
                'alamat' => array_key_exists('alamat', $valid) ? $valid['alamat'] : $pemilikKendaraan->pemilik->alamat,
                'aktif'  => array_key_exists('aktif', $valid) ? $valid['aktif'] : $pemilikKendaraan->pemilik->aktif,
            ]);
        }

        return response()->json([
            'pesan' => 'Data berhasil diperbarui',
            'data'  => $pemilikKendaraan->fresh()->load('pemilik'),
        ]);
    }

    public function destroy(Kendaraan $pemilikKendaraan)
    {
        $pemilikKendaraan->delete();

        return response()->json([
            'pesan' => 'Data berhasil dihapus'
        ]);
    }
}
