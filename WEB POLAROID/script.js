document.addEventListener('DOMContentLoaded', () => {
    const videoElement = document.getElementById('videoElement');
    const snapButton = document.getElementById('snapButton');
    const polaroidStripOutput = document.getElementById('polaroidStripOutput');

    const MAX_PHOTOS_IN_STRIP = 3; // Batasi jumlah foto dalam satu strip
    let photoQueue = []; // Antrian untuk menyimpan URL gambar yang diambil

    // Minta akses ke webcam
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                videoElement.srcObject = stream;
            })
            .catch(error => {
                console.error('Gagal mengakses webcam:', error);
                alert('Tidak dapat mengakses webcam Anda. Pastikan Anda mengizinkan akses.');
            });
    } else {
        alert('Browser Anda tidak mendukung akses webcam.');
    }

    // Fungsi untuk membuat canvas 1:1 dari frame video
    function captureSquarePhoto() {
        const videoWidth = videoElement.videoWidth;
        const videoHeight = videoElement.videoHeight;

        // Tentukan ukuran sisi persegi (sisi yang lebih kecil dari video)
        const size = Math.min(videoWidth, videoHeight);

        // Hitung posisi cropping untuk mendapatkan bagian tengah 1:1
        const sx = (videoWidth - size) / 2;
        const sy = (videoHeight - size) / 2;

        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const context = canvas.getContext('2d');

        // Gambar bagian tengah video ke canvas 1:1
        context.drawImage(videoElement, sx, sy, size, size, 0, 0, size, size);

        return canvas.toDataURL('image/png'); // Mengembalikan data URL gambar
    }

    // Fungsi untuk merender strip polaroid
    function renderPolaroidStrip() {
        polaroidStripOutput.innerHTML = ''; // Hapus strip lama
        polaroidStripOutput.classList.remove('show');
        polaroidStripOutput.classList.add('hidden');

        // Balik antrian agar foto terbaru ada di bawah (atau atas, tergantung preferensi)
        // Jika ingin foto terbaru di paling bawah strip:
        // const photosToDisplay = [...photoQueue].reverse();
        // Jika ingin foto terbaru di paling atas strip:
        const photosToDisplay = [...photoQueue];

        photosToDisplay.forEach(imgDataUrl => {
            const photoCanvas = document.createElement('canvas');
            const ctx = photoCanvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                // Atur ukuran canvas foto polaroid
                const polaroidWidth = 150; // Lebar foto di dalam polaroid, bisa disesuaikan
                photoCanvas.width = polaroidWidth;
                photoCanvas.height = polaroidWidth; // Karena kita sudah punya gambar 1:1

                ctx.drawImage(img, 0, 0, polaroidWidth, polaroidWidth);
            };
            img.src = imgDataUrl;

            polaroidStripOutput.appendChild(photoCanvas);
        });

        // Sedikit jeda sebelum menampilkan kembali untuk reset animasi
        setTimeout(() => {
            if (photoQueue.length > 0) { // Hanya tampilkan jika ada foto
                polaroidStripOutput.classList.remove('hidden');
                polaroidStripOutput.classList.add('show');
            }
        }, 50); // Jeda singkat (50ms)
    }


    // Tangani tombol "Ambil Foto!"
    snapButton.addEventListener('click', () => {
        const newPhotoDataUrl = captureSquarePhoto();

        // Tambahkan foto baru ke antrian
        photoQueue.push(newPhotoDataUrl);

        // Batasi jumlah foto dalam strip
        if (photoQueue.length > MAX_PHOTOS_IN_STRIP) {
            photoQueue.shift(); // Hapus foto tertua dari depan antrian
        }

        renderPolaroidStrip(); // Gambar ulang strip polaroid
    });
});