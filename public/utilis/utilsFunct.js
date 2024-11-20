export function getUserPayload() {
    const token = localStorage.getItem("accessToken");
    
    if (!token) {
        return null; // or throw an error if preferred
    }
    
    try {
        const decoded = jwt_decode(token);
        return decoded; // This will return the payload
    } catch (error) {
        console.error("Error decoding token:", error);
        return null; // Handle the error gracefully
    }
}

export function disconnect() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userid');
    window.location.href = '../views/signIn.html';
}

// Make the function globally available for use in the HTML
window.disconnect = disconnect;


