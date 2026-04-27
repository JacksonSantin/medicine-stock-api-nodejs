const nodemailer = require("nodemailer");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendMedicineAlertEmail(to, medicines) {
  const itemsHtml = medicines
    .map(med => {
      const validade = dayjs.utc(med.dt_validade_remedio);
      const diffDays = validade.diff(dayjs(), 'day');

      let validadeStatus = 'Dentro do prazo';
      let validadeColor = '#4caf50'; // verde

      if (diffDays < 0) {
        validadeStatus = 'Vencido';
        validadeColor = '#f44336'; // vermelho
      } else if (diffDays <= 30) {
        validadeStatus = 'Próximo do vencimento';
        validadeColor = '#ff9800'; // amarelo
      }

      let qtdStatus = 'Quantidade ok';
      let qtdColor = '#4caf50';
      if (med.qtd_comprimidos <= 0) {
        qtdStatus = 'Acabou';
        qtdColor = '#f44336';
      } else if (med.qtd_comprimidos <= 5) {
        qtdStatus = 'Quase acabando';
        qtdColor = '#ff9800';
      }

      return `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${med.nome_remedio}</td>
          <td style="padding: 8px; border: 1px solid #ddd; color:${validadeColor}; font-weight:bold;">${validade.format('DD/MM/YYYY')} - ${validadeStatus}</td>
          <td style="padding: 8px; border: 1px solid #ddd; color:${qtdColor}; font-weight:bold;">${med.qtd_comprimidos} - ${qtdStatus}</td>
        </tr>
      `;
    })
    .join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
      <div style="text-align:center; padding:20px;">
        <h2 style="color:#333;">Alerta de Medicamentos</h2>
        <p>Segue a lista de medicamentos que precisam de atenção:</p>
      </div>
      <table style="width:100%; border-collapse: collapse; margin-bottom:20px;">
        <thead>
          <tr>
            <th style="padding: 8px; border: 1px solid #ddd; background:#f0f0f0;">Remédio</th>
            <th style="padding: 8px; border: 1px solid #ddd; background:#f0f0f0;">Validade</th>
            <th style="padding: 8px; border: 1px solid #ddd; background:#f0f0f0;">Quantidade</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      <p style="font-size:12px; color:#666;">Esta é uma mensagem automática do sistema de controle de medicamentos.</p>
    </div>
  `;

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: "Alerta de Medicamentos - Ação necessária",
    html,
  });

  console.log("E-mail enviado:", info.messageId);
}

module.exports = { sendMedicineAlertEmail };
