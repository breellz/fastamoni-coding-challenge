import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  OneToMany,
  Index,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  Not,
} from "typeorm";
import { User, IUser } from "./user.entity";
import { Transaction } from "./transaction.entity"

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  ID: number;

  @OneToOne(() => User, (user) => user.wallet)
  user: IUser;

  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  transactions: Transaction[];

  @Column({ type: "decimal", precision: 10, scale: 2, default: 100000 })
  balance: number;

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