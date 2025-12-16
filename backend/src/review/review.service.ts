import { Injectable, BadRequestException } from '@nestjs/common';
// Injectable → allows this service to be injected via NestJS DI
// BadRequestException → throws a 400 error for invalid user input (e.g. toxic content)

import { InjectRepository } from '@nestjs/typeorm';
// InjectRepository → injects a TypeORM repository into the service

import { Repository } from 'typeorm';
// Repository → provides database access methods (find, save, update, delete)

import { Review } from './entities/review.entity';
// Review entity representing the reviews table

import { CreateReviewInput } from './dto/create-review.input';
// DTO defining input structure for creating a review

import { UpdateReviewInput } from './dto/update-review.input';
// DTO defining input structure for updating a review

// 🧠 AI Toxicity Service
import { ToxicityService } from '../ai/toxicity.service';
// Service responsible for detecting toxic content using AI

@Injectable()
export class ReviewService {
  // Service responsible for review-related business logic

  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    // Injects the Review repository for database operations

    private readonly toxicityService: ToxicityService, // inject AI
    // Injects ToxicityService to analyze review text before saving
  ) { }

  findAll(): Promise<Review[]> {
    // Retrieves all reviews with related movie and user data
    return this.reviewRepository.find({ relations: ['movie', 'user'] });
  }

  async findOne(id: number): Promise<Review | null> {
    // Retrieves a single review by ID with related movie and user
    return this.reviewRepository.findOne({
      where: { id },
      relations: ['movie', 'user'],
    });
  }

  // ============================
  // BLOCK TOXIC REVIEWS BEFORE SAVING
  // ============================

  async create(createReviewInput: CreateReviewInput): Promise<Review | null> {
    const text = createReviewInput.review_text;
    // Extracts the review text from input

    // Only run AI toxicity check if review text exists
    if (text && text.trim()) {
      const isToxic = await this.toxicityService.isToxic(text.trim());
      // Uses AI service to determine if the content is toxic

      // If toxic → reject the review
      if (isToxic) {
        throw new BadRequestException(
          'Your review contains toxic content and cannot be posted.',
        );
      }
    }

    // Save review if content is clean
    const review = this.reviewRepository.create(createReviewInput);
    const savedReview = await this.reviewRepository.save(review);

    // Reload review with relations
    return this.reviewRepository.findOne({
      where: { id: savedReview.id },
      relations: ['movie', 'user'],
    });
  }

  // ============================
  // BLOCK TOXIC CONTENT ON UPDATE
  // ============================

  async update(
    id: number,
    updateReviewInput: UpdateReviewInput,
  ): Promise<Review | null> {
    const text = updateReviewInput.review_text;
    // Extracts updated review text

    // Only analyze text if provided
    if (text && text.trim()) {
      const isToxic = await this.toxicityService.isToxic(text.trim());
      // Checks updated content for toxicity

      if (isToxic) {
        throw new BadRequestException(
          'Your updated review contains toxic content and cannot be posted.',
        );
      }
    }

    // Applies update if content is clean
    await this.reviewRepository.update(id, updateReviewInput);

    // Returns the updated review
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    // Deletes a review by ID
    const result = await this.reviewRepository.delete(id);

    // Returns true if a review was successfully deleted
    return !!result.affected && result.affected > 0;
  }
}
