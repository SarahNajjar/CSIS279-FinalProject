import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
// ObjectType → marks this class as a GraphQL object type
// Field → exposes properties as GraphQL fields
// Int / Float → specify GraphQL scalar types

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
// TypeORM decorators for defining database entities and relations

import { Genre } from '../../genre/entities/genre.entity';
// Genre entity for the movie–genre relationship

import { Review } from '../../review/entities/review.entity';
// Review entity for movie reviews

import { Watchlist } from '../../watchlist/entities/watchlist.entity';
// Watchlist entity for user watchlists

@ObjectType()
@Entity('movies')
export class Movie {
  // Represents the Movie entity in both GraphQL and the database

  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;
  // Auto-generated primary key

  @Field()
  @Column({ length: 255 })
  title: string;
  // Movie title (max length 255 characters)

  @Field()
  @Column({ type: 'text' })
  description: string;
  // Movie description stored as text

  @Field(() => Int)
  @Column()
  genre_id: number;
  // Foreign key referencing the genre

  // ============================
  // Genre relation
  // ============================

  @ManyToOne(() => Genre, (genre) => genre.movies, { eager: true })
  @JoinColumn({ name: 'genre_id' })
  @Field(() => Genre, { nullable: true })
  genre?: Genre;
  // Many movies belong to one genre
  // Eager loading automatically fetches the genre

  @Field({ nullable: true })
  @Column({ nullable: true, length: 255 })
  poster_path?: string;
  // Optional path or URL to the movie poster

  @Field({ nullable: true })
  @Column({ nullable: true, length: 255 })
  trailer_path?: string;
  // Optional path or URL to the movie trailer

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  release_year?: number;
  // Optional release year

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  duration?: number;
  // Optional movie duration in minutes

  @Field(() => String, { nullable: true })
  get durationFormatted(): string | null {
    // Computed field that formats duration into hours and minutes
    if (!this.duration) return null;
    const hours = Math.floor(this.duration / 60);
    const minutes = this.duration % 60;
    return `${hours}h ${minutes}m`;
  }

  @Field(() => Date)
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
  // Timestamp indicating when the movie was created

  @OneToMany(() => Review, (review) => review.movie)
  @Field(() => [Review], { nullable: true })
  reviews?: Review[];
  // One movie can have multiple reviews

  @OneToMany(() => Watchlist, (watchlist) => watchlist.movie)
  watchlists?: Watchlist[];
  // One movie can appear in multiple user watchlists

  // ============================
  // Computed GraphQL Fields
  // (NOT database columns)
  // ============================

  @Field(() => Float, { nullable: true })
  average_rating?: number;
  // Average rating calculated at runtime

  @Field(() => Int, { nullable: true })
  total_ratings?: number;
  // Total number of ratings calculated at runtime
}
