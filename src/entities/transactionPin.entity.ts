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
export class TransactionPin {
  @PrimaryGeneratedColumn()
  ID: number;

  @OneToOne(() => User, (user) => user.transactionPin)
  user: IUser;

  @Column()
  pin: string;

  @BeforeInsert()
  async hashPin() {
    if (typeof this.pin === 'string') {
      this.pin = await bcrypt.hash(this.pin, 8);
    } else {
      throw new Error('Pin must be a string');
    }
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

  toJSON() {
    const { pin, ...other } = this;
    return other;
  }
}

export type ITransactionPin = {
  [T in keyof TransactionPin]: TransactionPin[T];
};
