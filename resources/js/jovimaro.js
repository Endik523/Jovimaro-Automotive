document.addEventListener("DOMContentLoaded", () => {
    console.log("JOVIMARO JS LOADED ✅");

    // CONFIG
    const API_BASE = (
        import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:3000"
    ).replace(/\/+$/, "");

    const API_URL = `${API_BASE}/api/pemilik-kendaraan`;

    console.log("API_BASE:", API_BASE);
    console.log("API_URL:", API_URL);

    // ELEMENTS
    const tbody = document.getElementById("dataTableBody");

    const nameFilter = document.getElementById("nameFilter");
    const brandFilter = document.getElementById("brandFilter");

    const btnApplyFilter = document.getElementById("btnApplyFilter");

    const btnPrev = document.getElementById("btnPrev");
    const btnNext = document.getElementById("btnNext");
    const pageNumbers = document.getElementById("pageNumbers");

    const modalOverlay = document.getElementById("modalOverlay");
    const modalClose = document.getElementById("modalClose");
    const btnCancel = document.getElementById("btnCancel");
    const btnSave = document.getElementById("btnSave");
    const modalTitle = document.getElementById("modalTitle");

    const totalRecordsEl = document.getElementById("totalRecords");
    const activeRecordsEl = document.getElementById("activeRecords");
    const pageStartEl = document.getElementById("pageStart");
    const pageEndEl = document.getElementById("pageEnd");
    const totalItemsEl = document.getElementById("totalItems");

    const toastEl = document.getElementById("toast");

    // GUARD MINIMAL
    const requiredEls = [
        tbody,
        nameFilter,
        brandFilter,
        btnApplyFilter,
        btnPrev,
        btnNext,
        pageNumbers,
        modalOverlay,
        modalClose,
        btnCancel,
        btnSave,
        modalTitle,
        totalRecordsEl,
        activeRecordsEl,
        pageStartEl,
        pageEndEl,
        totalItemsEl,
    ];

    if (requiredEls.some((x) => !x)) {
        console.error("Ada element HTML yang ID-nya tidak cocok / hilang.");
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center;padding:40px;color:#ef4444;">
                        Elemen HTML tidak lengkap / ID tidak cocok. Cek Console.
                    </td>
                </tr>
            `;
        }
        return;
    }

    // TOAST
    let toastTimer = null;
    function showToast(message, type = "success", duration = 2000) {
        if (!toastEl) return;
        toastEl.className = `toast ${type}`;
        toastEl.textContent = message;

        requestAnimationFrame(() => toastEl.classList.add("show"));

        clearTimeout(toastTimer);
        toastTimer = setTimeout(
            () => toastEl.classList.remove("show"),
            duration
        );
    }

    // STATE
    let currentUrl = API_URL;
    let editId = null;
    let lastItems = [];

    // COLOR MAP
    const colorMap = {
        merah: "#ef4444",
        hitam: "#1f2937",
        kuning: "#ffff00",
        putih: "#9ca3af",
        silver: "#6b7280",
        biru: "#3b82f6",
        hijau: "#10b981",
    };

    function getColorBg(warna) {
        const w = (warna || "").toLowerCase();
        for (let key in colorMap) {
            if (w.includes(key)) return colorMap[key];
        }
        return "#6b7280";
    }

    // FILTER LOGIC
    function allFiltersEmpty() {
        return !nameFilter.value.trim() && !brandFilter.value.trim();
    }

    function buildUrl(page = 1) {
        const url = new URL(API_URL);

        const nama = nameFilter.value.trim();
        const merk = brandFilter.value.trim();

        if (nama) url.searchParams.set("nama", nama);
        else url.searchParams.delete("nama");

        if (merk) url.searchParams.set("merk", merk);
        else url.searchParams.delete("merk");

        url.searchParams.set("page", page);

        return url.toString();
    }

    // DEBOUNCE AUTO LOAD
    let autoTimer = null;
    function debounce(fn, delay = 400) {
        return (...args) => {
            clearTimeout(autoTimer);
            autoTimer = setTimeout(() => fn(...args), delay);
        };
    }

    function maybeAutoLoadAll() {
        const namaKosong = !nameFilter.value.trim();
        const merkKosong = !brandFilter.value.trim();

        if (namaKosong && merkKosong) {
            loadData(API_URL);
        }
    }

    [nameFilter, brandFilter].forEach((inp) => {
        inp.addEventListener("input", maybeAutoLoadAll);
    });

    const handleAutoFilter = debounce(() => {
        if (allFiltersEmpty()) {
            loadData(API_URL);
        } else {
            loadData(buildUrl(1));
        }
    }, 400);

    [nameFilter, brandFilter].forEach((inp) => {
        inp.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                handleAutoFilter();
            }
        });
    });

    btnApplyFilter.addEventListener("click", () => {
        if (!nameFilter.value.trim() && !brandFilter.value.trim()) {
            loadData(API_URL);
        } else {
            loadData(buildUrl(1));
        }
    });

    // RENDER
    function renderTable(items) {
        if (!items || items.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center;padding:40px;color:#999;">
                        Tidak ada data
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = items
            .map(
                (item) => `
                <tr>
                    <td>${item.pemilik?.nama ?? "-"}</td>
                    <td>${item.merk ?? "-"}</td>
                    <td>
                        ${item.warna ?? "-"}
                    </td>
                    <td>${item.pemilik?.alamat ?? "-"}</td>
                    <td>${item.keterangan ?? "-"}</td>
                    <td>
                        <button class="btn btn-sm btn-edit" data-action="edit" data-id="${
                            item.id
                        }">Edit</button>
                    </td>
                </tr>
            `
            )
            .join("");
    }

    function renderStats(p) {
        totalRecordsEl.textContent = p.total ?? 0;
        totalItemsEl.textContent = p.total ?? 0;
        pageStartEl.textContent = p.from ?? 0;
        pageEndEl.textContent = p.to ?? 0;

        const aktif = (p.data || []).filter((x) => x.aktif).length;
        activeRecordsEl.textContent = aktif;
    }

    function renderPagination(p) {
        btnPrev.disabled = !p.prev_page_url;
        btnNext.disabled = !p.next_page_url;

        btnPrev.dataset.url = p.prev_page_url || "";
        btnNext.dataset.url = p.next_page_url || "";

        const links = (p.links || []).filter(
            (l) =>
                l.url &&
                !String(l.label).toLowerCase().includes("previous") &&
                !String(l.label).toLowerCase().includes("next")
        );

        pageNumbers.innerHTML = links
            .map(
                (l) =>
                    `<button class="page-btn ${
                        l.active ? "active" : ""
                    }" data-url="${l.url}">${l.label}</button>`
            )
            .join("");
    }

    // NORMALIZE RESPONSE
    function extractItems(json) {
        if (Array.isArray(json)) return json;
        if (Array.isArray(json?.data)) return json.data;
        if (Array.isArray(json?.data?.data)) return json.data.data;
        if (Array.isArray(json?.items)) return json.items;
        return [];
    }

    function extractPaginator(json) {
        if (
            !Array.isArray(json) &&
            json?.total !== undefined &&
            Array.isArray(json?.data)
        )
            return json;
        if (
            !Array.isArray(json) &&
            json?.data?.total !== undefined &&
            Array.isArray(json?.data?.data)
        )
            return json.data;
        return null;
    }

    // LOAD DATA
    async function loadData(url) {
        currentUrl = url || currentUrl;

        try {
            console.log("FETCH:", currentUrl);

            const res = await fetch(currentUrl, {
                headers: { Accept: "application/json" },
            });

            const contentType = res.headers.get("content-type") || "";
            const rawText = await res.text();

            if (!res.ok) {
                console.error("API ERROR", res.status, rawText);
                tbody.innerHTML = `
                    <tr>
                        <td colspan="6" style="text-align:center;padding:40px;color:#ef4444;">
                            API error ${res.status}. Cek console.
                        </td>
                    </tr>
                `;
                return;
            }

            if (!contentType.includes("application/json")) {
                console.error(
                    "RESPONSE BUKAN JSON:",
                    contentType,
                    rawText.slice(0, 300)
                );
                tbody.innerHTML = `
                    <tr>
                        <td colspan="6" style="text-align:center;padding:40px;color:#ef4444;">
                            Response bukan JSON (cek route/auth). Cek console.
                        </td>
                    </tr>
                `;
                return;
            }

            const json = JSON.parse(rawText);
            console.log("JSON dari API:", json);

            const items = extractItems(json);
            lastItems = items;

            renderTable(items);

            const paginator = extractPaginator(json);
            if (paginator) {
                renderStats(paginator);
                renderPagination(paginator);
            } else {
                renderStats({
                    total: items.length,
                    from: items.length ? 1 : 0,
                    to: items.length,
                    data: items,
                });
                pageNumbers.innerHTML = "";
                btnPrev.disabled = true;
                btnNext.disabled = true;
            }
        } catch (err) {
            console.error("LOAD ERROR:", err);
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center;padding:40px;color:#ef4444;">
                        Gagal memuat data (cek console)
                    </td>
                </tr>
            `;
        }
    }

    // MODAL
    function openModal() {
        modalOverlay.style.display = "flex";
    }

    function closeModal() {
        modalOverlay.style.display = "none";
        document.getElementById("dataForm")?.reset();
        editId = null;
        modalTitle.textContent = "Tambah Data";
    }

    modalClose.addEventListener("click", closeModal);
    btnCancel.addEventListener("click", closeModal);

    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // PAGINATION EVENTS
    pageNumbers.addEventListener("click", (e) => {
        const btn = e.target.closest(".page-btn");
        if (btn && btn.dataset.url) loadData(btn.dataset.url);
    });

    btnPrev.addEventListener("click", () => {
        if (btnPrev.dataset.url) loadData(btnPrev.dataset.url);
    });

    btnNext.addEventListener("click", () => {
        if (btnNext.dataset.url) loadData(btnNext.dataset.url);
    });

    // EDIT CLICK
    tbody.addEventListener("click", (e) => {
        const btn = e.target.closest('[data-action="edit"]');
        if (!btn) return;

        const id = Number(btn.dataset.id);
        const item = lastItems.find((x) => Number(x.id) === id);
        if (!item) return;

        editId = item.id;
        modalTitle.textContent = "Edit Data";

        document.getElementById("ownerName").value = item.pemilik?.nama || "";
        document.getElementById("carBrand").value = item.merk || "";
        document.getElementById("carColor").value = item.warna || "";
        document.getElementById("ownerAddress").value =
            item.pemilik?.alamat || "";
        document.getElementById("notes").value = item.keterangan || "";

        openModal();
    });

    // SAVE UPDATE
    btnSave.addEventListener("click", async () => {
        const payload = {
            nama: document.getElementById("ownerName").value.trim(),
            alamat:
                document.getElementById("ownerAddress").value.trim() || null,
            merk: document.getElementById("carBrand").value.trim(),
            warna: document.getElementById("carColor").value,
            keterangan: document.getElementById("notes").value.trim() || null,
            aktif: true,
        };

        if (!payload.nama || !payload.merk || !payload.warna) {
            showToast("Nama, Merk, dan Warna wajib diisi", "warn", 2500);
            return;
        }

        try {
            const isEdit = editId !== null;
            const url = isEdit ? `${API_URL}/${editId}` : API_URL;

            const res = await fetch(url, {
                method: isEdit ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(payload),
            });

            const contentType = res.headers.get("content-type") || "";
            const rawText = await res.text();
            const data = contentType.includes("application/json")
                ? JSON.parse(rawText || "{}")
                : {};

            if (!res.ok) {
                console.error("SAVE ERROR:", res.status, rawText);
                if (data.errors) {
                    showToast(
                        Object.values(data.errors).flat().join("\n"),
                        "error",
                        3500
                    );
                } else {
                    showToast("Gagal menyimpan data", "error", 3000);
                }
                return;
            }

            showToast(
                isEdit ? "Data berhasil diupdate" : "Data berhasil disimpan",
                "success"
            );
            closeModal();
            loadData(currentUrl);
        } catch (err) {
            console.error(err);
            showToast("Gagal menyimpan data", "error", 3000);
        }
    });

    loadData(API_URL);
});
