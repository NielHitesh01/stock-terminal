import { useState } from 'react';
import styled from 'styled-components';
import { exportWatchlist } from '../../utils/exportUtils';

const Container = styled.div`
  padding: 10px;
  color: #00ff00;
  height: 100%;
  overflow-y: auto;
`;

const Header = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #00ffff;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #333333;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ExportButton = styled.button`
  padding: 5px 12px;
  font-size: 10px;
  font-family: 'Courier New', monospace;
  background: #1a1a1a;
  color: #00ffff;
  border: 1px solid #00ffff;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #00ffff;
    color: #000000;
  }
`;

const LastUpdate = styled.span`
  font-size: 10px;
  color: #666666;
  font-weight: normal;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
`;

const Thead = styled.thead`
  background-color: #0a0a0a;
  position: sticky;
  top: 0;
  z-index: 1;
`;

const Th = styled.th`
  text-align: left;
  padding: 10px;
  color: #ffff00;
  font-weight: bold;
  border-bottom: 2px solid #00ff00;
  
  &:nth-child(3),
  &:nth-child(4),
  &:nth-child(5) {
    text-align: right;
  }
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  border-bottom: 1px solid #1a1a1a;
  cursor: pointer;
  
  &:hover {
    background-color: #0a0a0a;
  }
`;

const Td = styled.td<{ $align?: string }>`
  padding: 10px;
  color: #00ff00;
  text-align: ${props => props.$align || 'left'};
`;

const Ticker = styled.div`
  font-weight: bold;
  color: #00ffff;
  font-size: 13px;
`;

const CompanyName = styled.div`
  font-size: 10px;
  color: #666666;
  margin-top: 2px;
`;

const Price = styled.div`
  font-size: 13px;
  font-weight: bold;
`;

const Change = styled.div<{ $positive: boolean }>`
  color: ${props => props.$positive ? '#00ff00' : '#ff0000'};
  font-size: 12px;
  font-weight: bold;
`;

const ChangePercent = styled.span<{ $positive: boolean }>`
  color: ${props => props.$positive ? '#00ff00' : '#ff0000'};
  font-size: 11px;
  margin-left: 5px;
`;

const ActionButton = styled.button`
  background: transparent;
  border: 1px solid #ff0000;
  color: #ff0000;
  padding: 4px 8px;
  font-size: 10px;
  font-family: 'Courier New', monospace;
  cursor: pointer;
  
  &:hover {
    background-color: #ff0000;
    color: #000000;
  }
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #666666;
  flex-direction: column;
  gap: 10px;
`;

const AddTickerSection = styled.div`
  margin-top: 15px;
  padding: 15px;
  background-color: #0a0a0a;
  border: 1px solid #333333;
  display: flex;
  gap: 10px;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  background-color: #000000;
  border: 1px solid #00ff00;
  color: #00ff00;
  padding: 8px 12px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  outline: none;
  text-transform: uppercase;
  
  &:focus {
    border-color: #00ffff;
    box-shadow: 0 0 5px #00ff00;
  }
  
  &::placeholder {
    color: #666666;
    text-transform: none;
  }
`;

const AddButton = styled.button`
  background-color: #00ff00;
  border: 1px solid #00ff00;
  color: #000000;
  padding: 8px 16px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  
  &:hover {
    background-color: #00ffff;
    border-color: #00ffff;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const NoData = styled.div`
  color: #666666;
  font-style: italic;
  padding: 20px;
  text-align: center;
`;

interface WFunctionProps {
  data: any;
}

const WFunction = ({ data }: WFunctionProps) => {
  const [newTicker, setNewTicker] = useState('');

  if (!data) {
    return <NoData>No watchlist data available</NoData>;
  }

  const items = data.items || [];
  const lastUpdate = data.lastUpdate ? new Date(data.lastUpdate).toLocaleTimeString() : '';

  const handleAddTicker = async () => {
    if (!newTicker.trim()) return;
    
    // TODO: Implement API call to add ticker
    console.log('Adding ticker:', newTicker);
    setNewTicker('');
    
    // Would need to refresh the watchlist data here
  };

  const handleRemoveTicker = async (ticker: string) => {
    // TODO: Implement API call to remove ticker
    console.log('Removing ticker:', ticker);
    
    // Would need to refresh the watchlist data here
  };

  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
  };

  const formatChange = (change: number): string => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}`;
  };

  const formatPercent = (percent: number): string => {
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
  };

  const handleExport = () => {
    exportWatchlist(items);
  };

  return (
    <Container>
      <Header>
        {data.name || 'Watchlist'}
        <HeaderActions>
          {items.length > 0 && (
            <ExportButton onClick={handleExport}>
              EXPORT CSV
            </ExportButton>
          )}
          <LastUpdate>Updated: {lastUpdate}</LastUpdate>
        </HeaderActions>
      </Header>

      {items.length === 0 ? (
        <EmptyState>
          <div style={{ fontSize: '14px' }}>No tickers in watchlist</div>
          <div style={{ fontSize: '11px' }}>Add tickers using the form below</div>
        </EmptyState>
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Ticker</Th>
              <Th>Company</Th>
              <Th>Price</Th>
              <Th>Change</Th>
              <Th>% Change</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map((item: any) => {
              const isPositive = (item.change || 0) >= 0;
              return (
                <Tr key={item.ticker}>
                  <Td>
                    <Ticker>{item.ticker}</Ticker>
                  </Td>
                  <Td>
                    <CompanyName>{item.name}</CompanyName>
                  </Td>
                  <Td $align="right">
                    <Price>{formatPrice(item.price)}</Price>
                  </Td>
                  <Td $align="right">
                    <Change $positive={isPositive}>
                      {formatChange(item.change)}
                    </Change>
                  </Td>
                  <Td $align="right">
                    <ChangePercent $positive={isPositive}>
                      {formatPercent(item.changePercent)}
                    </ChangePercent>
                  </Td>
                  <Td $align="right">
                    <ActionButton onClick={() => handleRemoveTicker(item.ticker)}>
                      Remove
                    </ActionButton>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      )}

      <AddTickerSection>
        <Input
          type="text"
          value={newTicker}
          onChange={(e) => setNewTicker(e.target.value.toUpperCase())}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTicker()}
          placeholder="Enter ticker symbol (e.g., AAPL)"
          maxLength={5}
        />
        <AddButton onClick={handleAddTicker} disabled={!newTicker.trim()}>
          Add to Watchlist
        </AddButton>
      </AddTickerSection>
    </Container>
  );
};

export default WFunction;
