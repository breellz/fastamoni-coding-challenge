import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  JoinColumn,
  UpdateDateColumn,
} from "typeorm";
import { IUser, User } from "./user.entity";

@Entity()
export class PIN {
  @PrimaryGeneratedColumn()
  ID: number;

  @OneToOne(() => User, (user) => user.pin)
  @JoinColumn({ name: "userID" })
  user: IUser;

  @Column()
  pin: string;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  expiresIn: Date;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  updatedAt: Date;
}

export type IPIN = {
  [T in keyof PIN]: PIN[T];
};
