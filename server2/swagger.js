const swaggerJsDoc = require("swagger-jsdoc");
const path = require("path");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Магазина",
      version: "1.0.0",
      description: "Документация API для работы с товарами",
    },
    servers: [
      {
        url: "http://localhost:8080",
        description: "Локальный сервер",
      },
    ],
  },
  apis: [path.join(__dirname, "swaggerDefinitions.js"), path.join(__dirname, "server2.js")],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
