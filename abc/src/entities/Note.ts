import 'reflect-metadata';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from './Category';

export type Priority = 'low' | 'medium' | 'high';

@Entity('notes')
export class Note {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ default: 'General' })
  category!: string;

  @Column({ default: 'medium' })
  priority!: Priority;

  @Column({ default: false })
  isPinned!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Category, (category) => category.notes, { nullable: true, eager: false })
  @JoinColumn({ name: 'categoryId' })
  categoryEntity!: Category | null;

  @Column({ nullable: true })
  categoryId!: number | null;
}
