import { IsString } from 'class-validator';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('api_client_log')
export class ApiLogEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar' })
  @IsString()
  url: string;

  @Column({ type: 'varchar', nullable: true })
  @IsString()
  brokerType: string;

  @Column('json', { nullable: true })
  data: object;

  @Column('json', { nullable: true })
  response: object;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateAt: Date;
}
