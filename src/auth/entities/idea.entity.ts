import { IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn} from "typeorm";

@Entity("auth_idea")
export class IdeaAuthEntity{
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ type: "varchar" })
    @IsString()
    login: string

    @Column({ type: "varchar" })
    @IsString()
    password: string

    @Column({ type: "varchar",nullable:true })
    @IsString()
    access_token: string

    @Column({ type: "varchar",nullable:true })
    @IsString()
    model_id: string

    @Column({ type: "varchar" })
    @IsString()
    broker_key: string

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updateAt: Date;
}