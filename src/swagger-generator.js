import swaggerAutogen from 'swagger-autogen';
import path from 'path';

const outputFile = './swagger-output.json';
const endpointsFiles = [
  './src/routes/userRoutes.ts',
  './src/routes/authRoutes.ts', 
  './src/routes/departmentRoutes.ts',
  './src/routes/academyRoutes.ts',
  './src/routes/subjectRoutes.ts',
  './src/routes/filesRoutes.ts'
];

const doc = {
  info: {
    version: '1.0.0',
    title: 'Atenea API',
    description: 'API para el sistema Atenea - Gestión académica',
    contact: {
      name: 'Equipo Atenea',
      email: 'soporte@atenea.com'
    }
  },
  host: `localhost:${process.env.PORT || 3000}`,
  basePath: '/v1',
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: 'Auth',
      description: 'Endpoints de autenticación'
    },
    {
      name: 'Users', 
      description: 'Gestión de usuarios'
    },
    {
      name: 'Departments',
      description: 'Gestión de departamentos'
    },
    {
      name: 'Academies',
      description: 'Gestión de academias'
    },
    {
      name: 'Subjects',
      description: 'Gestión de materias'
    },
    {
      name: 'Files',
      description: 'Gestión de archivos'
    }
  ],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'JWT Bearer token. Formato: Bearer {token}'
    }
  },
  definitions: {
    User: {
      id: 1,
      email: 'usuario@ejemplo.com',
      name: 'Juan Pérez',
      role: 'user',
      departmentId: 1,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    Department: {
      id: 1,
      name: 'Departamento de Sistemas',
      description: 'Departamento encargado de tecnología',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    Academy: {
      id: 1,
      name: 'Academia de Programación',
      description: 'Academia especializada en desarrollo',
      departmentId: 1,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    Subject: {
      id: 1,
      name: 'Programación Web',
      code: 'PW001',
      credits: 4,
      academyId: 1,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    AuthLogin: {
      email: 'usuario@ejemplo.com',
      password: 'contraseña123'
    },
    AuthResponse: {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      user: {
        $ref: '#/definitions/User'
      }
    },
    Error: {
      message: 'Mensaje de error',
      code: 400,
      details: 'Detalles adicionales del error'
    },
    FileUpload: {
      id: 1,
      filename: 'documento.pdf',
      originalName: 'Documento Original.pdf', 
      mimeType: 'application/pdf',
      size: 1024000,
      path: 'uploads/documento.pdf',
      uploadedBy: 1,
      createdAt: '2024-01-01T00:00:00.000Z'
    }
  }
};

swaggerAutogen({openapi: '3.0.0'})(outputFile, endpointsFiles, doc);