import { useState } from 'react';
import styled from 'styled-components';
import { PanelState } from './Terminal';
import CommandInput from './CommandInput';
import PanelHeader from './PanelHeader';
import DESFunction from './functions/DESFunction';
import GIPFunctionEnhanced from './functions/GIPFunctionEnhanced';
import FAFunction from './functions/FAFunction';
import HELPFunction from './functions/HELPFunction';
import WFunction from './functions/WFunction';
import NewsWithSentiment from './functions/NewsWithSentiment';
import EQSFunction from './functions/EQSFunction';
import FILFunction from './functions/FILFunction';
import UniversalCompanyAnalysis from './functions/UniversalCompanyAnalysis';
import OptionsChainFunction from './functions/OptionsChainFunction';
import PortfolioTracker from './functions/PortfolioTracker';
import StockComparison from './functions/StockComparison';
import EconomicCalendar from './functions/EconomicCalendar';
import SectorHeatmap from './functions/SectorHeatmap';
import AlertsEnhanced from './functions/AlertsEnhanced';

const PanelContainer = styled.div<{ $isActive: boolean }>`
  background-color: #000000;
  border: 2px solid ${props => props.$isActive ? '#00ff00' : '#333333'};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: border-color 0.2s;
  min-height: 0;
  min-width: 0;
  height: 100%;
  width: 100%;

  &:hover {
    border-color: ${props => props.$isActive ? '#00ff00' : '#666666'};
  }
`;

const QuoteBar = styled.div`
  background-color: #0a0a0a;
  border-bottom: 1px solid #333333;
  padding: 6px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
`;

const QuoteSection = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const QuoteLabel = styled.span`
  color: #666666;
  text-transform: uppercase;
  font-size: 9px;
`;

const QuoteValue = styled.span<{ $color?: string }>`
  color: ${props => props.$color || '#00ffff'};
  font-weight: bold;
  font-size: 12px;
`;

const QuoteChange = styled.span<{ $positive: boolean }>`
  color: ${props => props.$positive ? '#00ff00' : '#ff0000'};
  font-weight: bold;
  font-size: 11px;
`;

const LastUpdate = styled.span`
  color: #666666;
  font-size: 9px;
`;

const PanelContent = styled.div`
  flex: 1;
  overflow: auto;
  padding: 10px;
  font-size: 12px;
  min-height: 0;
  min-width: 0;
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666666;
  flex-direction: column;
  gap: 10px;
  text-align: center;
  padding: 20px;
`;

const ErrorMessage = styled.div`
  color: #ff0000;
  padding: 20px;
  border: 2px solid #ff0000;
  background-color: #1a0000;
  margin: 20px;
  border-radius: 4px;
  font-size: 13px;
  line-height: 1.6;
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #00ff00;
  font-size: 14px;
  
  &::after {
    content: '...';
    animation: dots 1.5s steps(4, end) infinite;
  }

  @keyframes dots {
    0%, 20% { content: '.'; }
    40% { content: '..'; }
    60%, 100% { content: '...'; }
  }
`;

interface PanelProps {
  panel: PanelState;
  isActive?: boolean;
  onClick?: () => void;
  updatePanel: (panelId: number, updates: Partial<PanelState>) => void;
  setStatusMessage: (message: string) => void;
  showCommandLine: boolean;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

const Panel = ({ panel, isActive = true, onClick = () => {}, updatePanel, setStatusMessage, showCommandLine, isFullscreen = true, onToggleFullscreen = () => {} }: PanelProps) => {
  const [showFunctionMenu, setShowFunctionMenu] = useState(false);

  const handleClear = () => {
    updatePanel(panel.id, {
      ticker: '',
      function: '',
      data: null,
      loading: false,
      error: null
    });
    setStatusMessage(`Panel ${panel.id} cleared`);
  };

  const handleFunctionSelect = (func: string) => {
    if (panel.ticker) {
      // Execute function with current ticker
      updatePanel(panel.id, { function: func, loading: true, error: null });
      setStatusMessage(`Executing ${panel.ticker} ${func}...`);
      
      import('../services/api').then(({ executeCommand }) => {
        executeCommand(panel.ticker, func)
          .then(data => {
            updatePanel(panel.id, { loading: false, data });
            setStatusMessage(`Success: ${panel.ticker} ${func} loaded`);
          })
          .catch((error: any) => {
            updatePanel(panel.id, { loading: false, error: error.message });
            setStatusMessage(`Error: ${error.message}`);
          });
      });
    } else {
      setStatusMessage(`Select a ticker first for Panel ${panel.id}`);
    }
  };
  const renderContent = () => {
    // Debug logging
    console.log('Panel render:', { 
      id: panel.id, 
      ticker: panel.ticker, 
      function: panel.function,
      loading: panel.loading, 
      error: panel.error,
      hasData: !!panel.data,
      panelObject: panel
    });

    // Check for errors first - be very explicit
    if (panel.error !== null && panel.error !== undefined && panel.error !== '') {
      console.log('Rendering error message:', panel.error);
      return (
        <ErrorMessage>
          <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#ff0000' }}>⚠️ ERROR</div>
          <div style={{ color: '#ff6666', fontSize: '14px' }}>{String(panel.error)}</div>
          <div style={{ marginTop: '15px', fontSize: '11px', color: '#ff6666' }}>
            <div>Available functions:</div>
            <div style={{ marginTop: '5px', color: '#00ff00' }}>
              DES, GIP, FA, W, N, EQS, FIL, SCH, OPT, HELP
            </div>
          </div>
        </ErrorMessage>
      );
    }

    // Check for loading state
    if (panel.loading) {
      return <LoadingSpinner>Loading data...</LoadingSpinner>;
    }

    // Check if ticker and function are set
    if (!panel.ticker || !panel.function) {
      return (
        <EmptyState>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#00ffff' }}>
            PANEL {panel.id}
          </div>
          <div style={{ marginTop: '15px' }}>
            Use toolbar to select ticker and function
          </div>
          <div style={{ fontSize: '10px', marginTop: '10px', color: '#666666' }}>
            Or type command: [TICKER] [FUNCTION]<br />
            <br />
            Examples:<br />
            • Search "AAPL" → Click DES button<br />
            • Quick Access: Click "MSFT" → Click GIP<br />
            • Type: GOOGL DES &lt;Enter&gt;
          </div>
        </EmptyState>
      );
    }

    // Render specific function components
    try {
      switch (panel.function.toUpperCase()) {
        case 'DES':
          return <DESFunction ticker={panel.ticker} data={panel.data} />;
        case 'GIP':
          return <GIPFunctionEnhanced ticker={panel.ticker} data={panel.data} />;
        case 'FA':
          return <FAFunction ticker={panel.ticker} data={panel.data} />;
        case 'W':
          return <WFunction data={panel.data} />;
        case 'N':
          return <NewsWithSentiment ticker={panel.ticker} />;
        case 'HELP':
          return <HELPFunction data={panel.data} />;
        case 'EQS':
          return <EQSFunction data={panel.data} />;
        case 'FIL':
          return <FILFunction ticker={panel.ticker} data={panel.data} />;
        case 'SCH':
          return <UniversalCompanyAnalysis ticker={panel.ticker} />;
        case 'OPT':
          return <OptionsChainFunction ticker={panel.ticker} />;
        case 'PORT':
          return <PortfolioTracker />;
        case 'COMP':
          return <StockComparison />;
        case 'CAL':
          return <EconomicCalendar />;
        case 'HEAT':
          return <SectorHeatmap />;
        case 'ALERT':
          return <AlertsEnhanced />;
        default:
          return (
            <ErrorMessage>
              <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>UNKNOWN FUNCTION</div>
              <div>Unknown function: {panel.function}</div>
              <div style={{ marginTop: '15px', fontSize: '11px', color: '#ff6666' }}>
                Available functions: DES, GIP, FA, W, N, EQS, FIL, SCH, OPT, PORT, COMP, CAL, HEAT, ALERT, HELP
              </div>
            </ErrorMessage>
          );
      }
    } catch (error: any) {
      return (
        <ErrorMessage>
          <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>⚠️ RENDER ERROR</div>
          <div>{error.message || 'An unexpected error occurred'}</div>
        </ErrorMessage>
      );
    }
  };

  // Extract price data if available
  const getPriceData = () => {
    if (!panel.data) return null;
    
    // For DES function
    if (panel.function?.toUpperCase() === 'DES' && panel.data.price) {
      return {
        price: panel.data.price,
        change: panel.data.change || 0,
        changePercent: panel.data.changePercent || 0,
      };
    }
    
    // For GIP function - get latest price
    if (panel.function?.toUpperCase() === 'GIP' && panel.data.prices?.length > 0) {
      const prices = panel.data.prices;
      const latest = prices[prices.length - 1];
      const previous = prices[0];
      const change = latest.close - previous.close;
      const changePercent = (change / previous.close) * 100;
      
      return {
        price: latest.close,
        change,
        changePercent,
      };
    }
    
    return null;
  };

  const renderQuoteBar = () => {
    const hideQuoteBar = ['HELP', 'W', 'EQS'].includes(panel.function?.toUpperCase() || '');
    if (!panel.ticker || hideQuoteBar) {
      return null;
    }

    const priceData = getPriceData();
    if (!priceData) return null;

    const isPositive = priceData.change >= 0;
    const now = new Date().toLocaleTimeString();

    return (
      <QuoteBar>
        <QuoteSection>
          <div>
            <QuoteLabel>Price:</QuoteLabel>
            <QuoteValue> ${priceData.price.toFixed(2)}</QuoteValue>
          </div>
          <div>
            <QuoteLabel>Change:</QuoteLabel>
            <QuoteChange $positive={isPositive}>
              {' '}{isPositive ? '+' : ''}{priceData.change.toFixed(2)} ({isPositive ? '+' : ''}{priceData.changePercent.toFixed(2)}%)
            </QuoteChange>
          </div>
        </QuoteSection>
        <LastUpdate>Updated: {now}</LastUpdate>
      </QuoteBar>
    );
  };

  try {
    const content = renderContent();
    console.log('Content to render:', content ? 'has content' : 'NULL/UNDEFINED');
    
    return (
      <PanelContainer $isActive={isActive} onClick={onClick}>
        <PanelHeader
          panelId={panel.id}
          ticker={panel.ticker}
          functionCode={panel.function}
          isActive={isActive}
          onClear={handleClear}
          onFunctionSelect={handleFunctionSelect}
          showFunctionMenu={showFunctionMenu}
          onToggleFunctionMenu={() => setShowFunctionMenu(!showFunctionMenu)}
          isFullscreen={isFullscreen}
          onToggleFullscreen={onToggleFullscreen}
        />
        {showCommandLine && (
          <CommandInput
            panelId={panel.id}
            isActive={isActive}
            updatePanel={updatePanel}
            setStatusMessage={setStatusMessage}
          />
        )}
        {renderQuoteBar()}
        <PanelContent>
          {content || (
            <ErrorMessage>
              <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>⚠️ RENDER ERROR</div>
              <div>Content failed to render. Please try again.</div>
            </ErrorMessage>
          )}
        </PanelContent>
      </PanelContainer>
    );
  } catch (error: any) {
    console.error('Panel render error:', error);
    return (
      <PanelContainer $isActive={isActive} onClick={onClick}>
        <PanelContent>
          <ErrorMessage>
            <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>⚠️ CRITICAL ERROR</div>
            <div>Panel failed to render: {error.message}</div>
          </ErrorMessage>
        </PanelContent>
      </PanelContainer>
    );
  }
};

export default Panel;
