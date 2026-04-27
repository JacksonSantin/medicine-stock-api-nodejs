const Medicine = require("../models/Medicine");

async function runDailyDeduction() {
  try {
    const medicines = await Medicine.find({
      uso_continuo: true,
      qtd_comprimidos: { $gt: 0 },
      qtd_diaria: { $gt: 0 },
    });

    const updates = medicines.map(async (med) => {
      // Deduz exatamente a quantidade diária configurada
      const novaQtd = Math.max(med.qtd_comprimidos - med.qtd_diaria, 0);

      await Medicine.findByIdAndUpdate(med._id, {
        qtd_comprimidos: novaQtd,
      });

      return {
        nome: med.nome_remedio,
        qtd_anterior: med.qtd_comprimidos,
        qtd_deduzida: med.qtd_diaria,
        nova_qtd: novaQtd,
      };
    });

    const result = await Promise.all(updates);
    console.log(
      "Dedução diária executada com sucesso:",
      result.length,
      "itens"
    );
    return result;
  } catch (err) {
    console.error("Erro ao executar dedução diária:", err);
    throw err;
  }
}

module.exports = { runDailyDeduction };
