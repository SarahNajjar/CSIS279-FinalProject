import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import { ServeStaticModule } from '@nestjs/serve-static';

// 🔥 MODULES
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MovieModule } from './movie/movie.module';
import { GenreModule } from './genre/genre.module';
import { ReviewModule } from './review/review.module';
import { WatchlistModule } from './watchlist/watchlist.module';

// 🧠 AI TOXICITY MODULE
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    // ✅ Serve static files from /uploads
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),

    // ✅ Database
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'cinestream',
      autoLoadEntities: true,
      synchronize: true,
      dropSchema: false,
    }),

    // ✅ GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
    }),

    // 🔌 App modules
    AuthModule,
    UserModule,
    MovieModule,
    GenreModule,
    ReviewModule,
    WatchlistModule,

    // 🧠 AI (predict.py integration)
    AiModule,
  ],
})
export class AppModule {}
