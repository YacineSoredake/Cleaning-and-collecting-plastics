document.getElementById('signBtn').addEventListener('click', async (event) => {
    event.preventDefault(); // Prevent form submission

    // Collect input values
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const responseMsg = document.getElementById('response-msg');

    // Validate inputs
    if (!username || !password) {
        responseMsg.textContent = 'Username and password are required.';
        responseMsg.classList.add('text-red-500');
        return;
    }

    try {
        // Send data to the backend
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const result = await response.json();

        if (response.ok) {
            // Success message
            responseMsg.textContent = result.msg || 'Registration successful!';
            responseMsg.classList.remove('text-red-500');
            responseMsg.classList.add('text-green-500');

            // Redirect after 2 seconds
            setTimeout(() => {
                window.location.href = './signIn.html';
            }, 2000);
        } else {
            // Error message
            responseMsg.textContent = result.msg || 'Error during registration.';
            responseMsg.classList.add('text-red-500');
        }
    } catch (error) {
        console.error('Error:', error);
        responseMsg.textContent = 'An error occurred. Please try again later.';
        responseMsg.classList.add('text-red-500');
    }
});
