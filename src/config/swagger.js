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
        url: "https://medicine-stock.vercel.app/api",
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

// Configuração específica para a Vercel
const swaggerUiOptions = {
  explorer: true,
  swaggerOptions: {
    url: null, // Força o uso do spec inline
    spec: specs, // Passa o spec diretamente
    dom_id: "#swagger-ui",
    deepLinking: true,
    presets: ["SwaggerUIBundle.presets.apis", "SwaggerUIStandalonePreset"],
    plugins: ["SwaggerUIBundle.plugins.DownloadUrl"],
    layout: "StandaloneLayout",
  },
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .scheme-container { margin: 0 0 20px 0; padding: 30px 0; }
  `,
  customSiteTitle: "Medic Stock API Documentation",
  customfavIcon: "/favicon.ico",
};

const setupSwagger = (app) => {
  // Servir a documentação JSON separadamente
  app.get("/api/docs/swagger.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(specs);
  });

  // Configurar o Swagger UI
  app.use("/api/docs", swaggerUi.serve);

  app.get("/api/docs", (req, res, next) => {
    // Verificar se é uma requisição para arquivos estáticos
    if (
      req.originalUrl.includes(".js") ||
      req.originalUrl.includes(".css") ||
      req.originalUrl.includes(".png")
    ) {
      return swaggerUi.serve(req, res, next);
    }

    // Renderizar a página do Swagger UI
    return swaggerUi.setup(specs, swaggerUiOptions)(req, res, next);
  });
};

module.exports = setupSwagger;
