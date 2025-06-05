document.getElementById('eventForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = {
                attending: document.querySelector('input[name="attending"]:checked')?.value || '',
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                guests: document.getElementById('guests').value || 0
            };

            try {
                const response = await fetch('http://localhost:5000/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                const result = await response.json();
                if (response.ok) {
                    alert('Registration successful!');

                    // Prepare data for QR code
                    const qrData = JSON.stringify({
                        registration_id: result.registration_id,
                        name: `${formData.firstName} ${formData.lastName}`,
                        email: formData.email,
                        phone: formData.phone
                    });

                    // Clear previous QR code if any
                    const qrCodeDiv = document.getElementById('qrCode');
                    qrCodeDiv.innerHTML = '';

                    // Generate QR code
                    QRCode.toCanvas(qrData, { errorCorrectionLevel: 'H' }, (err, canvas) => {
                        if (err) throw err;
                        qrCodeDiv.appendChild(canvas);
                    });

                    // Show QR code section
                    document.getElementById('qrCodeSection').style.display = 'block';

                    // Reset form
                    document.getElementById('eventForm').reset();
                } else {
                    alert('Error: ' + result.error);
                }
            } catch (error) {
                alert('Error submitting form: ' + error.message);
            }
        });