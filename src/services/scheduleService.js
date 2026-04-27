const dayjs = require("dayjs");

/**
 * Exemplo de usos:
 * { mode: 'interval', hours: 8 } -> sugere a cada 8h começando da hora atual
 * { mode: 'times', times: ['08:00','14:00','20:00'] } -> retorna as horas passadas
 * { mode: 'times-per-day', timesPerDay: 3, startAt: '08:00' } -> divide o dia em X doses
 */
function suggestTimes(body) {
  const now = dayjs();
  const out = [];

  if (body.mode === "interval") {
    const hours = Number(body.hours);
    if (!hours || hours <= 0) throw new Error("hours invalido");
    // sugere próximas 24-48h (3 dias opcional)
    for (let i = 0; i < Math.ceil((24 * 3) / hours); i++) {
      out.push(now.add(i * hours, "hour").format("HH:mm"));
    }
    return [...new Set(out)];
  }

  if (body.mode === "times" && Array.isArray(body.times)) {
    // valida e retorna
    return body.times.map((t) => t.trim());
  }

  if (body.mode === "times-per-day") {
    const tp = Number(body.timesPerDay) || 3;
    const start = body.startAt
      ? dayjs()
          .hour(Number(body.startAt.split(":")[0]))
          .minute(Number(body.startAt.split(":")[1] || 0))
      : dayjs().hour(8).minute(0);
    const interval = Math.floor(24 / tp);
    for (let i = 0; i < tp; i++) {
      out.push(start.add(i * interval, "hour").format("HH:mm"));
    }
    return out;
  }

  throw new Error("Modo inválido");
}

module.exports = { suggestTimes, runExpiryCheck };

const Medicine = require("../models/Medicine");
const { sendMedicineAlertEmail } = require('./notifyService');

/**
 * runExpiryCheck - procura remédios com validade dentro de 5 dias e dispara notificação
 * Retorna array com items encontrados.
 */
async function runExpiryCheck() {
  const today = dayjs().startOf("day");
  const medicines = await Medicine.find().lean();

  const alerts = medicines.filter(med => {
    const validade = dayjs(med.dt_validade_remedio);
    const diffDays = validade.diff(today, 'day');
    const vencidoOuProximo = diffDays <= 30;
    const quantidadeBaixa = med.qtd_comprimidos <= 5;
    return vencidoOuProximo || quantidadeBaixa;
  });

  if (alerts.length > 0) {
    await sendMedicineAlertEmail(process.env.NOTIFY_TO_EMAIL, alerts);
  }

  return alerts;
}
