import React, { useMemo } from 'react';

// Assumed imports or definitions from external libraries/files
interface BoxProps {
  // ... placeholder for BoxProps
  [key: string]: any;
}
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // Added missing property 'blockchain'
}
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

// Mocking hooks/components for the sake of the example
declare function useWalletBalances(): WalletBalance[];
declare function usePrices(): Record<string, number>;
declare const classes: Record<string, string>;
declare const WalletRow: React.FC<any>;

interface Props extends BoxProps {}

const getPriority = (blockchain: string): number => {
  switch (blockchain) {
    case 'Osmosis':
      return 100;
    case 'Ethereum':
      return 50;
    case 'Arbitrum':
      return 30;
    case 'Zilliqa':
      return 20;
    case 'Neo':
      return 20;
    default:
      return -99;
  }
};

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        // Fixed logic: lhsPriority was undefined. 
        // Also assuming the intention was to show balances with priority > -99 AND positive amount.
        return balancePriority > -99 && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
        return 0;
      });
  }, [balances]); // Removed 'prices' from dependency array as it's not used in sorting

  const formattedBalances = useMemo(() => {
     return sortedBalances.map((balance: WalletBalance) => {
      return {
        ...balance,
        formatted: balance.amount.toFixed()
      };
    });
  }, [sortedBalances]);

  const rows = formattedBalances.map((balance: FormattedWalletBalance) => {
    // added safe access check for prices
    const usdValue = (prices[balance.currency] || 0) * balance.amount;
    return (
      <WalletRow 
        className={classes.row}
        key={balance.currency} // Changed from index to unique ID
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  });

  return (
    <div {...rest}>
      {rows}
    </div>
  );
};

export default WalletPage;
