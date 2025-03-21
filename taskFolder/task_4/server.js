const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

// Sample video data
const videos = Array.from({ length: 81 }, (_, i) => ({
  id: i + 1,
  title: `Video Title ${i + 1}`,
  photo: "https://picsum.photos/200/200",
  user_id: Math.ceil(Math.random() * 10),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  likes: Math.floor(Math.random() * 100),
}));

// Pagination API
app.post("/v1/api/rest/video/PAGINATE", (req, res) => {
  const { page = 1, limit = 10 } = req.body;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  res.json({
    error: false,
    list: videos.slice(startIndex, endIndex),
    page,
    limit,
    total: videos.length,
    num_pages: Math.ceil(videos.length / limit),
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
