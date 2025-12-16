import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Movie } from '../../movie/entities/movie.entity';

@ObjectType()
@Entity('genres')
export class Genre {
    @Field(() => Int)
    @PrimaryGeneratedColumn() // ✅ Auto-increment ID
    id: number;

    @Field()
    @Column({ unique: true })
    name: string;

    // ✅ Correct relation
    @OneToMany(() => Movie, (movie) => movie.genre)
    @Field(() => [Movie], { nullable: true })
    movies?: Movie[];
}
