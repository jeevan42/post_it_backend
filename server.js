const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const auth = require("./src/routes/v1/auth");
const post = require("./src/routes/v1/post");

dotenv.config();
const app = express();

// Connect to database
connectDB();

// Cors
app.use(cors({
    origin: ['http://localhost:3000','https://postitweb.netlify.app'], // Allow only requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify the allowed HTTP methods
    credentials: true // Include credentials (e.g. cookies) in the requests
}));
// Middleware
app.use(express.json());

// Routes
// app.use("/", (req, res) => {
//   res.send("Hello, world!");
// });

app.use("/api/auth", auth);
app.use("/api/posts", post);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
