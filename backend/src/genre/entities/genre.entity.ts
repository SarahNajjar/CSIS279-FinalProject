import { ObjectType, Field, Int } from '@nestjs/graphql';
// ObjectType → marks this class as a GraphQL object type
// Field → exposes properties as GraphQL fields
// Int → specifies a GraphQL integer type

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
// Entity → marks this class as a database table
// PrimaryGeneratedColumn → auto-generates a primary key
// Column → defines a database column
// OneToMany → defines a one-to-many relationship

import { Movie } from '../../movie/entities/movie.entity';
// Imports Movie entity for defining the relationship

@ObjectType()
@Entity('genres')
export class Genre {
    // Represents the Genre entity in both GraphQL and the database

    @Field(() => Int)
    @PrimaryGeneratedColumn() // Auto-increment primary key
    id: number;

    @Field()
    @Column({ unique: true })
    name: string;
    // Genre name (must be unique in the database)

    // One genre can be associated with multiple movies
    @OneToMany(() => Movie, (movie) => movie.genre)
    @Field(() => [Movie], { nullable: true })
    movies?: Movie[];
    // List of movies belonging to this genre (optional in GraphQL)
}
