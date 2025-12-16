import { ObjectType, Field, Int } from '@nestjs/graphql';
// ObjectType → marks this class as a GraphQL object type
// Field → exposes properties as GraphQL fields
// Int → specifies a GraphQL integer type

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
// TypeORM decorators for defining database entities and relations

import { Movie } from '../../movie/entities/movie.entity';
// Movie entity used to define the review–movie relationship

import { User } from '../../user/entities/user.entity';
// User entity used to define the review–user relationship

@ObjectType()
@Entity('reviews')
export class Review {
    // Represents the Review entity in both GraphQL and the database

    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;
    // Auto-generated primary key for the review

    @Field(() => Int)
    @Column()
    movie_id: number;
    // Foreign key referencing the reviewed movie

    @Field(() => Int, { nullable: true })
    @Column({ nullable: true })
    profile_id?: number;
    // Optional foreign key referencing the user/profile who wrote the review

    @Field(() => Int, { nullable: true })
    @Column({ nullable: true })
    rating?: number;
    // Optional numeric rating for the movie

    @Field({ nullable: true })
    @Column({ type: 'text', nullable: true })
    review_text?: string;
    // Optional textual review content

    @Field(() => Date)
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
    // Timestamp indicating when the review was created

    // ============================
    // Relations
    // ============================

    @ManyToOne(() => Movie, (movie) => movie.reviews, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'movie_id' })
    @Field(() => Movie, { nullable: true })
    movie: Movie;
    // Many reviews belong to one movie
    // Cascade delete removes reviews when the movie is deleted

    @ManyToOne(() => User, (user) => user.reviews, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'profile_id' })
    @Field(() => User, { nullable: true })
    user?: User;
    // Many reviews can belong to one user
    // If the user is deleted, profile_id is set to NULL
}
