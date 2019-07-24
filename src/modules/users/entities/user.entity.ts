import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

    @Column({type: 'datetime', default: new Date().toISOString()})
    createdAt: string;

    @Column({type: 'datetime', default: new Date().toISOString()})
    updatedAt: string;

    @Column('varchar')
    password: string;

    @Column('varchar')
    verificationCode: string;

}
