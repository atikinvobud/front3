const swaggerJsdoc = require("swagger-jsdoc");
const path = require('path');
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Документация",
            version: "1.0.0",
            description: "Документация для API на Express.js",
        },
        servers: [
            {
                url: "http://localhost:8080",
                description: "Локальный сервер",
            },
        ],
    },
    
    apis: [path.join(__dirname, 'server2.js')], // Ищем описания API в папке routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
