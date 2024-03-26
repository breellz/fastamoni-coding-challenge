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
import * as jwt from "jsonwebtoken";
import { Donation } from "./donation.entity";
import { Wallet } from "./wallet.entity";
import { PIN, IPIN } from "./pin.entity";

@Entity()
@Unique(["email"])
export class User {
  @PrimaryGeneratedColumn()
  ID: number;

  @OneToOne(() => PIN, (pin) => pin.user)
  @JoinColumn({ name: "pinID" })
  pin: IPIN;

  @OneToMany(() => Donation, (donation) => donation.donor)
  userDonations: Donation[];

  @OneToMany(() => Donation, (donation) => donation.beneficiary)
  receivedDonations: Donation[];

  @OneToOne(() => Wallet, (wallet) => wallet.user)
  @JoinColumn({ name: "walletID" })
  wallet: Wallet;

  @Index("email_index")
  @Column({ length: 255, nullable: false })
  email: string;


  @Column({ length: 255, nullable: false })
  username: string;

  @Column({ length: 255, nullable: false })
  password: string;

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

  generateToken() {
    return jwt.sign(
      {
        ID: this.ID,
      },
      process.env.JWT_SECRET as jwt.Secret,
      {
        expiresIn: "7d"
      },
    );
  }

  getSimpleProfile() {
    return {
      ID: this.ID,
      email: this.email,
      username: this.username,
    };
  }
}


export type IUser = {
  [T in keyof User]: User[T];
};


