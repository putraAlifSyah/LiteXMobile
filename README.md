# 📱 LiteX Mobile App

<div align="center">
  <img src="./assets/logo-LiteX.png" alt="LiteX Logo" width="300" />
</div>

<br />

LiteX Mobile adalah portal berita modern yang menampilkan desain UI premium, interaksi yang halus, dan performa tinggi. Aplikasi ini mengambil data langsung dari WordPress API (`litex.co.id`) secara real-time.

## ✨ Fitur Utama

- **Premium UI/UX:** Desain *pixel-perfect*, layout modern bergaya *cards*, dengan interaksi yang mulus.
- **Dark Mode Support:** Mendukung mode terang dan gelap yang dapat diatur via Pengaturan.
- **Berita Real-Time:** Integrasi langsung dengan WordPress REST API (`litex.co.id/wp-json/wp/v2`).
- **Kategori & Pencarian:** Filter berdasarkan kategori berita atau cari berita spesifik.
- **Bookmark (Tersimpan):** Simpan artikel favorit untuk dibaca kembali.
- **Optimasi Performa:** Rendering *FlatList* yang sangat efisien dengan mekanisme *infinite scroll* dan pemuatan ukuran gambar yang hemat kuota.

## 🛠 Teknologi yang Digunakan

Aplikasi ini dibangun menggunakan arsitektur *frontend* *mobile* yang modern:
- **[React Native](https://reactnative.dev/) & [Expo](https://expo.dev/)** - Framework pengembangan *mobile*.
- **[TanStack React Query](https://tanstack.com/query/latest)** - Pengelolaan antrean data (*caching*, *fetching*, dan *infinite scroll*) dari server.
- **[Zustand](https://github.com/pmndrs/zustand)** - Manajemen *state* (untuk fitur Dark Mode & penyimpanan Bookmark lokal).
- **[React Navigation](https://reactnavigation.org/)** - Sistem pergerakan (*routing*) antar layar dan navigasi Tab Bawah.
- **[Axios](https://axios-http.com/)** - Klien HTTP untuk *fetching* REST API WordPress.

## 🚀 Panduan Memulai (Instalasi Lokal)

Ikuti langkah-langkah di bawah ini untuk menjalankan kode sumber (*source code*) LiteX Mobile di komputer Anda untuk keperluan pengembangan.

### Persyaratan
- [Node.js](https://nodejs.org/en/) (Disarankan versi LTS, v18 atau v20+)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Langkah Instalasi

1. **Kloning Repositori**
   ```bash
   git clone https://github.com/putraAlifSyah/LiteXMobile.git
   cd LiteXMobile
   ```

2. **Instal Dependensi**
   ```bash
   npm install
   ```

3. **Jalankan Server Development Expo**
   ```bash
   npx expo start
   ```

4. **Buka di Perangkat Anda**
   - **Android:** Unduh aplikasi **Expo Go** dari Google Play Store, lalu pindai *QR Code* yang muncul di terminal menggunakan pemindai bawaan Expo.
   - **iOS:** Unduh aplikasi **Expo Go** dari App Store, lalu pindai *QR Code* menggunakan aplikasi Kamera iPhone Anda.
   - Atau tekan `a` di terminal untuk membuka di Android Emulator, dan `i` untuk iOS Simulator.

## 📦 Panduan Build (Membuat APK)

Aplikasi ini telah dikonfigurasikan agar mudah di-build menjadi file *installable* menggunakan **EAS (Expo Application Services)**.

1. Instal EAS CLI:
   ```bash
   npm install -g eas-cli
   ```
2. Build *file* `.apk` (Android) untuk diujicoba secara langsung:
   ```bash
   eas build -p android --profile preview
   ```
3. Build *file* `.aab` (Android App Bundle) untuk diunggah ke Google Play Store:
   ```bash
   eas build -p android --profile production
   ```

Tunggu hingga proses di *cloud* selesai, lalu unduh dan instal aplikasinya!

## 📄 Lisensi
Hak cipta © 2026 LiteX. All rights reserved.
