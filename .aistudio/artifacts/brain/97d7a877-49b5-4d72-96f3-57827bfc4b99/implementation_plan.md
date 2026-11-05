# Rencana Implementasi: Penyempurnaan Visual Karakter Plat Nomor Sesuai Referensi

Menindaklanjuti jawaban Anda, perbaikan akan difokuskan secara mendalam pada area plat nomor dengan meniru **100% karakteristik visual plat referensi asli (B 9781 UXI dan B 9106 UXD)** tanpa mengubah pixel lain di luar plat.

---

## 1. Analisis & Target Visual dari Plat Referensi Asli

Berdasarkan hasil pemindaian langsung pada foto asli `car-1.jpg` (plat `B 9781 UXI`):
- **Ketebalan Garis (*Stroke Width*)**: Garis huruf/angka memiliki ketebalan ~14% dari tinggi karakter (~5.5px pada tinggi 40px), padat dan berisi, dengan ujung membulat khas cetakan mesin *punch press* aluminium Samsat.
- **Rasio Karakter (*Aspect Ratio*)**: Karakter bertipe *tall condensed* (lebar ~44% dari tinggi). Khusus huruf `M`, tiang kiri dan kanan tegak lurus vertikal sempurna dengan puncak V tengah tajam menyentuh garis dasar.
- **Jarak Antarkelompok (*Group Spacing*)**:
  - Jarak antara **Kode Wilayah (`M`)** ke **Angka Polisi (`4`)** adalah jarak renggang lebar (~45% dari tinggi karakter), persis seperti jarak `B` ke `9781`.
  - Jarak antara **Angka Polisi (`4`)** ke **Seri Akhir (`M`)** juga berjarak renggang lebar (~45% dari tinggi karakter), persis seperti jarak `9781` ke `UXI`.
  - Jika angka/huruf lebih dari 1 karakter (misal `1234` atau `ABC`), jarak antarhuruf di dalam kelompok dibuat rapat (~8% dari tinggi karakter).

---

## 2. Rencana Perubahan Teknis

### A. Penyempurnaan Mesin Render Karakter (`src/utils/plateCompositor.ts`)
1. **Penerapan Geometri & Ketebalan Huruf Standar Referensi**:
   - Memastikan ketebalan karakter padat berisi (tidak kurus dan tidak berlubang).
   - Memastikan bentuk `M`, `4`, `1`, `B`, `9`, `8`, dll. memiliki sudut, lengkungan, dan proporsi yang identik dengan plat asli.
2. **Proporsi Spasi Otentik Sesuai Jawaban Pengguna**:
   - Menerapkan spasi renggang proporsional antara kode wilayah, angka nomor polisi, dan seri belakang.
3. **Penyatuan Tekstur & Efek Timbul 3D (*Die Stamping & Ambient Lighting*)**:
   - Memberi *contact shadow* halus di bawah karakter onto plat dasar logam.
   - Memberi *specular highlight* di bagian atas karakter (menangkap pantulan lampu gantung gedung KIR).
   - Menggunakan warna cat enamel arang (`#1a1a1c`) untuk plat putih Gran Max dan putih keperakan (`#e8edf2`) untuk plat hitam Isuzu Elf, disertai butiran *micro-grain* kamera agar menyatu dengan plat asli.
4. **Perspektif & Kemiringan Permukaan Bumper**:
   - Menyempurnakan rotasi dan kemiringan vertikal (*skewY*) untuk foto serong 45° (`car-4.jpg`) dan 3/4 (`truck-3.jpg`).
   - Memperbarui pantulan plat pada lantai hijau glossy untuk foto `car-3.jpg`.
5. **Penanda Visual SIMULASI / MOCKUP**:
   - Menyematkan penanda transparan profesional `[ SIMULASI VISUAL / MOCKUP ]` di sudut foto sesuai batasan hukum mockup visual.
6. **Download Langsung 4 Gambar (Tanpa ZIP)**:
   - Memastikan tombol unduh langsung memicu download 4 berkas `.png` terpisah dengan nama `{plat nomor}-1.png` s/d `{plat nomor}-4.png`.

---

## 3. Langkah Verifikasi
- Pengujian visual pada input `M 4 M` dan plat standar `B 1234 ABC`.
- Memastikan tidak ada perbedaan pixel di luar area plat nomor.
- Menjalankan `compile_applet` dan `lint_applet` untuk memastikan kode bebas dari galat.
