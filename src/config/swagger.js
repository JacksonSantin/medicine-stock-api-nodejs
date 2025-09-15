const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Medic Stock API",
      version: "1.0.0",
      description: "API para gerenciamento de estoque de remédios",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Medicine: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64fa1d5c2b1234567890abcd" },
            nome_remedio: { type: "string", example: "Paracetamol" },
            mg_remedio: { type: "string", example: "500mg" },
            dosagem: { type: "string", example: "2 comprimidos" },
            tempo: { type: "string", example: "8/8h" },
            qtd_dias_para_tomar: { type: "integer", example: 5 },
            qtd_embalagem: { type: "integer", example: 2 },
            qtd_comprimidos: { type: "integer", example: 20 },
            dt_validade_remedio: {
              type: "string",
              format: "date",
              example: "2025-10-01",
            },
            foto: { type: "string", example: "https://site.com/foto.jpg" },
            observacao: { type: "string", example: "Usado para dor e febre" },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js"], // caminhos para os arquivos com comentários JSDoc
};

const specs = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(specs));
};

module.exports = setupSwagger;
