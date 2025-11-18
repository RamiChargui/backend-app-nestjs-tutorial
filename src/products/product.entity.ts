import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { CURRENT_TIMESTAMP } from '../utils/constants';
import { Review } from "src/reviews/review.entity";

@Entity({ name : 'product_db'})
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;
    @Column({type: 'float'})
    price: number;

    @CreateDateColumn({ type: 'timestamp', default : () => CURRENT_TIMESTAMP})
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default : () => CURRENT_TIMESTAMP, onUpdate: CURRENT_TIMESTAMP})
    updatedAt: Date;

    @OneToMany(() => Review, (review) => review.product, {eager: true})// eager true to always load the relation
    reviews: Review[];


}