import express from "express";
import cors from "cors";
import mockLedgerRoutes from "./mockLedgerRoutes.js";

const app = express();
const PORT = 3000;

app.use(express.json());

// allow Vite frontend to call backend with cookies
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// pretend session auth middleware
app.use((req, res, next) => {
  req.user = { id: "user_123", username: "kyle" };
  next();
});

app.use("/api", mockLedgerRoutes);

app.listen(PORT, () => {
  console.log(`Mock backend running at http://localhost:${PORT}`);
});