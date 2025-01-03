import { IsString } from 'class-validator';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('application_idea')
export class ApplicationIdeaEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', nullable: true })
  @IsString()
  application_id: string;

  @Column({ type: 'varchar' })
  @IsString()
  phone: string;

  @Column({ type: 'varchar' })
  @IsString()
  additional_phone: string;

  @Column({ type: 'varchar' })
  @IsString()
  photo: string;

  @Column({ type: 'varchar', nullable: true })
  @IsString()
  pinfl: string;

  @Column({ type: 'varchar' })
  @IsString()
  name: string;

  @Column({ type: 'varchar' })
  @IsString()
  surname: string;

  @Column({ type: 'varchar' })
  @IsString()
  patronymic: string;

  @Column({ type: 'varchar' })
  @IsString()
  birth_date: string;

  @Column({ type: 'varchar' })
  @IsString()
  passport_series: string;

  @Column({ type: 'varchar' })
  @IsString()
  passport_number: string;

  @Column({ type: 'varchar' })
  @IsString()
  passport_given: string;

  @Column({ type: 'varchar' })
  @IsString()
  passport_issue_date: string;

  @Column({ type: 'varchar' })
  @IsString()
  passport_expiry_date: string;

  @Column({ type: 'varchar' })
  @IsString()
  accept_agreement_url: string;

  @Column({ type: 'varchar' })
  @IsString()
  accept_agreement_date: string;

  @Column({ type: 'varchar', nullable: true })
  @IsString()
  card_number: string;

  @Column({ type: 'varchar', nullable: true })
  @IsString()
  expire: string;

  @Column({ type: 'varchar', nullable: true })
  @IsString()
  schedule_file: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateAt: Date;
}
