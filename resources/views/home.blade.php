<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Jovimaro Automotive</title>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=inter:400,500,600" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    @vite(['resources/css/jovimaro.css', 'resources/js/jovimaro.js'])


</head>

<body>
    <div class="container">
        <div class="header">
            <h1>Jovimaro Automotive</h1>
            <p>Manajemen Data Pemilik Kendaraan</p>
        </div>

        <div class="card">
            <div class="filter-row">
                <div class="form-group">
                    <label>Nama Pemilik</label>
                    <input type="text" id="nameFilter" class="form-input" placeholder="Cari nama...">
                </div>
                <div class="form-group">
                    <label>Merk</label>
                    <input type="text" id="brandFilter" class="form-input" placeholder="Cari merk...">
                </div>
            </div>
            <div class="btn-group">
                <button class="btn btn-success" id="btnApplyFilter">Filter</button>
            </div>
        </div>

        <div class="card" style="flex: 1; display: flex; flex-direction: column; min-height: 0;">
            <div class="stats">
                <div class="stat-item">Total: <strong id="totalRecords">0</strong></div>
                <div class="stat-item">Aktif: <strong id="activeRecords">0</strong></div>
            </div>

            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Pemilik</th>
                            <th>Merk Mobil</th>
                            <th>Warna</th>
                            <th>Alamat</th>
                            <th>Keterangan</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="dataTableBody">
                        <tr>
                            <td colspan="6" style="text-align: center; padding: 40px; color: #999;">
                                Memuat data...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="pagination">
                <div class="pagination-info">
                    <span id="pageStart">1</span>-<span id="pageEnd">10</span> dari <span id="totalItems">0</span>
                </div>
                <div class="page-controls">
                    <button class="page-btn btn-success" id="btnPrev" disabled>‹</button>
                    <div id="pageNumbers"></div>
                    <button class="page-btn" id="btnNext" disabled>›</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal" id="modalOverlay">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="modalTitle">Tambah Data</h3>
                <button class="modal-close" id="modalClose">&times;</button>
            </div>
            <div class="modal-body">
                <form id="dataForm">
                    <div class="form-group">
                        <label>Nama Pemilik *</label>
                        <input type="text" id="ownerName" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label>Merk Mobil *</label>
                        <select id="carBrand" class="form-input" required>
                            <option value="">Pilih Merk</option>
                            <option value="BMW">BMW</option>
                            <option value="Ferrari">Ferrari</option>
                            <option value="Audi">Audi</option>
                            <option value="Pajero">Pajero</option>
                            <option value="MCleren">MCleren</option>
                            <option value="Brio">Brio</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Warna</label>
                        <input type="text" id="carColor" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label>Alamat</label>
                        <textarea id="ownerAddress" class="form-input"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Keterangan</label>
                        <textarea id="notes" class="form-input"></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="btnCancel">Batal</button>
                <button class="btn btn-success" id="btnSave">Simpan</button>
            </div>
        </div>
    </div>

    <div id="toast" class="toast" aria-live="polite" aria-atomic="true"></div>
</body>

</html>