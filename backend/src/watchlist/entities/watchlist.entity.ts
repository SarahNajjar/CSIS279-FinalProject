import { ObjectType, Field, Int } from '@nestjs/graphql';
// ObjectType → marks this class as a GraphQL object type
// Field → exposes properties as GraphQL fields
// Int → specifies a GraphQL integer type

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
// TypeORM decorators for defining database entities and relations

import { User } from '../../user/entities/user.entity';
// User entity used for the watchlist–user relationship

import { Movie } from '../../movie/entities/movie.entity';
// Movie entity used for the watchlist–movie relationship

@ObjectType()
@Entity('watchlists')
export class Watchlist {
    // Represents the Watchlist entity in both GraphQL and the database

    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;
    // Auto-generated primary key for the watchlist entry

    @Field(() => Int)
    @Column()
    profile_id: number;
    // Foreign key referencing the user/profile

    @Field(() => Int)
    @Column()
    movie_id: number;
    // Foreign key referencing the movie

    @Field(() => Date)
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
    // Timestamp indicating when the watchlist entry was created

    // ============================
    // Relations
    // ============================

    @ManyToOne(() => User, (user) => user.watchlists, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'profile_id' })
    @Field(() => User, { nullable: true })
    user?: User;
    // Many watchlist entries belong to one user
    // Cascade delete removes watchlist entries when the user is deleted

    @ManyToOne(() => Movie, (movie) => movie.watchlists, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'movie_id' })
    @Field(() => Movie, { nullable: true })
    movie?: Movie;
    // Many watchlist entries belong to one movie
    // Cascade delete removes watchlist entries when the movie is deleted
}
