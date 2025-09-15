const Medicine = require("../models/Medicine");
const dayjs = require("dayjs");

// Create a new medicine
exports.create = async (req, res) => {
  try {
    const m = new Medicine(req.body);
    await m.save();
    res.status(201).json(m);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Read list + search + quick counts
// Query params: q (search string), page, limit
exports.list = async (req, res) => {
  try {
    const { q, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (q) {
      filter.$text = { $search: q };
    }
    const medicines = await Medicine.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ nome_remedio: 1 })
      .lean();

    // quick totals for found items
    const totals = medicines.reduce(
      (acc, it) => {
        acc.qtd_comprimidos =
          (acc.qtd_comprimidos || 0) + (it.qtd_comprimidos || 0);
        acc.qtd_embalagem = (acc.qtd_embalagem || 0) + (it.qtd_embalagem || 0);
        return acc;
      },
      { qtd_comprimidos: 0, qtd_embalagem: 0 }
    );

    res.json({ medicines, totals });
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
};

// Read single
exports.get = async (req, res) => {
  try {
    const m = await Medicine.findById(req.params.id);
    if (!m) return res.status(404).json({ error: "Not found" });

    // compute expiration warning: returns 'red' if within 5 days
    let expireWarning = null;
    if (m.dt_validade_remedio) {
      const daysLeft = dayjs(m.dt_validade_remedio).diff(dayjs(), "day");
      if (daysLeft <= 5) expireWarning = "red";
    }
    res.json({ medicine: m, expireWarning });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
exports.update = async (req, res) => {
  try {
    const m = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!m) return res.status(404).json({ error: "Not found" });
    res.json(m);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete
exports.remove = async (req, res) => {
  try {
    const m = await Medicine.findByIdAndDelete(req.params.id);
    if (!m) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
