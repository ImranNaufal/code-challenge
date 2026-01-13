# 99Tech Code Challenge - Problem 2: Fancy Form

## 🚀 Overview
A high-fidelity, production-ready **Currency Swap Form** built for the 99Tech Code Challenge. This application simulates a modern Decentralized Exchange (DEX) interface, allowing users to swap various crypto assets with real-time price calculations, smooth animations, and a sophisticated "Glassmorphism" UI.

## 🛠️ Tech Stack
- **Framework**: [React](https://reactjs.org/) (Functional Components + Hooks)
- **Build Tool**: [Vite](https://vite.dev/) (Fast HMR & Optimized Bundling)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) (Layout transitions & UI effects)
- **Icons**: [Lucide React](https://lucide.dev/) (Consistent SVG iconography)
- **Styling**: Pure CSS3 with Custom Properties (Modern Dark Mode & Glassmorphism)

## ✨ Key Features

### 1. Real-time Exchange Logic
- **Automated Calculation**: Instantly computes the output amount based on the `(Amount * PriceA) / PriceB` formula.
- **Live Price Integration**: Fetches real-time price data from the Switcheo API.
- **Asset Deduplication**: Automatically filters out duplicate currency entries from the data source to ensure UI consistency.

### 2. Professional DEX UI/UX
- **Glassmorphism Design**: A sleek interface featuring `backdrop-filter` blur, semi-transparent layers, and subtle borders.
- **Token Selector Modal**: A searchable modal interface for easy asset selection, handling dozens of available tokens gracefully.
- **Dynamic Icons**: Automatically pulls SVG icons for tokens from the Switcheo repository with fallback handling for missing assets.
- **Responsive Layout**: Fully optimized for mobile, tablet, and desktop viewports.

### 3. Interactive Feedback
- **Mock Transaction Flow**: Simulates a blockchain interaction with a 2-second loading state and animated success notification.
- **Validation Suite**: 
  - Prevents swaps for zero or empty amounts.
  - Validates numeric input.
  - Displays context-aware error messages.
  - Disables the "Swap" button during invalid states or pending submissions.

## 🏗️ Architecture & Data Flow

### Data Fetching
Upon mounting, the application fetches the price list from `https://interview.switcheo.com/prices.json`. It processes this data to remove duplicates by keeping only the most recent entry for each currency symbol.

### State Management
The app utilizes React's `useState` and `useMemo` hooks to manage:
- `prices`: The master list of available tokens.
- `fromToken` / `toToken`: Currently selected asset pair.
- `fromAmount` / `toAmount`: Input and calculated values.
- `isSubmitting`: Controls the loading state of the mock backend request.
- `isModalOpen`: Manages the visibility of the token selection interface.

### Component Logic (`src/App.jsx`)
- **`useEffect` (Conversion)**: Triggered whenever the input amount or selected tokens change, ensuring the output is always accurate.
- **`handleSwap`**: Mocks an asynchronous API call using a `Promise` and `setTimeout`.

## 📁 Project Structure
```text
src/
├── assets/          # Static assets
├── App.jsx          # Main application logic & components
├── App.css          # Core UI styling (Glassmorphism & Layout)
├── index.css        # Global styles & Theme variables
└── main.jsx         # React entry point
```

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation
1. Clone the repository and navigate to the project folder.
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally
Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

### Building for Production
Create an optimized build:
```bash
npm run build
```

---
*Created as part of the 99Tech Frontend Challenge.*
