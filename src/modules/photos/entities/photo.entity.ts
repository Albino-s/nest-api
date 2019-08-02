import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Photo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    description: string;

    @Column('varchar')
    url: string;

    @Column('varchar')
    type: string;

    @Column('int')
    width: number;

    @Column('int')
    height: number;

    @Column('int')
    position: number;

    @Column({type: 'boolean', default: true})
    isActive: boolean;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;

}
