# WalletPage Component Refactoring

This repository contains a refactored version of the `WalletPage` component, addressing several computational inefficiencies, anti-patterns, and logic errors found in the original implementation.

## Issues Found in Original Code

### 1. **Critical Runtime Error (Undefined Variable)**
- **Issue**: The variable `lhsPriority` was used in the `filter` function but was never defined.
- **Consequence**: This would cause the application to crash immediately upon execution.
- **Fix**: Replaced with `balancePriority`.

### 2. **Logic Error in Filtering**
- **Issue**: The filtering logic was `if (balance.amount <= 0) { return true; }`.
- **Consequence**: This filters **in** wallets with zero or negative balance and filters **out** wallets with positive balance. This is likely the opposite of the intended behavior.
- **Fix**: Changed condition to `balance.amount > 0` to show wallets with funds.

### 3. **Performance: Unnecessary Re-renders**
- **Issue**: The `useMemo` hook for `sortedBalances` included `prices` in its dependency array, but `prices` was not used inside the memoization block.
- **Consequence**: The heavy sorting operation would re-run whenever crypto prices changed, even if wallet balances remained the same.
- **Fix**: Removed `prices` from the dependency array.

### 4. **Performance: Re-creation of Helper Function**
- **Issue**: The `getPriority` function was defined *inside* the component.
- **Consequence**: The function was re-created on every render cycle. While cheap in isolation, it's unnecessary overhead.
- **Fix**: Moved `getPriority` outside the component scope as it does not depend on component state.

### 5. **Incorrect Data Usage (Bug)**
- **Issue**: The code calculated `formattedBalances` but never used it. Instead, it mapped over `sortedBalances` to create rows.
- **Consequence**: The `formatted` property (string representation of the amount) was missing from the data passed to `WalletRow`.
- **Fix**: Updated the code to map over `formattedBalances`.

### 6. **React Anti-Pattern: Index as Key**
- **Issue**: Used `key={index}` in the mapped elements.
- **Consequence**: This can lead to rendering bugs and performance issues when the list is re-ordered or filtered.
- **Fix**: Used `balance.currency` as a stable, unique key.

### 7. **TypeScript Issues**
- **Issue**: The `WalletBalance` interface was missing the `blockchain` property, and `getPriority` used `any` type.
- **Consequence**: Reduced type safety and potential for runtime errors.
- **Fix**: Added `blockchain` to the interface and typed the `getPriority` argument strictly.

## Usage

The refactored code is in `RefactoredWalletPage.tsx`. It assumes the existence of:
- `useWalletBalances` and `usePrices` hooks.
- `WalletRow` component.
- `classes` object (likely from a styling hook).
