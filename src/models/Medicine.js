const mongoose = require("mongoose");

const MedicineSchema = new mongoose.Schema(
  {
    nome_remedio: { type: String, required: true, index: "text" },
    mg_remedio: { type: String }, // ex: "500mg"
    dosagem: { type: String }, // ex: "1 comprimido"
    tempo: { type: String }, // ex: "3x ao dia", "8/8h"
    qtd_dias_para_tomar: { type: Number, default: 0 },
    qtd_embalagem: { type: Number, default: 0 },
    qtd_comprimidos: { type: Number, default: 0 },
    dt_validade_remedio: { type: Date },
    foto: { type: String }, // url
    observacao: { type: String },
  },
  {
    timestamps: true,
  }
);
MedicineSchema.index({ nome_remedio: "text", observacao: "text" });

module.exports = mongoose.model("Medicine", MedicineSchema);
