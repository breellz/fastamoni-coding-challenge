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

import { Wallet } from "./wallet.entity";

export enum TransactionType {
  DEBIT = "DEBIT",
  CREDIT = "CREDIT",
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  ID: number;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  wallet: Wallet;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: "enum",
    enum: TransactionType,
  })
  type: TransactionType;

  @Column({ length: 255 })
  description: string;

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