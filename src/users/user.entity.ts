import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CURRENT_TIMESTAMP } from "../utils/constants";
import { Review } from "src/reviews/review.entity";
import { UserRole } from "src/utils/user_role";
import { Exclude } from "class-transformer";


@Entity({ name: 'user_db' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 150, nullable: true})
    username: string;

    @Column({type: 'varchar', length: 250, unique: true })
    email: string;

    @Column({type: 'varchar', length: 150 })
    @Exclude()
    password: string;

    @Column({type: 'varchar', nullable: true, default: null })
    imageProfile: string | null;

    @Column({type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @Column({ default: false })
    isActive: boolean;

    @Column({ nullable: true, default: null })
    verificationToken: string ;

    @Column({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => CURRENT_TIMESTAMP, onUpdate: CURRENT_TIMESTAMP })
    updatedAt: Date;
    
    @OneToMany(() => Review, (review) => review.user)
    reviews: Review[];
}