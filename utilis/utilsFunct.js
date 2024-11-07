export function getUserPayload() {
    const token = localStorage.getItem("aceessToken");
    if (!token) {
        return null;
    }
    try {
        const decoded = jwt_decode(token);
        return decoded;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null; 
    }
}
