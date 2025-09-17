# Medic Stock API

API para gerenciamento de estoque de remédios, com alertas de validade e sugestões de horários.

---

## 🔧 Tecnologias

- Node.js
- Express.js
- MongoDB (Mongoose)
- Day.js
- Nodemailer (notificações)
- Swagger (documentação)
- Vercel (deploy)

---

## ⚡ Rodando localmente

1. Clone o repositório:

```bash
git clone git@github.com:JacksonSantin/medicine-stock-api-nodejs.git

cd medicine-stock-api-nodejs
```

2. Instale dependências:

```bash
npm install
```

3. Configure o `.env`:

```env
PORT=3000
MONGO_URI=<sua-mongo-uri>

# SMTP (opcional)
SMTP_HOST=smtp.exemplo.com
SMTP_PORT=587
SMTP_USER=usuario
SMTP_PASS=senha
SMTP_FROM="Medic Stock <no-reply@exemplo.com>"
NOTIFY_TO_EMAIL=seu-email@dominio.com
```

4. Rodar servidor:

```bash
npm run dev

ou

npm start
```

5. Acesse a documentação Swagger: http://localhost:3000/api/docs

---

## 📌 Endpoints principais

- `GET /api/medicines` → Listar remédios
- `POST /api/medicines` → Criar remédio
- `GET /api/medicines/:id` → Detalhes de um remédio
- `PUT /api/medicines/:id` → Atualizar remédio
- `DELETE /api/medicines/:id` → Remover remédio
- `POST /api/medicines/suggest-times` → Sugestão de horários
- `POST /api/trigger-expiry-check` → Dispara checagem de validade e envia notificações

---

## 📬 Notificações

- Por e-mail, usando SMTP configurado no .env
- Inclui a data formatada em DD/MM/YYYY e os dias restantes até a validade.

---

## 📝 Observações

- Para deploy no Vercel, use `vercel.json` configurado para apontar para `server.js`.
