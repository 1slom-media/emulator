import { IsString } from 'class-validator';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('product_idea')
export class ProductIdeaEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar',})
  @IsString()
  application_id: string;

  @Column({ type: 'varchar' })
  @IsString()
  product_id: string;

  @Column({ type: 'varchar' })
  @IsString()
  month: string;

  @Column({ type: 'varchar' })
  @IsString()
  name: string;

  @Column({ type: 'varchar', nullable: true })
  @IsString()
  amount: string;

  @Column({ type: 'varchar' })
  @IsString()
  ikpu: string;

  @Column({ type: 'varchar' })
  @IsString()
  good_type_name: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateAt: Date;
}
