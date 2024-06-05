const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const basePath = process.cwd();

const options = {
  swaggerDefinition: {
    info: {
      title: 'Hashlips API',
      version: '3.0.0',
      description: 'API documentation for Hashlips application',
    },
    servers: [
      {
        url: `http://localhost:3000`, 
      },
    ],
  },
  apis: [path.join(basePath, 'routes', '*.js')], 
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };
