
import { User } from '../entities/user.entity';
import { Wallet } from '../entities/wallet.entity';
import datasource from '../datasource';

export async function createBeneficiaryUser() {
  const userRepository = datasource.getRepository(User);
  const walletRepository = datasource.getRepository(Wallet);

  let user = await userRepository.findOne({ where: { username: 'artilleryTest' } });

  if (!user) {
    user = new User();
    user.email = 'jsanjnwjsdm@gmail.com';
    user.username = 'artilleryTest';
    user.password = 'beneficiaryPassword';

    const wallet = new Wallet();

    user.wallet = wallet;

    await walletRepository.save(wallet)
    await userRepository.save(user);
  }
}