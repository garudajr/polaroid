document.addEventListener('DOMContentLoaded', () => {
    const videoElement = document.getElementById('videoElement');
    const snapButton = document.getElementById('snapButton');
    const polaroidOutput = document.getElementById('polaroidOutput');
    const polaroidCanvas = document.getElementById('polaroidCanvas');
    const context = polaroidCanvas.getContext('2d');

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

    // Tangani tombol "Ambil Foto!"
    snapButton.addEventListener('click', () => {
        // Atur ukuran canvas sesuai dengan dimensi video (untuk kualitas terbaik)
        polaroidCanvas.width = videoElement.videoWidth;
        polaroidCanvas.height = videoElement.videoHeight;

        // Gambar frame dari video ke canvas
        context.drawImage(videoElement, 0, 0, polaroidCanvas.width, polaroidCanvas.height);

        // Hapus kelas 'show' dan tambahkan 'hidden' terlebih dahulu jika ada polaroid sebelumnya
        polaroidOutput.classList.remove('show');
        polaroidOutput.classList.add('hidden');

        // Sedikit jeda sebelum menampilkan kembali untuk reset animasi
        setTimeout(() => {
            // Hapus kelas 'hidden' untuk menampilkan polaroid
            polaroidOutput.classList.remove('hidden');
            // Tambahkan kelas 'show' untuk memicu animasi 'keluar'
            // Kita atur agar tinggi canvas polaroid menyesuaikan proporsinya
            polaroidCanvas.style.height = (polaroidCanvas.width / videoElement.videoWidth) * videoElement.videoHeight + 'px';
            polaroidOutput.classList.add('show');
        }, 50); // Jeda singkat (50ms)
    });
});