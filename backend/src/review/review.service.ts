import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Review } from './entities/review.entity';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';

// 🧠 AI Toxicity Service
import { ToxicityService } from '../ai/toxicity.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly toxicityService: ToxicityService, // ✅ inject AI
  ) {}

  findAll(): Promise<Review[]> {
    return this.reviewRepository.find({ relations: ['movie', 'user'] });
  }

  async findOne(id: number): Promise<Review | null> {
    return this.reviewRepository.findOne({
      where: { id },
      relations: ['movie', 'user'],
    });
  }

  // ✅ BLOCK TOXIC REVIEWS BEFORE SAVING
  async create(createReviewInput: CreateReviewInput): Promise<Review | null> {
    const text = createReviewInput.review_text;

    // only run AI if there's text
    if (text && text.trim()) {
      const isToxic = await this.toxicityService.isToxic(text.trim());

      // 🔥 if toxic -> stop
      if (isToxic) {
        throw new BadRequestException(
          'Your review contains toxic content and cannot be posted.',
        );
      }
    }

    // ✅ save if clean
    const review = this.reviewRepository.create(createReviewInput);
    const savedReview = await this.reviewRepository.save(review);

    return this.reviewRepository.findOne({
      where: { id: savedReview.id },
      relations: ['movie', 'user'],
    });
  }

  // ✅ ALSO BLOCK TOXIC UPDATES
  async update(
    id: number,
    updateReviewInput: UpdateReviewInput,
  ): Promise<Review | null> {
    const text = updateReviewInput.review_text;

    if (text && text.trim()) {
      const isToxic = await this.toxicityService.isToxic(text.trim());

      if (isToxic) {
        throw new BadRequestException(
          'Your updated review contains toxic content and cannot be posted.',
        );
      }
    }

    await this.reviewRepository.update(id, updateReviewInput);
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.reviewRepository.delete(id);
    return !!result.affected && result.affected > 0;
  }
}
