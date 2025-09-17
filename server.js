require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./src/config/db");

const medicineRoutes = require("./src/routes/medicineRoutes");
const scheduleService = require("./src/services/scheduleService");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const setupSwagger = require("./src/config/swagger");
setupSwagger(app);

connectDB();

app.use("/api/medicines", medicineRoutes);

// endpoint para disparar checagem de validade (use Vercel Cron para acionar periodicamente)
app.post("/api/trigger-expiry-check", async (req, res) => {
  try {
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
