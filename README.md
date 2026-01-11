# Jovimaro Automotive

Aplikasi untuk menampilkan dan mengelola data pemilik kendaraan.

## Persyaratan

Sebelum menjalankan aplikasi, pastikan kamu sudah menginstal beberapa software berikut:

1. **PHP** (Minimal versi 7.3) untuk backend.
2. **Composer** untuk mengelola dependencies PHP.
3. **Node.js** dan **npm** (atau **Yarn**) untuk frontend.
4. **MySQL** atau **MariaDB** untuk database.

# Cara Menjalankan Aplikasi
## 1. Setup Database

Untuk menyiapkan database, ikuti langkah-langkah berikut:

**Buat Database:**

Buat database baru di MySQL atau MariaDB dengan nama jovimaroproject (atau nama lain sesuai preferensi).

**Contoh perintah SQL untuk membuat database:**

CREATE DATABASE jovimaroproject;


**Atur Koneksi Database di** .env:

Edit file .env yang ada di folder root proyek dan pastikan pengaturan database sesuai dengan database yang baru kamu buat.

**Contoh pengaturan** .env:

**DB_CONNECTION**=mysql
**DB_HOST**=127.0.0.1
**DB_PORT**=3306
**DB_DATABASE**=jovimaroproject
**DB_USERNAME**=root
**DB_PASSWORD**=


Pastikan nilai **DB_USERNAME** dan **DB_PASSWORD** sesuai dengan kredensial yang kamu gunakan di MySQL/MariaDB.

## 2. Menjalankan Backend (Laravel)

Untuk menjalankan backend aplikasi, ikuti langkah-langkah berikut:

**Install Dependencies PHP:**

Pastikan kamu sudah berada di folder proyek Laravel di terminal, lalu jalankan perintah ini untuk menginstal dependencies PHP dengan Composer:

composer install


**Jalankan Migration untuk Membuat Tabel:**

Setelah dependencies diinstal, jalankan migration untuk membuat tabel di database dengan perintah:

php artisan migrate


**Jalankan Backend:**

Setelah migration selesai, jalankan server backend menggunakan perintah berikut:

php artisan serve


Server akan berjalan di http://localhost:8000 (atau port yang kamu tentukan).

## 3. Menjalankan Frontend (Vue.js/React/Framework Lainnya)

Untuk menjalankan frontend aplikasi, ikuti langkah-langkah berikut:

**Install Dependencies Frontend:**

Pindah ke folder frontend (jika terpisah), lalu jalankan perintah ini untuk menginstal dependencies menggunakan npm:

npm install


**Jalankan Frontend:**

Setelah dependencies diinstal, jalankan server frontend dengan perintah berikut:

npm run dev


Aplikasi frontend akan berjalan di http://localhost:5173 (atau port lain yang dikonfigurasi).

## 4. Daftar API Endpoint

Berikut adalah beberapa API endpoint yang tersedia di aplikasi ini:

## Endpoint GET

**1. Get All Vehicles**

URL: /api/pemilik-kendaraan

Method: GET

Response: List kendaraan dalam format JSON.

**2. Get Vehicle by ID**

URL: /api/pemilik-kendaraan/{pemilikKendaraan}

Method: GET

Response: Data kendaraan berdasarkan ID.

## Endpoint POST

**3. Create New Vehicle**

URL: /api/pemilik-kendaraan

Method: POST

Body:

{
  "nama": "John Doe",
  "alamat": "Jl. Merdeka No. 123",
  "merk": "Toyota",
  "warna": "Red",
  "keterangan": "Mobil baru",
  "aktif": true
}


Response: Status berhasil atau gagal menambahkan kendaraan.

## Endpoint PUT

**4. Update Vehicle Data**

URL: /api/pemilik-kendaraan/{pemilikKendaraan}

Method: PUT

Body:

{
  "nama": "Jane Doe",
  "alamat": "Jl. Sudirman No. 456",
  "merk": "Honda",
  "warna": "Blue",
  "keterangan": "Mobil bekas",
  "aktif": true
}


Response: Status berhasil atau gagal memperbarui data kendaraan.

## Endpoint DELETE

**5. Delete Vehicle**

URL: /api/pemilik-kendaraan/{pemilikKendaraan}

Method: DELETE

Response: Status berhasil atau gagal menghapus kendaraan.

## 5. Penutupan

Jika kamu mengikuti langkah-langkah di atas, aplikasi seharusnya sudah bisa berjalan di lingkungan lokal kamu.

Proses untuk men-deploy aplikasi ke server atau platform hosting seperti Heroku atau DigitalOcean juga bisa dilakukan jika kamu ingin aplikasi berjalan secara online. Jika ada pertanyaan atau kesalahan, pastikan untuk memeriksa pesan error di terminal atau log aplikasi.

## 6. Tips Debugging

Jika Laravel tidak berjalan dengan baik: Pastikan kamu sudah menjalankan migration dan seeder dengan benar.

Jika tidak bisa mengakses API: Periksa apakah server Laravel sedang berjalan di http://localhost:8000 (atau port lain).

Cek Log Laravel: Kamu bisa memeriksa file log di storage/logs/laravel.log untuk mengetahui error lebih lanjut.
