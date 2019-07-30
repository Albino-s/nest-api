import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    fullName: string;

    @Column('varchar')
    email: string;

    @Column({type: 'boolean', default: false})
    isAdmin: boolean;

    @Column({type: 'boolean', default: false})
    isVerified: boolean;

    // @Column({type: 'datetime', default: "CURRENT_TIMESTAMP"})
    @CreateDateColumn()
    createdAt: string;

    // @Column({type: 'datetime', default: "CURRENT_TIMESTAMP"})
    @UpdateDateColumn()
    updatedAt: string;

    @Column('varchar')
    password: string;

    @Column('varchar')
    verificationCode: string;

}
