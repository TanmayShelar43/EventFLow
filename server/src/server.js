require("dotenv").config();

const express = require("express");
const cors = require("cors");
const supabase = require("./config/supabase");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");
const bookingRoutes = require("./routes/bookings");
const inventoryRoutes = require("./routes/inventory");
const app = express();
const PORT = process.env.PORT || 5000;




app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/inventory", inventoryRoutes)

app.get("/", (req, res) => {
  res.json({ message: "EventFlow API is running!" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/events", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });

    if (error) {
      console.error("Supabase error:", error.message);
      return res.status(500).json({
        message: "Failed to fetch events"
      });
    }

    res.json({
      success: true,
      count: data.length,
      events: data
    });
  } catch (error) {
    console.error("Server error:", error.message);
    res.status(500).json({
      message: "Internal server error"
    });
  }
});

app.listen(PORT, () => {
  console.log(`EventFlow server running on http://localhost:${PORT}`);
});