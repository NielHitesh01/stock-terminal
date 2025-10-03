import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const ToolbarContainer = styled.div`
  background-color: #0a0a0a;
  border-bottom: 2px solid #00ff00;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
  min-width: 250px;
`;

const SearchInput = styled.input`
  width: 100%;
  background-color: #000000;
  border: 1px solid #00ff00;
  color: #00ff00;
  padding: 8px 12px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  outline: none;
  
  &:focus {
    border-color: #00ffff;
    box-shadow: 0 0 5px #00ff00;
  }
  
  &::placeholder {
    color: #666666;
  }
`;

const AutocompleteList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #000000;
  border: 1px solid #00ff00;
  border-top: none;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  margin-top: -1px;
`;

const AutocompleteItem = styled.div<{ $isSelected: boolean }>`
  padding: 8px 12px;
  cursor: pointer;
  color: ${props => props.$isSelected ? '#000000' : '#00ff00'};
  background-color: ${props => props.$isSelected ? '#00ff00' : 'transparent'};
  
  &:hover {
    background-color: #00ff00;
    color: #000000;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const FunctionButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  background-color: ${props => props.$variant === 'primary' ? '#00ff00' : 'transparent'};
  color: ${props => props.$variant === 'primary' ? '#000000' : '#00ff00'};
  border: 1px solid #00ff00;
  padding: 6px 12px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #00ff00;
    color: #000000;
    box-shadow: 0 0 5px #00ff00;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuickTickerButton = styled(FunctionButton)`
  min-width: 60px;
  font-weight: bold;
`;

const Divider = styled.div`
  width: 1px;
  height: 24px;
  background-color: #333333;
`;

const Label = styled.span`
  color: #666666;
  font-size: 11px;
  text-transform: uppercase;
`;

interface ToolbarProps {
  onTickerSelect: (ticker: string) => void;
  onFunctionSelect: (func: string) => void;
  activePanel: number;
  onOpenLayoutManager?: () => void;
}

const popularTickers = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'TSLA', name: 'Tesla, Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'META', name: 'Meta Platforms Inc.' },
  { symbol: 'BRK.B', name: 'Berkshire Hathaway' },
  { symbol: 'JPM', name: 'JPMorgan Chase' },
  { symbol: 'V', name: 'Visa Inc.' },
];

const functions = [
  { code: 'DES', name: 'Description', tooltip: 'Company Overview' },
  { code: 'GIP', name: 'Chart', tooltip: 'Price Chart with Indicators' },
  { code: 'FA', name: 'Fundamentals', tooltip: 'Financial Analysis' },
  { code: 'N', name: 'News', tooltip: 'Latest News' },
  { code: 'SCH', name: 'Supply Chain', tooltip: 'Supply Chain Diagram' },
  { code: 'OPT', name: 'Options', tooltip: 'Options Chain with Greeks' },
  { code: 'W', name: 'Watchlist', tooltip: 'My Watchlist', noTicker: true },
  { code: 'EQS', name: 'Screener', tooltip: 'Equity Screener', noTicker: true },
  { code: 'FIL', name: 'Filings', tooltip: 'SEC Filings' },
  { code: 'HELP', name: 'Help', tooltip: 'Command Reference', noTicker: true },
];

const Toolbar = ({ onTickerSelect, onFunctionSelect, activePanel }: ToolbarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredTickers = popularTickers.filter(
    ticker =>
      ticker.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticker.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowAutocomplete(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowAutocomplete(e.target.value.length > 0);
    setSelectedIndex(0);
  };

  const handleTickerClick = (ticker: string) => {
    onTickerSelect(ticker);
    setSearchQuery(ticker);
    setShowAutocomplete(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showAutocomplete) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredTickers.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredTickers.length) % filteredTickers.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredTickers[selectedIndex]) {
          handleTickerClick(filteredTickers[selectedIndex].symbol);
        }
        break;
      case 'Escape':
        setShowAutocomplete(false);
        break;
    }
  };

  const handleFunctionClick = (funcCode: string) => {
    onFunctionSelect(funcCode);
  };

  return (
    <ToolbarContainer>
      <SearchContainer ref={searchRef}>
        <SearchInput
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          onFocus={() => searchQuery && setShowAutocomplete(true)}
          placeholder="Search ticker (e.g., AAPL, MSFT)..."
        />
        {showAutocomplete && filteredTickers.length > 0 && (
          <AutocompleteList>
            {filteredTickers.map((ticker, index) => (
              <AutocompleteItem
                key={ticker.symbol}
                $isSelected={index === selectedIndex}
                onClick={() => handleTickerClick(ticker.symbol)}
              >
                <strong>{ticker.symbol}</strong> - {ticker.name}
              </AutocompleteItem>
            ))}
          </AutocompleteList>
        )}
      </SearchContainer>

      <Divider />

      <Label>Quick Access:</Label>
      <ButtonGroup>
        <QuickTickerButton onClick={() => handleTickerClick('AAPL')}>
          AAPL
        </QuickTickerButton>
        <QuickTickerButton onClick={() => handleTickerClick('MSFT')}>
          MSFT
        </QuickTickerButton>
        <QuickTickerButton onClick={() => handleTickerClick('GOOGL')}>
          GOOGL
        </QuickTickerButton>
        <QuickTickerButton onClick={() => handleTickerClick('TSLA')}>
          TSLA
        </QuickTickerButton>
      </ButtonGroup>

      <Divider />

      <Label>Functions:</Label>
      <ButtonGroup>
        {functions.map(func => (
          <FunctionButton
            key={func.code}
            onClick={() => handleFunctionClick(func.code)}
            title={func.tooltip}
          >
            {func.code}
          </FunctionButton>
        ))}
      </ButtonGroup>

      <Divider />

      <Label style={{ marginLeft: 'auto' }}>Active Panel: {activePanel}</Label>
    </ToolbarContainer>
  );
};

export default Toolbar;
