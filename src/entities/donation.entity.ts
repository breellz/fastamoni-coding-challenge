import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User, IUser } from "./user.entity";

@Entity()
export class Donation {
  @PrimaryGeneratedColumn()
  ID: number;

  @ManyToOne(() => User, (user) => user.userDonations)
  @JoinColumn({ name: 'donorID' })
  donor: User;

  @ManyToOne(() => User, (user) => user.receivedDonations)
  @JoinColumn({ name: "beneficiaryID" })
  beneficiary: IUser;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @CreateDateColumn()
  date: Date;

  @Column({ type: 'text', nullable: true })
  message: string;

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