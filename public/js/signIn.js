const signInBtn = document.getElementById('signBtn');
const responseMsg = document.getElementById('response-msg');

function fillResponseMsg(msg, type) {
    responseMsg.innerHTML = msg;

    // Clear any previous styles
    responseMsg.classList.remove("success", "error");

    // Add classes based on message type
    if (type === 'error') {
        responseMsg.classList.add("error");
    } else if (type === 'success') {
        responseMsg.classList.add("success");
    }

    // Display and animate the message using GSAP
    responseMsg.style.display = "block"; // Ensure it is visible
    gsap.fromTo(responseMsg, { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 0.5 });

    // Hide the message after 3 seconds
    setTimeout(() => {
        gsap.to(responseMsg, { opacity: 0, y: 50, duration: 0.5, onComplete: () => responseMsg.style.display = "none" });
    }, 3000);
}

signInBtn.addEventListener('click', async () => {
    console.log('Sign button clicked');
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Check if username and password are provided
    if (!username) {
        fillResponseMsg('Username is required', 'error');
    } else if (!password) {
        fillResponseMsg('Password is required', 'error');
    } else {
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();

            if (response.status === 200) {
                // Handle success case
                fillResponseMsg(result.message, 'success');
                const accessToken = result.accessToken;
                localStorage.setItem("accessToken", accessToken);
                const refreshToken = result.refreshToken;
                localStorage.setItem("refreshToken", refreshToken);

                // Redirect after a short delay
                setTimeout(() => {
                    window.location.href = "/public/views/navigate.html";
                }, 1000);
            } else {
                // Handle failure case
                fillResponseMsg(result.message, 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            fillResponseMsg('An error occurred. Please try again later.', 'error');
        }
    }
});
