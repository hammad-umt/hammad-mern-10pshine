import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Notes App API',
      version: '1.0.0',
      description: 'User auth & notes endpoints',
    },
    servers: [{ url: process.env.SWAGGER_SERVER_URL || 'http://localhost:5000/api' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js'], // or a separate YAML/JS doc file
};

const swaggerSpec = swaggerJsdoc(options);
export { swaggerUi, swaggerSpec };
