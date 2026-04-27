require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./src/config/db");

const medicineRoutes = require("./src/routes/medicineRoutes");
const scheduleService = require("./src/services/scheduleService");
const deductionService = require("./src/services/deductionService");

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://medicine-stock-web.vercel.app",
];

const app = express();
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(bodyParser.json());

const setupSwagger = require("./src/config/swagger");
setupSwagger(app);

connectDB();

app.use("/api/medicines", medicineRoutes);

// endpoint que pode ser chamado 1x por dia pela Vercel Cron
app.all("/api/trigger-deduction", async (req, res) => {
  try {
    if (req.method !== "GET" && req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Método não permitido" });
    }

    const result = await deductionService.runDailyDeduction();
    res.json({ ok: true, result });
  } catch (error) {
    console.error("Erro ao deduzir medicamentos:", error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.all("/api/trigger-expiry-check", async (req, res) => {
  try {
    if (req.method !== "GET" && req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Método não permitido" });
    }

    const result = await scheduleService.runExpiryCheck();
    return res.json({ ok: true, result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
