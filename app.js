const express = require("express");
const http = require("http");
const connectDB = require('./config/db');
const dotenv = require("dotenv");
const path = require("path");
const authRoute = require("./routes/authRouter")
const markerRoute = require("./routes/markerRouter")

const app = express();
const server = http.createServer(app);
dotenv.config();

// Connect Database
connectDB();

// config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/',authRoute);
app.use('/',markerRoute);

app.get("/", (request, response) => {
    response.redirect("/public/views/signIn.html");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
