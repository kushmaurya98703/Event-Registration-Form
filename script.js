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
                    document.getElementById('eventForm').reset();
                } else {
                    alert('Error: ' + result.error);
                }
            } catch (error) {
                alert('Error submitting form: ' + error.message);
            }
        });