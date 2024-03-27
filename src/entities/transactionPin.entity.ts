import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  JoinColumn,
  UpdateDateColumn,
  BeforeInsert,
} from "typeorm";
import { IUser, User } from "./user.entity";
import * as bcrypt from "bcrypt"

@Entity()
export class PIN {
  @PrimaryGeneratedColumn()
  ID: number;

  @OneToOne(() => User, (user) => user.transactionPin)
  @JoinColumn({ name: "userID" })
  user: IUser;

  @Column()
  pin: string;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  expiresIn: Date;

  @BeforeInsert()
  async hashPassword() {
    this.pin = await bcrypt.hash(this.pin, 8);
  }

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

  async checkIfPinIsValid(pin: string) {
    return bcrypt.compare(pin, this.pin);
  }
}

export type IPIN = {
  [T in keyof PIN]: PIN[T];
};
