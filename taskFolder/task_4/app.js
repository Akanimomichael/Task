const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors"); // Import CORS
const app = express();

// Enable CORS for requests from your frontend
app.use(cors({ origin: "http://localhost:5173" }));

// Middleware to parse JSON bodies
app.use(express.json());

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || "mysql",
  user: process.env.DB_USER || "user",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "videodb",
};

// API endpoint for video pagination
app.get("/", async (req, res) => {
  res.send("Hello World");
});

app.post("/v1/api/rest/video/PAGINATE", async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;
    const offset = (page - 1) * limit;

    const connection = await mysql.createConnection(dbConfig);

    // Get total count
    const [countResult] = await connection.execute(
      "SELECT COUNT(*) as total FROM videos"
    );
    const total = countResult[0].total;

    const [rows] = await connection.query(
      `SELECT 
        v.id, v.title, v.photo, v.user_id,
        v.created_at, v.updated_at, v.likes
      FROM videos v
      LIMIT ${offset}, ${limit}`
    );

    await connection.end();

    res.json({
      error: false,
      list: rows,
      page: page,
      limit: limit,
      total,
      num_pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
