import { AccountType, getConfig, MarginfiClient, MarginfiAccount } from '@mercurial-finance/marginfi-client-v2';
import { NodeWallet } from '@mrgnlabs/mrgn-common';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import BN from 'bn.js';
import { Decimal } from 'decimal.js';
import { logAll } from './lib/utils/log-all';

const main = async () => {
  const connection = new Connection(
    'https://solana-mainnet.g.alchemy.com/v2/DZRZbJnzrSkBB7LrEyhJ2uNAq9NEsyIW',
    'confirmed',
  );
  const wallet = NodeWallet.local();
  const config = getConfig();
  const client = await MarginfiClient.fetch(config, wallet, connection);
  // const accounts = await client.getMarginfiAccountsForAuthority('4aKQfBxhpBCmmjrxMWqHbb3eznd3ge4X5b4YY255o4CY');
  const marginFiPublicKey = 'HgXZcUHdfNLxELXBRMq6eyV23GqPYzjCUCTmCSKVEWb5'; // accounts[0].publicKey;
  const marginfiAccount = await MarginfiAccount.fetch(marginFiPublicKey, client);
  const bank = marginfiAccount.group.getBankByMint(new PublicKey('So11111111111111111111111111111111111111112'));
  bank.getInterestRates;
  const balance = marginfiAccount.getBalance(new PublicKey('CCKtUs6Cgwo4aaQUmBPmyoApH2gUDErxNZCAntD6LYGh'));
  // logAll({
  //   balance,
  //   assetShares: balance.assetShares.toString(),
  //   liabilityShares: balance.liabilityShares.toString(),
  //   marginfiAccount,
  // });
  // logAll(bank);
  console.log({
    assetValue: bank.assetShareValue.toString(),
    totalAssetShares: bank.totalAssetShares.toString(),
    totalLiabilityShares: bank.totalLiabilityShares.toString(),
    insuranceVault: bank.insuranceVault.toBase58(),
    assetWeightInit: bank.config.assetWeightInit.toString(),
    assetWeightMaint: bank.config.assetWeightMaint.toString(),
    liabilityWeightInit: bank.config.liabilityWeightInit.toString(),
    liabilityWeightMaint: bank.config.liabilityWeightMaint.toString(),
    depositLimit: bank.config.depositLimit,
    interestRateConfig: {
      optimalUtilizationRate: bank.config.interestRateConfig.optimalUtilizationRate.toString(),
      plateauInterestRate: bank.config.interestRateConfig.plateauInterestRate.toString(),
      maxInterestRate: bank.config.interestRateConfig.maxInterestRate.toString(),
      insuranceFeeFixedApr: bank.config.interestRateConfig.insuranceFeeFixedApr.toString(),
      insuranceIrFee: bank.config.interestRateConfig.insuranceIrFee.toString(),
      protocolFixedFeeApr: bank.config.interestRateConfig.protocolFixedFeeApr.toString(),
      protocolIrFee: bank.config.interestRateConfig.protocolIrFee.toString(),
    },
    rates: {
      lendingRate: bank.getInterestRates().lendingRate.toString(),
    },
  });

  await marginfiAccount.deposit(1, marginfiAccount.group.getBankByLabel('SOL'));
  logAll(bank.getInterestRates());
};

main();

// export function wrappedI80F48toBigNumber({ value }: { value: BN }, scaleDecimal: number = 0): BigNumber {
//   if (!value) return new BigNumber(0);

//   const binary = value.abs().toString(2);
//   const decimalConstructorStr = `${value.isNeg() ? '-' : ''}0b${binary}p-48`;
//   console.log({ binary, decimalConstructorStr });
//   const numbers = new Decimal(decimalConstructorStr).dividedBy(10 ** scaleDecimal);
//   return new BigNumber(numbers.toString());
// }

// console.log(wrappedI80F48toBigNumber({ value: new BN('2eda1ac03582f2225e0', 16) }));
