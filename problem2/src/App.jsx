import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowDown, 
  Search, 
  X, 
  RefreshCcw, 
  AlertCircle, 
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import clsx from 'clsx';
import './App.css';

const PRICE_URL = 'https://interview.switcheo.com/prices.json';
const ICON_BASE_URL = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens';

const TokenIcon = ({ symbol, className }) => {
  const [iconSrc, setIconSrc] = useState(`${ICON_BASE_URL}/${symbol}.svg`);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (hasError) return;

    const prefixes = ['axl', 'st', 'r', 'w', 'b', 'amp', 'wst'];
    let baseSymbol = symbol;
    
    // Case-insensitive prefix check
    for (const prefix of prefixes) {
      if (symbol.toLowerCase().startsWith(prefix.toLowerCase()) && symbol.length > prefix.length) {
        baseSymbol = symbol.slice(prefix.length);
        break;
      }
    }

    // Try variants: base symbol, uppercase base symbol
    if (baseSymbol !== symbol) {
      setIconSrc(`${ICON_BASE_URL}/${baseSymbol}.svg`);
      setHasError(true);
    } else if (symbol !== symbol.toUpperCase()) {
      // If original had lowercase (like axlUSDC) and failed, try pure uppercase
      setIconSrc(`${ICON_BASE_URL}/${symbol.toUpperCase()}.svg`);
      setHasError(true);
    } else {
      // Final fallback
      setIconSrc(`https://via.placeholder.com/24/334155/f8fafc?text=${symbol.charAt(0)}`);
      setHasError(true);
    }
  };

  useEffect(() => {
    setIconSrc(`${ICON_BASE_URL}/${symbol}.svg`);
    setHasError(false);
  }, [symbol]);

  return (
    <img 
      src={iconSrc} 
      alt={symbol}
      className={className}
      onError={handleError}
    />
  );
};

const App = () => {
  const [prices, setPrices] = useState([]);
  const [fromToken, setFromToken] = useState(null);
  const [toToken, setToToken] = useState(null);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('from'); // 'from' or 'to'
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  // Fetch and deduplicate prices
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(PRICE_URL);
        const data = await response.json();
        
        // Deduplicate: Keep the latest entry for each currency
        const uniquePrices = Object.values(
          data.reduce((acc, current) => {
            acc[current.currency] = current;
            return acc;
          }, {})
        );

        setPrices(uniquePrices);
        
        // Initial selection
        if (uniquePrices.length > 0) {
          setFromToken(uniquePrices.find(t => t.currency === 'ETH') || uniquePrices[0]);
          setToToken(uniquePrices.find(t => t.currency === 'USDC') || uniquePrices[1]);
        }
      } catch (err) {
        console.error('Failed to fetch prices:', err);
        setError('Failed to load token data. Please refresh.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrices();
  }, []);

  // Calculate conversion
  useEffect(() => {
    if (fromToken && toToken && fromAmount && !isNaN(fromAmount)) {
      const rate = fromToken.price / toToken.price;
      const calculated = (parseFloat(fromAmount) * rate).toFixed(6);
      setToAmount(calculated);
    } else {
      setToAmount('');
    }
  }, [fromAmount, fromToken, toToken]);

  const handleFromAmountChange = (e) => {
    const val = e.target.value;
    // Sanitization: Allow only numbers and one decimal point
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      setFromAmount(val);
      
      const numVal = parseFloat(val);
      if (val !== '' && (isNaN(numVal) || numVal <= 0)) {
        setError('Amount must be greater than 0');
      } else if (numVal > 1.25) { // Mock balance check
        setError('Insufficient balance');
      } else {
        setError('');
      }
    }
  };

  const swapTokens = () => {
    const prevFromToken = fromToken;
    const prevToToken = toToken;
    setFromToken(prevToToken);
    setToToken(prevFromToken);
    
    // Reverse conversion: Use the current toAmount as the new fromAmount
    if (toAmount) {
      setFromAmount(toAmount);
    }
  };

  const handleSwap = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsSubmitting(true);
    // Mock backend request
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    setFromAmount('');
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const filteredTokens = useMemo(() => {
    return prices.filter(token => 
      token.currency.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [prices, searchQuery]);

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
    setSearchQuery('');
  };

  const selectToken = (token) => {
    if (modalType === 'from') {
      setFromToken(token);
    } else {
      setToToken(token);
    }
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="app-container">
        <div className="glass-card" style={{ textAlign: 'center', padding: '40px' }}>
          <RefreshCcw className="loading-spinner" size={48} color="#6d28d9" />
          <p style={{ marginTop: '16px', color: '#94a3b8' }}>Loading secure rates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="success-alert"
          >
            <CheckCircle2 size={24} />
            Swap Successful!
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card"
      >
        <div className="card-header">
          <h1 className="card-title">Swap Tokens</h1>
        </div>

        {/* FROM INPUT */}
        <div className="input-group">
          <span className="label">You Pay</span>
          <div className="input-container">
            <div className="input-row">
              <input
                type="text"
                className="amount-input"
                placeholder="0.0"
                value={fromAmount}
                onChange={handleFromAmountChange}
              />
              <div className="currency-select" onClick={() => openModal('from')}>
                <TokenIcon 
                  symbol={fromToken?.currency} 
                  className="token-icon" 
                />
                <span className="currency-symbol">{fromToken?.currency}</span>
                <ChevronDown size={16} />
              </div>
            </div>
            <div className="price-info">
              <span>Balance: 1.25 {fromToken?.currency}</span>
              {fromToken && <span>≈ ${(parseFloat(fromAmount || 0) * fromToken.price).toLocaleString()}</span>}
            </div>
          </div>
        </div>

        {/* SWAP BUTTON */}
        <div className="swap-icon-container">
          <button className="swap-button-circle" onClick={swapTokens}>
            <ArrowDown size={20} />
          </button>
        </div>

        {/* TO INPUT */}
        <div className="input-group" style={{ marginTop: '12px' }}>
          <span className="label">You Receive</span>
          <div className="input-container">
            <div className="input-row">
              <input
                type="text"
                className="amount-input"
                placeholder="0.0"
                value={toAmount}
                readOnly
              />
              <div className="currency-select" onClick={() => openModal('to')}>
                <TokenIcon 
                  symbol={toToken?.currency} 
                  className="token-icon" 
                />
                <span className="currency-symbol">{toToken?.currency}</span>
                <ChevronDown size={16} />
              </div>
            </div>
            <div className="price-info">
              <span>Rate: 1 {fromToken?.currency} = {(fromToken?.price / toToken?.price).toFixed(4)} {toToken?.currency}</span>
              {toToken && <span>≈ ${(parseFloat(toAmount || 0) * toToken.price).toLocaleString()}</span>}
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        <button 
          className="submit-button" 
          disabled={isSubmitting || !fromAmount || parseFloat(fromAmount) <= 0 || error}
          onClick={handleSwap}
        >
          {isSubmitting ? (
            <>
              <RefreshCcw className="loading-spinner" size={20} />
              Swapping...
            </>
          ) : (
            'Swap Tokens'
          )}
        </button>
      </motion.div>

      {/* TOKEN SELECTOR MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="modal-content" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Select a token</h3>
                <X size={20} style={{ cursor: 'pointer' }} onClick={() => setIsModalOpen(false)} />
              </div>
              <input
                type="text"
                className="search-input"
                placeholder="Search name or paste address"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <div className="token-list">
                {filteredTokens.map((token, index) => (
                  <div 
                    key={`${token.currency}-${index}`}
                    className="token-item"
                    onClick={() => selectToken(token)}
                  >
                    <TokenIcon 
                      symbol={token.currency} 
                      className="token-icon" 
                    />
                    <div>
                      <div className="currency-symbol">{token.currency}</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                        ${token.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
