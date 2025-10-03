import { useState } from 'react';
import styled from 'styled-components';
import { exportWatchlist } from '../../utils/exportUtils';

const Container = styled.div`
  padding: 10px;
  color: #00ff00;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Header = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #00ffff;
  padding-bottom: 10px;
  border-bottom: 1px solid #333333;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FilterSection = styled.div`
  background: #0a0a0a;
  padding: 15px;
  border: 1px solid #333333;
  border-radius: 4px;
`;

const FilterTitle = styled.div`
  font-size: 12px;
  font-weight: bold;
  color: #ffff00;
  margin-bottom: 10px;
  text-transform: uppercase;
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const FilterLabel = styled.label`
  font-size: 10px;
  color: #666666;
  text-transform: uppercase;
`;

const FilterInput = styled.input`
  padding: 6px 8px;
  background: #000000;
  border: 1px solid #00ff00;
  color: #00ff00;
  font-family: 'Courier New', monospace;
  font-size: 11px;

  &:focus {
    outline: none;
    border-color: #00ffff;
  }
`;

const FilterSelect = styled.select`
  padding: 6px 8px;
  background: #000000;
  border: 1px solid #00ff00;
  color: #00ff00;
  font-family: 'Courier New', monospace;
  font-size: 11px;

  &:focus {
    outline: none;
    border-color: #00ffff;
  }

  option {
    background: #000000;
    color: #00ff00;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  font-size: 11px;
  font-family: 'Courier New', monospace;
  background: ${props => props.variant === 'primary' ? '#00ff00' : '#1a1a1a'};
  color: ${props => props.variant === 'primary' ? '#000000' : '#00ff00'};
  border: 1px solid #00ff00;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #00ff00;
    color: #000000;
  }
`;

const ResultsSection = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #333333;
`;

const ResultCount = styled.div`
  font-size: 11px;
  color: #666666;
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
`;

const Thead = styled.thead`
  background-color: #0a0a0a;
  position: sticky;
  top: 0;
  z-index: 1;
`;

const Th = styled.th<{ sortable?: boolean }>`
  text-align: left;
  padding: 8px;
  color: #ffff00;
  font-weight: bold;
  border-bottom: 2px solid #00ff00;
  cursor: ${props => props.sortable ? 'pointer' : 'default'};
  user-select: none;

  &:hover {
    ${props => props.sortable && 'background-color: #1a1a1a;'}
  }

  &:nth-child(3),
  &:nth-child(4),
  &:nth-child(5),
  &:nth-child(6),
  &:nth-child(7) {
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

const Td = styled.td<{ $align?: string; $color?: string }>`
  padding: 8px;
  color: ${props => props.$color || '#00ff00'};
  text-align: ${props => props.$align || 'left'};
`;

const Ticker = styled.span`
  font-weight: bold;
  color: #00ffff;
`;

const NoData = styled.div`
  color: #666666;
  font-style: italic;
  padding: 40px;
  text-align: center;
`;

interface EQSFunctionProps {
  data: any;
}

const EQSFunction = ({ data }: EQSFunctionProps) => {
  const [minMarketCap, setMinMarketCap] = useState('');
  const [maxMarketCap, setMaxMarketCap] = useState('');
  const [minPE, setMinPE] = useState('');
  const [maxPE, setMaxPE] = useState('');
  const [sector, setSector] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('marketCap');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const results = data?.results || [];

  const formatNumber = (num: number): string => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  const formatVolume = (vol: number): string => {
    if (vol >= 1e6) return `${(vol / 1e6).toFixed(1)}M`;
    if (vol >= 1e3) return `${(vol / 1e3).toFixed(1)}K`;
    return vol.toString();
  };

  const handleFilter = () => {
    // In a real implementation, this would trigger a new API call
    console.log('Filtering with:', {
      minMarketCap,
      maxMarketCap,
      minPE,
      maxPE,
      sector,
      minPrice,
      maxPrice,
      sortBy,
      sortDirection,
    });
  };

  const handleReset = () => {
    setMinMarketCap('');
    setMaxMarketCap('');
    setMinPE('');
    setMaxPE('');
    setSector('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('marketCap');
    setSortDirection('desc');
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
  };

  const handleExport = () => {
    const exportData = results.map((r: any) => ({
      ticker: r.ticker,
      name: r.name,
      price: r.price,
      change: r.change,
      changePercent: r.changePercent,
      volume: r.volume,
    }));
    exportWatchlist(exportData);
  };

  return (
    <Container>
      <Header>
        Equity Screener
      </Header>

      <FilterSection>
        <FilterTitle>Filter Criteria</FilterTitle>
        <FilterGrid>
          <FilterGroup>
            <FilterLabel>Min Market Cap</FilterLabel>
            <FilterInput
              type="number"
              value={minMarketCap}
              onChange={(e) => setMinMarketCap(e.target.value)}
              placeholder="e.g., 1000000000"
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Max Market Cap</FilterLabel>
            <FilterInput
              type="number"
              value={maxMarketCap}
              onChange={(e) => setMaxMarketCap(e.target.value)}
              placeholder="e.g., 5000000000000"
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Min P/E Ratio</FilterLabel>
            <FilterInput
              type="number"
              value={minPE}
              onChange={(e) => setMinPE(e.target.value)}
              placeholder="e.g., 10"
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Max P/E Ratio</FilterLabel>
            <FilterInput
              type="number"
              value={maxPE}
              onChange={(e) => setMaxPE(e.target.value)}
              placeholder="e.g., 50"
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Sector</FilterLabel>
            <FilterSelect value={sector} onChange={(e) => setSector(e.target.value)}>
              <option value="">All Sectors</option>
              <option value="Technology">Technology</option>
              <option value="Financial Services">Financial Services</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Consumer Cyclical">Consumer Cyclical</option>
              <option value="Consumer Defensive">Consumer Defensive</option>
              <option value="Industrials">Industrials</option>
              <option value="Communication Services">Communication Services</option>
              <option value="Energy">Energy</option>
              <option value="Utilities">Utilities</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Min Price</FilterLabel>
            <FilterInput
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="e.g., 50"
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Max Price</FilterLabel>
            <FilterInput
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="e.g., 500"
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Sort By</FilterLabel>
            <FilterSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="ticker">Ticker</option>
              <option value="price">Price</option>
              <option value="changePercent">Change %</option>
              <option value="marketCap">Market Cap</option>
              <option value="peRatio">P/E Ratio</option>
              <option value="volume">Volume</option>
            </FilterSelect>
          </FilterGroup>
        </FilterGrid>

        <ButtonGroup>
          <Button variant="primary" onClick={handleFilter}>
            APPLY FILTERS
          </Button>
          <Button variant="secondary" onClick={handleReset}>
            RESET
          </Button>
        </ButtonGroup>
      </FilterSection>

      <ResultsSection>
        <ResultsHeader>
          <ResultCount>
            {results.length} {results.length === 1 ? 'result' : 'results'} found
          </ResultCount>
          {results.length > 0 && (
            <ExportButton onClick={handleExport}>
              EXPORT CSV
            </ExportButton>
          )}
        </ResultsHeader>

        {results.length === 0 ? (
          <NoData>No results found. Adjust filters or click APPLY FILTERS to screen equities.</NoData>
        ) : (
          <Table>
            <Thead>
              <Tr>
                <Th sortable onClick={() => handleSort('ticker')}>
                  Ticker {sortBy === 'ticker' && (sortDirection === 'asc' ? '▲' : '▼')}
                </Th>
                <Th sortable onClick={() => handleSort('name')}>
                  Name {sortBy === 'name' && (sortDirection === 'asc' ? '▲' : '▼')}
                </Th>
                <Th sortable onClick={() => handleSort('price')}>
                  Price {sortBy === 'price' && (sortDirection === 'asc' ? '▲' : '▼')}
                </Th>
                <Th sortable onClick={() => handleSort('changePercent')}>
                  Change {sortBy === 'changePercent' && (sortDirection === 'asc' ? '▲' : '▼')}
                </Th>
                <Th sortable onClick={() => handleSort('marketCap')}>
                  Market Cap {sortBy === 'marketCap' && (sortDirection === 'asc' ? '▲' : '▼')}
                </Th>
                <Th sortable onClick={() => handleSort('peRatio')}>
                  P/E {sortBy === 'peRatio' && (sortDirection === 'asc' ? '▲' : '▼')}
                </Th>
                <Th sortable onClick={() => handleSort('sector')}>
                  Sector {sortBy === 'sector' && (sortDirection === 'asc' ? '▲' : '▼')}
                </Th>
                <Th sortable onClick={() => handleSort('volume')}>
                  Volume {sortBy === 'volume' && (sortDirection === 'asc' ? '▲' : '▼')}
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {results.map((result: any) => (
                <Tr key={result.ticker}>
                  <Td>
                    <Ticker>{result.ticker}</Ticker>
                  </Td>
                  <Td>{result.name}</Td>
                  <Td $align="right">${result.price.toFixed(2)}</Td>
                  <Td 
                    $align="right" 
                    $color={result.changePercent >= 0 ? '#00ff00' : '#ff0000'}
                  >
                    {result.changePercent >= 0 ? '+' : ''}{result.changePercent.toFixed(2)}%
                  </Td>
                  <Td $align="right">{formatNumber(result.marketCap)}</Td>
                  <Td $align="right">{result.peRatio.toFixed(2)}</Td>
                  <Td>{result.sector}</Td>
                  <Td $align="right">{formatVolume(result.volume)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </ResultsSection>
    </Container>
  );
};

export default EQSFunction;
