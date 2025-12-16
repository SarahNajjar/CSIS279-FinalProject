import { NestFactory } from '@nestjs/core';
// NestFactory → creates and bootstraps a NestJS application instance

import { AppModule } from './app.module';
// Root application module that wires together all feature modules

async function bootstrap() {
  // Entry point of the NestJS application

  const app = await NestFactory.create(AppModule);
  // Creates the NestJS app using AppModule

  // ✅ Enable CORS so frontend (3000) can access backend (4000)
  app.enableCors({
    origin: 'http://localhost:3000',
    // Allows requests only from the frontend origin

    credentials: true,
    // Allows cookies, authorization headers, etc. to be sent
  });

  await app.listen(4000);
  // Starts the server on port 4000

  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
  // Logs GraphQL endpoint URL to the console
}

bootstrap();
// Calls the bootstrap function to start the application
