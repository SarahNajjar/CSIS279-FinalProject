import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Genre } from '../../genre/entities/genre.entity';
import { Review } from '../../review/entities/review.entity';
import { Watchlist } from '../../watchlist/entities/watchlist.entity';

@ObjectType()
@Entity('movies')
export class Movie {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ length: 255 })
  title: string;

  @Field()
  @Column({ type: 'text' })
  description: string;

  @Field(() => Int)
  @Column()
  genre_id: number;

  // ✅ Genre relation
  @ManyToOne(() => Genre, (genre) => genre.movies, { eager: true })
  @JoinColumn({ name: 'genre_id' })
  @Field(() => Genre, { nullable: true })
  genre?: Genre;

  @Field({ nullable: true })
  @Column({ nullable: true, length: 255 })
  poster_path?: string;

  @Field({ nullable: true })
  @Column({ nullable: true, length: 255 })
  trailer_path?: string;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  release_year?: number;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  duration?: number;

  @Field(() => String, { nullable: true })
  get durationFormatted(): string | null {
    if (!this.duration) return null;
    const hours = Math.floor(this.duration / 60);
    const minutes = this.duration % 60;
    return `${hours}h ${minutes}m`;
  }

  @Field(() => Date)
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => Review, (review) => review.movie)
  @Field(() => [Review], { nullable: true })
  reviews?: Review[];

  @OneToMany(() => Watchlist, (watchlist) => watchlist.movie)
  watchlists?: Watchlist[];

  // ============================
  // ✅ Computed GraphQL Fields
  // (NOT database columns)
  // ============================

  @Field(() => Float, { nullable: true })
  average_rating?: number;

  @Field(() => Int, { nullable: true })
  total_ratings?: number;
}
