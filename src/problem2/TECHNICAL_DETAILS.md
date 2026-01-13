# 🛠️ Technical Documentation: Fancy Swap Form

## 📌 Executive Summary
A professional-grade Currency Swap interface designed for the modern DeFi ecosystem. This solution focuses on **high-performance state management**, **secure input handling**, and a **premium visual identity**.

---

## 🏗️ Architecture & Component Logic

### 1. Data Integrity Layer (`useEffect` & `reduce`)
The application fetches live prices from the Switcheo API. Since the API provides historical data points, the logic implements a "Last-In-First-Out" (LIFO) deduplication strategy:
```javascript
const uniquePrices = Object.values(
  data.reduce((acc, current) => {
    acc[current.currency] = current; // Keeps only the most recent entry
    return acc;
  }, {})
);
```

### 2. Smart Icon Resolution (`TokenIcon` Component)
To solve the issue of missing icons for bridged tokens (e.g., `axlUSDC`, `stETH`), a recursive fallback logic was implemented:
- **Primary**: Search for the exact symbol (e.g., `axlUSDC.svg`).
- **Secondary**: Strip common DeFi prefixes (`axl`, `st`, `r`, `w`) and search for the base asset (e.g., `USDC.svg`).
- **Tertiary**: Case-insensitive matching and auto-uppercase transformation.
- **Final Fallback**: A clean, text-based placeholder to maintain UI professionalism.

### 3. Conversion Engine
The exchange rate is calculated in real-time using a side-effect hook:
- **Formula**: `toAmount = (fromAmount * fromToken.price) / toToken.price`
- **Precision**: Fixed to 6 decimal places to prevent floating-point display errors while maintaining high accuracy for small-cap tokens.

---

## 🎨 UI/UX Design System

### 💎 Glassmorphism 2.0
The interface utilizes advanced CSS techniques to create a "depth" effect:
- **Backdrop Blur**: `blur(16px)` for a frosted glass look.
- **Layering**: Semi-transparent slate backgrounds (`#1e293b99`) combined with subtle inner glows.
- **Typography**: Uses the 'Inter' typeface for maximum readability in financial contexts.

### 🏎️ Motion & Feedback
Powered by **Framer Motion**, the app includes:
- **Layout Animations**: Smooth expansion when error messages appear.
- **Haptic Feedback (Visual)**: Scale effects on buttons when clicked.
- **Contextual Notifications**: Success alerts that slide in only after the mock transaction is verified.

---

## 🛡️ Security & Reliability

| Feature | Implementation | Benefit |
| :--- | :--- | :--- |
| **Input Sanitization** | Regex `^\d*\.?\d*$` | Prevents XSS and invalid character entry. |
| **Balance Protection** | Mock balance check (1.25 limit) | Prevents users from attempting to swap more than available. |
| **Transaction Guard** | `isSubmitting` state lock | Prevents double-click transaction submission. |
| **Error Handling** | `try-catch` blocks on API calls | Ensures the app doesn't crash if the price API is down. |

---

## 🚀 Future Scalability Suggestions
If this were to move to a production environment, we could add:
1. **Wallet Integration**: Connect with MetaMask or Keplr using `ethers.js` or `cosmjs`.
2. **Slippage Settings**: Allow users to set their maximum acceptable price impact.
3. **Charts**: Integrate `Lightweight Charts` to show price history for the selected pair.
4. **Gas Estimation**: Calculate real-time transaction fees for the selected blockchain.

---

## 📖 How to Deploy
1. **Build**: `npm run build`
2. **Preview**: `npm run preview`
3. **Deploy**: Upload the `dist/` folder to Netlify, Vercel, or any static hosting.

*Prepared by AI Assistant for 99Tech Challenge.*
