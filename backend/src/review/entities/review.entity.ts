import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Movie } from '../../movie/entities/movie.entity';
import { User } from '../../user/entities/user.entity';

@ObjectType()
@Entity('reviews')
export class Review {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => Int)
    @Column()
    movie_id: number;

    @Field(() => Int, { nullable: true })
    @Column({ nullable: true })
    profile_id?: number; // database column name stays the same

    @Field(() => Int, { nullable: true })
    @Column({ nullable: true })
    rating?: number;

    @Field({ nullable: true })
    @Column({ type: 'text', nullable: true })
    review_text?: string;

    @Field(() => Date)
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    // Relations
    @ManyToOne(() => Movie, (movie) => movie.reviews, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'movie_id' })
    @Field(() => Movie, { nullable: true })
    movie: Movie;

    @ManyToOne(() => User, (user) => user.reviews, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'profile_id' })
    @Field(() => User, { nullable: true })
    user?: User;
}
