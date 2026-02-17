import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { connectCloudinary } from "./config/cloudinary.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import "dotenv/config";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// app config
const app = express();
const port = process.env.PORT || 4000;

// middlewares
app.use(express.json());

// CORS — allow frontend origins
const allowedOrigins = [
  "https://syedishaq.me",
  "https://www.syedishaq.me",
  "https://ishaq019.github.io",
  "http://localhost:5173",   // local frontend dev
  "http://localhost:5174",   // local admin dev
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// DB & Cloudinary connection
connectDB();
connectCloudinary();

// api endpoints
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

// Only listen when running locally (not on Vercel)
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server Started on port: ${port}`);
  });
}

export default app;
