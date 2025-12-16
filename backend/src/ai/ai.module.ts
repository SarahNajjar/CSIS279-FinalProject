import { Module } from '@nestjs/common';
import { ToxicityService } from './toxicity.service';

@Module({
  providers: [ToxicityService],
  exports: [ToxicityService], // 🔁 used by ReviewService
})
export class AiModule {}
