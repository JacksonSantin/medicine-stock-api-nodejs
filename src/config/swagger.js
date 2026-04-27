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
  },
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJsdoc(options);

const setupSwagger = (app) => {
  // Opção 1: Swagger UI tradicional
  app.use("/api/docs", swaggerUi.serve);
  app.get(
    "/api/docs",
    swaggerUi.setup(specs, {
      explorer: true,
      customCssUrl: [
        "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css",
      ],
      customJs: [
        "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js",
      ],
    })
  );

  // Opção 2: Endpoint JSON da documentação (alternativa)
  app.get("/api/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(specs);
  });

  // Opção 3: HTML simples como fallback
  app.get("/api/docs-simple", (req, res) => {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Medic Stock API Documentation</title>
        <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui.css" />
        <style>
            html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
            *, *:before, *:after { box-sizing: inherit; }
            body { margin:0; background: #fafafa; }
        </style>
    </head>
    <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-bundle.js"></script>
        <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-standalone-preset.js"></script>
        <script>
        window.onload = function() {
          SwaggerUIBundle({
            url: '/api/docs.json',
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIStandalonePreset
            ],
            plugins: [
              SwaggerUIBundle.plugins.DownloadUrl
            ],
            layout: "StandaloneLayout"
          });
        };
        </script>
    </body>
    </html>
    `;
    res.send(html);
  });
};

module.exports = setupSwagger;
