const signInBtn = document.getElementById('signBtn');
const responseMsg = document.getElementById('response-msg');

function fillResponseMsg(msg){
    responseMsg.innerHTML=msg;
}


signInBtn.addEventListener('click',async() => {
    console.log('sign btn is clicked');
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username) {
        fillResponseMsg('Username is required');
    } else if (!password) {
        fillResponseMsg('Password is required');
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
                fillResponseMsg(result.message)
                const accessToken= result.accessToken;
                localStorage.setItem("aceessToken",accessToken)
                const refreshToken= result.refreshToken;
                localStorage.setItem("refreshToken",refreshToken)
                setTimeout(() => {
                    window.location.href="/public/views/home.html"
                }, 200);
            } else {
                fillResponseMsg(result.message)
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        }
    }

})