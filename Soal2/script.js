document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    const topicSelect = document.getElementById('topic');
    const notification = document.getElementById('notification'); // Updated ID
    const notificationMessage = document.getElementById('notificationMessage'); // Updated ID
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');

    // Base URL for your Spring Boot backend API
    const BASE_URL = 'http://localhost:8080'; // Sesuaikan dengan port backend Anda

    /**
     * Mengambil daftar topik seminar dari endpoint backend.
     * (GET /api/topik)
     */
    async function fetchTopics() {
        try {
            const response = await fetch(`${BASE_URL}/api/topik`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const topics = await response.json();
            
            topicSelect.innerHTML = '<option value="">Pilih Topik</option>'; // Reset options
           
            topics.forEach(topic => {
                const option = document.createElement('option');
                option.value = topic.id; 
                option.textContent = topic.name;
                topicSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Gagal mengambil topik seminar:', error);
            showNotification('Gagal memuat topik seminar. Silakan coba lagi nanti.', 'error');
        }
    }

    /**
     * Mengirim data pendaftaran peserta ke backend.
     * (POST /api/pendaftaran)
     * @param {Object} data - Objek data pendaftaran.
     */
    async function submitRegistration(data) {
        try {
            const response = await fetch(`${BASE_URL}/api/pendaftaran`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                // Mencoba membaca pesan error dari backend jika ada
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (jsonError) {
                    console.warn("Could not parse error JSON:", jsonError);
                }
                throw new Error(errorMessage);
            }

            // const result = await response.json(); // Anda bisa gunakan jika backend mengembalikan data sukses
            showNotification('Pendaftaran berhasil! Terima kasih telah mendaftar.', 'success');
            registrationForm.reset(); // Reset form setelah sukses
            // Anda bisa tambahkan logika lain di sini, seperti menonaktifkan form atau mengarahkan ke halaman lain
        } catch (error) {
            console.error('Gagal mengirim data pendaftaran:', error);
            showNotification(`Pendaftaran gagal: ${error.message}. Silakan coba lagi.`, 'error');
        }
    }

    /**
     * Menampilkan pesan notifikasi sukses atau error dengan animasi.
     * @param {string} message - Pesan yang akan ditampilkan.
     * @param {string} type - Tipe pesan ('success' atau 'error').
     */
    function showNotification(message, type) {
        notificationMessage.textContent = message;
        notification.className = `notification ${type}`; // Reset class dan tambahkan type
        notification.style.display = 'flex'; // Display as flex to align content
        
        // Trigger reflow to ensure animation plays
        void notification.offsetWidth; 
        notification.classList.add('show'); // Add 'show' class for animation

        // Hide notification after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            // Hide element completely after transition ends
            notification.addEventListener('transitionend', function handler() {
                notification.style.display = 'none';
                notification.removeEventListener('transitionend', handler);
            }, { once: true });
        }, 5000);
    }

    /**
     * @returns {boolean} True jika email valid, false jika tidak.
     */
    function validateEmail() {
        const emailValue = emailInput.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailValue === '') {
            emailError.textContent = 'Email wajib diisi.';
            emailInput.classList.add('is-invalid');
            return false;
        } else if (!emailPattern.test(emailValue)) {
            emailError.textContent = 'Format email tidak valid. Contoh: nama@domain.com';
            emailInput.classList.add('is-invalid');
            return false;
        } else {
            emailError.textContent = ''; 
            emailInput.classList.remove('is-invalid');
            return true;
        }
    }

    // Event listeners
    registrationForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Validasi frontend
        const isEmailValid = validateEmail();
        // Anda bisa menambahkan validasi untuk field lain di sini
        const fullName = document.getElementById('fullName').value.trim();
        const instance = document.getElementById('instance').value.trim();
        const topic = document.getElementById('topic').value;
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');

        let isValid = true;

        if (fullName === '') {
            isValid = false;
            // Optionally, add a visual cue for fullName error
            document.getElementById('fullName').classList.add('is-invalid');
        } else {
            document.getElementById('fullName').classList.remove('is-invalid');
        }

        if (instance === '') {
            isValid = false;
            document.getElementById('instance').classList.add('is-invalid');
        } else {
            document.getElementById('instance').classList.remove('is-invalid');
        }

        if (topic === '') {
            isValid = false;
            document.getElementById('topic').classList.add('is-invalid');
        } else {
            document.getElementById('topic').classList.remove('is-invalid');
        }
        
        if (!paymentMethod) {
            isValid = false;
            // No specific error message for radio, relies on `required` in HTML or a general message
        }

        if (!isEmailValid || !isValid) {
            showNotification('Harap lengkapi semua bidang yang wajib diisi dan perbaiki kesalahan.', 'error');
            return;
        }

        // Collect form data
        const formData = new FormData(registrationForm);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Sesuaikan payload untuk backend Spring Boot Anda
        // Misalnya, jika backend mengharapkan ID topik sebagai bagian dari objek atau sebagai ID langsung
        data.topicId = data.topic; // Asumsi backend Spring Boot Anda menerima 'topicId'
        delete data.topic; // Hapus kunci 'topic' yang tidak perlu jika sudah ada 'topicId'

        console.log('Data yang akan dikirim:', data);
        await submitRegistration(data);
    });

    emailInput.addEventListener('input', validateEmail); 
    // Tambahkan event listener untuk validasi on blur/change pada input lain jika diperlukan

    // Initial fetch of topics when the page loads
    fetchTopics();
});