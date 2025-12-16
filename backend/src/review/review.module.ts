import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Review } from './entities/review.entity';
import { ReviewService } from './review.service';
import { ReviewResolver } from './review.resolver';

// 🧠 AI module (exports ToxicityService)
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review]),
    AiModule, // ✅ REQUIRED
  ],
  providers: [ReviewService, ReviewResolver],
})
export class ReviewModule {}
