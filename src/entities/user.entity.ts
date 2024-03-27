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
  BeforeInsert,

} from "typeorm";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt"
import { Donation } from "./donation.entity";
import { Wallet } from "./wallet.entity";
import { TransactionPin, ITransactionPin } from "./transactionPin.entity";

@Entity()
@Unique(["email"])
export class User {
  @PrimaryGeneratedColumn()
  ID: number;

  @Index("email_index")
  @Column({ length: 255, nullable: false })
  email: string;

  @Column({ length: 255, nullable: false })
  username: string;

  @Column({ length: 255, nullable: false })
  password: string;

  @OneToOne(() => TransactionPin, (transactionPin) => transactionPin.user)
  @JoinColumn({ name: "transactionPinID" })
  transactionPin: ITransactionPin;

  @OneToMany(() => Donation, (donation) => donation.donor)
  userDonations: Donation[];

  @OneToMany(() => Donation, (donation) => donation.beneficiary)
  receivedDonations: Donation[];

  @OneToOne(() => Wallet, (wallet) => wallet.user)
  @JoinColumn({ name: "walletID" })
  wallet: Wallet;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 8);
  }

  async checkIfPlainPasswordIsValid(plainPassword: string) {
    return bcrypt.compare(plainPassword, this.password);
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
  toJSON() {
    const { password, ...other } = this;
    return other;
  }
}


export type IUser = {
  [T in keyof User]: User[T];
};


