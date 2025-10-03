import { useState, useEffect } from 'react';
import styled from 'styled-components';

interface Stock {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  volume: number;
}

interface Sector {
  id: string;
  name: string;
  performance: number;
  dayChange: number;
  marketCap: number;
  stocks: Stock[];
  topStocks: string[];
  avgVolume: number;
}

const SectorHeatmap = () => {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [sortBy, setSortBy] = useState<'performance' | 'marketCap' | 'volume'>('performance');
  const [viewMode, setViewMode] = useState<'heatmap' | 'list'>('heatmap');

  useEffect(() => {
    // Generate mock sector data
    const mockSectors: Sector[] = [
      {
        id: 'tech',
        name: 'Technology',
        performance: 2.45,
        dayChange: 1.87,
        marketCap: 12500000000000,
        topStocks: ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'META'],
        avgVolume: 285000000,
        stocks: []
      },
      {
        id: 'health',
        name: 'Healthcare',
        performance: 0.85,
        dayChange: 0.42,
        marketCap: 6200000000000,
        topStocks: ['UNH', 'JNJ', 'LLY', 'ABBV', 'MRK'],
        avgVolume: 95000000,
        stocks: []
      },
      {
        id: 'financial',
        name: 'Financial',
        performance: -0.67,
        dayChange: -0.34,
        marketCap: 8900000000000,
        topStocks: ['JPM', 'BAC', 'WFC', 'GS', 'MS'],
        avgVolume: 125000000,
        stocks: []
      },
      {
        id: 'consumer-disc',
        name: 'Consumer Discretionary',
        performance: 1.23,
        dayChange: 0.98,
        marketCap: 4800000000000,
        topStocks: ['AMZN', 'TSLA', 'HD', 'MCD', 'NKE'],
        avgVolume: 178000000,
        stocks: []
      },
      {
        id: 'communication',
        name: 'Communication Services',
        performance: 1.56,
        dayChange: 1.12,
        marketCap: 3900000000000,
        topStocks: ['GOOGL', 'META', 'NFLX', 'DIS', 'CMCSA'],
        avgVolume: 142000000,
        stocks: []
      },
      {
        id: 'industrial',
        name: 'Industrials',
        performance: -0.34,
        dayChange: -0.21,
        marketCap: 5100000000000,
        topStocks: ['CAT', 'UPS', 'HON', 'BA', 'GE'],
        avgVolume: 87000000,
        stocks: []
      },
      {
        id: 'consumer-staples',
        name: 'Consumer Staples',
        performance: -0.12,
        dayChange: 0.08,
        marketCap: 3600000000000,
        topStocks: ['WMT', 'PG', 'KO', 'PEP', 'COST'],
        avgVolume: 76000000,
        stocks: []
      },
      {
        id: 'energy',
        name: 'Energy',
        performance: -1.89,
        dayChange: -1.45,
        marketCap: 4200000000000,
        topStocks: ['XOM', 'CVX', 'COP', 'SLB', 'EOG'],
        avgVolume: 98000000,
        stocks: []
      },
      {
        id: 'utilities',
        name: 'Utilities',
        performance: 0.23,
        dayChange: 0.15,
        marketCap: 1800000000000,
        topStocks: ['NEE', 'DUK', 'SO', 'D', 'AEP'],
        avgVolume: 45000000,
        stocks: []
      },
      {
        id: 'real-estate',
        name: 'Real Estate',
        performance: -0.45,
        dayChange: -0.28,
        marketCap: 1500000000000,
        topStocks: ['PLD', 'AMT', 'CCI', 'EQIX', 'PSA'],
        avgVolume: 52000000,
        stocks: []
      },
      {
        id: 'materials',
        name: 'Materials',
        performance: 0.67,
        dayChange: 0.43,
        marketCap: 2300000000000,
        topStocks: ['LIN', 'APD', 'SHW', 'ECL', 'NEM'],
        avgVolume: 63000000,
        stocks: []
      }
    ];

    // Generate detailed stock data for each sector
    mockSectors.forEach(sector => {
      sector.stocks = sector.topStocks.map((ticker) => ({
        ticker,
        name: `${ticker} Inc.`,
        price: 100 + Math.random() * 400,
        change: (Math.random() - 0.5) * 20,
        changePercent: sector.performance + (Math.random() - 0.5) * 2,
        marketCap: sector.marketCap / sector.topStocks.length * (1 + (Math.random() - 0.5) * 0.3),
        volume: Math.floor(Math.random() * 50000000)
      }));
    });

    setSectors(mockSectors);

    // Update real-time
    const interval = setInterval(() => {
      setSectors(prev => prev.map(sector => ({
        ...sector,
        performance: sector.performance + (Math.random() - 0.5) * 0.1,
        dayChange: sector.dayChange + (Math.random() - 0.5) * 0.05,
        stocks: sector.stocks.map(stock => ({
          ...stock,
          price: stock.price + (Math.random() - 0.5) * 2,
          change: stock.change + (Math.random() - 0.5) * 0.5,
          changePercent: stock.changePercent + (Math.random() - 0.5) * 0.1
        }))
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getPerformanceColor = (performance: number): string => {
    if (performance >= 2) return '#00ff00';
    if (performance >= 1) return '#66ff66';
    if (performance >= 0.5) return '#99ff99';
    if (performance >= 0) return '#ccffcc';
    if (performance >= -0.5) return '#ffcccc';
    if (performance >= -1) return '#ff9999';
    if (performance >= -2) return '#ff6666';
    return '#ff0000';
  };

  const getTextColor = (performance: number): string => {
    return Math.abs(performance) > 1 ? '#000000' : '#ffffff';
  };

  const formatMarketCap = (cap: number): string => {
    if (cap >= 1000000000000) return `$${(cap / 1000000000000).toFixed(2)}T`;
    if (cap >= 1000000000) return `$${(cap / 1000000000).toFixed(2)}B`;
    return `$${(cap / 1000000).toFixed(2)}M`;
  };

  const formatVolume = (vol: number): string => {
    if (vol >= 1000000000) return `${(vol / 1000000000).toFixed(2)}B`;
    if (vol >= 1000000) return `${(vol / 1000000).toFixed(2)}M`;
    return `${(vol / 1000).toFixed(2)}K`;
  };

  const sortedSectors = [...sectors].sort((a, b) => {
    switch (sortBy) {
      case 'performance':
        return b.performance - a.performance;
      case 'marketCap':
        return b.marketCap - a.marketCap;
      case 'volume':
        return b.avgVolume - a.avgVolume;
      default:
        return 0;
    }
  });

  const handleSectorClick = (sector: Sector) => {
    setSelectedSector(selectedSector?.id === sector.id ? null : sector);
  };

  const handleCloseDrilldown = () => {
    setSelectedSector(null);
  };

  return (
    <Container>
      <Header>
        <Title>SECTOR HEATMAP</Title>
        <Controls>
          <ViewToggle>
            <ViewButton 
              $active={viewMode === 'heatmap'} 
              onClick={() => setViewMode('heatmap')}
            >
              HEATMAP
            </ViewButton>
            <ViewButton 
              $active={viewMode === 'list'} 
              onClick={() => setViewMode('list')}
            >
              LIST
            </ViewButton>
          </ViewToggle>
          <SortDropdown value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
            <option value="performance">Sort by Performance</option>
            <option value="marketCap">Sort by Market Cap</option>
            <option value="volume">Sort by Volume</option>
          </SortDropdown>
        </Controls>
      </Header>

      <Stats>
        <StatItem>
          <StatLabel>SECTORS POSITIVE</StatLabel>
          <StatValue $positive={true}>
            {sectors.filter(s => s.performance > 0).length} / {sectors.length}
          </StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>AVG PERFORMANCE</StatLabel>
          <StatValue $positive={sectors.reduce((sum, s) => sum + s.performance, 0) / sectors.length > 0}>
            {(sectors.reduce((sum, s) => sum + s.performance, 0) / sectors.length).toFixed(2)}%
          </StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>TOTAL MARKET CAP</StatLabel>
          <StatValue>
            {formatMarketCap(sectors.reduce((sum, s) => sum + s.marketCap, 0))}
          </StatValue>
        </StatItem>
      </Stats>

      {viewMode === 'heatmap' ? (
        <HeatmapGrid>
          {sortedSectors.map(sector => (
            <HeatmapTile
              key={sector.id}
              $performance={sector.performance}
              $color={getPerformanceColor(sector.performance)}
              $textColor={getTextColor(sector.performance)}
              $size={sector.marketCap}
              onClick={() => handleSectorClick(sector)}
            >
              <TileName>{sector.name}</TileName>
              <TilePerformance $positive={sector.performance >= 0}>
                {sector.performance >= 0 ? '+' : ''}{sector.performance.toFixed(2)}%
              </TilePerformance>
              <TileDetails>
                <TileDetail>
                  <TileDetailLabel>Market Cap:</TileDetailLabel>
                  <TileDetailValue>{formatMarketCap(sector.marketCap)}</TileDetailValue>
                </TileDetail>
                <TileDetail>
                  <TileDetailLabel>Day Change:</TileDetailLabel>
                  <TileDetailValue $positive={sector.dayChange >= 0}>
                    {sector.dayChange >= 0 ? '+' : ''}{sector.dayChange.toFixed(2)}%
                  </TileDetailValue>
                </TileDetail>
                <TileDetail>
                  <TileDetailLabel>Avg Volume:</TileDetailLabel>
                  <TileDetailValue>{formatVolume(sector.avgVolume)}</TileDetailValue>
                </TileDetail>
              </TileDetails>
              <TopStocks>
                {sector.topStocks.slice(0, 3).map(ticker => (
                  <StockTag key={ticker}>{ticker}</StockTag>
                ))}
              </TopStocks>
            </HeatmapTile>
          ))}
        </HeatmapGrid>
      ) : (
        <ListView>
          <ListHeader>
            <ListHeaderCell width="25%">SECTOR</ListHeaderCell>
            <ListHeaderCell width="15%">PERFORMANCE</ListHeaderCell>
            <ListHeaderCell width="15%">DAY CHANGE</ListHeaderCell>
            <ListHeaderCell width="20%">MARKET CAP</ListHeaderCell>
            <ListHeaderCell width="15%">AVG VOLUME</ListHeaderCell>
            <ListHeaderCell width="10%">ACTION</ListHeaderCell>
          </ListHeader>
          <ListBody>
            {sortedSectors.map(sector => (
              <ListRow key={sector.id} onClick={() => handleSectorClick(sector)}>
                <ListCell width="25%">
                  <SectorName>{sector.name}</SectorName>
                  <TopStocksList>
                    {sector.topStocks.slice(0, 5).join(', ')}
                  </TopStocksList>
                </ListCell>
                <ListCell width="15%">
                  <PerformanceValue $positive={sector.performance >= 0}>
                    {sector.performance >= 0 ? '+' : ''}{sector.performance.toFixed(2)}%
                  </PerformanceValue>
                </ListCell>
                <ListCell width="15%">
                  <PerformanceValue $positive={sector.dayChange >= 0}>
                    {sector.dayChange >= 0 ? '+' : ''}{sector.dayChange.toFixed(2)}%
                  </PerformanceValue>
                </ListCell>
                <ListCell width="20%">
                  {formatMarketCap(sector.marketCap)}
                </ListCell>
                <ListCell width="15%">
                  {formatVolume(sector.avgVolume)}
                </ListCell>
                <ListCell width="10%">
                  <DrillButton>VIEW</DrillButton>
                </ListCell>
              </ListRow>
            ))}
          </ListBody>
        </ListView>
      )}

      {selectedSector && (
        <DrilldownOverlay onClick={handleCloseDrilldown}>
          <DrilldownPanel onClick={(e) => e.stopPropagation()}>
            <DrilldownHeader>
              <DrilldownTitle>
                {selectedSector.name}
                <PerformanceBadge $positive={selectedSector.performance >= 0}>
                  {selectedSector.performance >= 0 ? '+' : ''}{selectedSector.performance.toFixed(2)}%
                </PerformanceBadge>
              </DrilldownTitle>
              <CloseButton onClick={handleCloseDrilldown}>CLOSE</CloseButton>
            </DrilldownHeader>

            <DrilldownStats>
              <DrilldownStatItem>
                <DrilldownStatLabel>Market Cap</DrilldownStatLabel>
                <DrilldownStatValue>{formatMarketCap(selectedSector.marketCap)}</DrilldownStatValue>
              </DrilldownStatItem>
              <DrilldownStatItem>
                <DrilldownStatLabel>Day Change</DrilldownStatLabel>
                <DrilldownStatValue $positive={selectedSector.dayChange >= 0}>
                  {selectedSector.dayChange >= 0 ? '+' : ''}{selectedSector.dayChange.toFixed(2)}%
                </DrilldownStatValue>
              </DrilldownStatItem>
              <DrilldownStatItem>
                <DrilldownStatLabel>Avg Volume</DrilldownStatLabel>
                <DrilldownStatValue>{formatVolume(selectedSector.avgVolume)}</DrilldownStatValue>
              </DrilldownStatItem>
            </DrilldownStats>

            <DrilldownSubtitle>TOP HOLDINGS</DrilldownSubtitle>
            <StockTable>
              <StockTableHeader>
                <StockTableHeaderCell width="20%">TICKER</StockTableHeaderCell>
                <StockTableHeaderCell width="15%">PRICE</StockTableHeaderCell>
                <StockTableHeaderCell width="15%">CHANGE</StockTableHeaderCell>
                <StockTableHeaderCell width="15%">CHANGE %</StockTableHeaderCell>
                <StockTableHeaderCell width="20%">MARKET CAP</StockTableHeaderCell>
                <StockTableHeaderCell width="15%">VOLUME</StockTableHeaderCell>
              </StockTableHeader>
              <StockTableBody>
                {selectedSector.stocks.map(stock => (
                  <StockTableRow key={stock.ticker}>
                    <StockTableCell width="20%">
                      <StockTicker>{stock.ticker}</StockTicker>
                      <StockName>{stock.name}</StockName>
                    </StockTableCell>
                    <StockTableCell width="15%">
                      ${stock.price.toFixed(2)}
                    </StockTableCell>
                    <StockTableCell width="15%">
                      <StockChange $positive={stock.change >= 0}>
                        {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                      </StockChange>
                    </StockTableCell>
                    <StockTableCell width="15%">
                      <StockChange $positive={stock.changePercent >= 0}>
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </StockChange>
                    </StockTableCell>
                    <StockTableCell width="20%">
                      {formatMarketCap(stock.marketCap)}
                    </StockTableCell>
                    <StockTableCell width="15%">
                      {formatVolume(stock.volume)}
                    </StockTableCell>
                  </StockTableRow>
                ))}
              </StockTableBody>
            </StockTable>
          </DrilldownPanel>
        </DrilldownOverlay>
      )}
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #000000;
  color: #00ff00;
  font-family: 'Courier New', monospace;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #0a0a0a;
  border-bottom: 1px solid #00ff00;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 2px;
`;

const Controls = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 5px;
  background: #0a0a0a;
  border: 1px solid #00ff00;
  border-radius: 3px;
  overflow: hidden;
`;

const ViewButton = styled.button<{ $active: boolean }>`
  padding: 6px 15px;
  background: ${props => props.$active ? '#00ff00' : 'transparent'};
  color: ${props => props.$active ? '#000000' : '#00ff00'};
  border: none;
  font-size: 11px;
  font-weight: bold;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$active ? '#00ff00' : '#003300'};
  }
`;

const SortDropdown = styled.select`
  padding: 6px 12px;
  background: #0a0a0a;
  color: #00ff00;
  border: 1px solid #00ff00;
  border-radius: 3px;
  font-size: 11px;
  font-family: 'Courier New', monospace;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #00ff00;
    box-shadow: 0 0 5px #00ff00;
  }

  option {
    background: #0a0a0a;
    color: #00ff00;
  }
`;

const Stats = styled.div`
  display: flex;
  gap: 30px;
  padding: 15px 20px;
  background: #050505;
  border-bottom: 1px solid #00ff00;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const StatLabel = styled.div`
  font-size: 10px;
  color: #888888;
  letter-spacing: 1px;
`;

const StatValue = styled.div<{ $positive?: boolean }>`
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.$positive !== undefined ? (props.$positive ? '#00ff00' : '#ff0000') : '#00ff00'};
`;

const HeatmapGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  padding: 20px;
  overflow-y: auto;
  flex: 1;
`;

const HeatmapTile = styled.div<{ $performance: number; $color: string; $textColor: string; $size: number }>`
  background: ${props => props.$color};
  color: ${props => props.$textColor};
  padding: 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 180px;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 20px ${props => props.$color};
    z-index: 10;
  }

  &:hover > div:last-child {
    opacity: 1;
  }
`;

const TileName = styled.div`
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 1px;
`;

const TilePerformance = styled.div<{ $positive: boolean }>`
  font-size: 28px;
  font-weight: bold;
`;

const TileDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 11px;
  margin-top: auto;
`;

const TileDetail = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TileDetailLabel = styled.span`
  opacity: 0.8;
`;

const TileDetailValue = styled.span<{ $positive?: boolean }>`
  font-weight: bold;
  color: ${props => props.$positive !== undefined ? (props.$positive ? '#000000' : '#000000') : 'inherit'};
`;

const TopStocks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 5px;
`;

const StockTag = styled.span`
  padding: 2px 6px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  font-size: 9px;
  font-weight: bold;
`;

const ListView = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;

const ListHeader = styled.div`
  display: flex;
  padding: 12px 20px;
  background: #0a0a0a;
  border-bottom: 1px solid #00ff00;
  font-size: 11px;
  font-weight: bold;
  letter-spacing: 1px;
`;

const ListHeaderCell = styled.div<{ width: string }>`
  width: ${props => props.width};
`;

const ListBody = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const ListRow = styled.div`
  display: flex;
  padding: 15px 20px;
  border-bottom: 1px solid #003300;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #001100;
  }
`;

const ListCell = styled.div<{ width: string }>`
  width: ${props => props.width};
  display: flex;
  align-items: center;
  font-size: 12px;
`;

const SectorName = styled.div`
  font-weight: bold;
  margin-bottom: 3px;
`;

const TopStocksList = styled.div`
  font-size: 10px;
  color: #888888;
`;

const PerformanceValue = styled.div<{ $positive: boolean }>`
  color: ${props => props.$positive ? '#00ff00' : '#ff0000'};
  font-weight: bold;
`;

const DrillButton = styled.button`
  padding: 4px 12px;
  background: transparent;
  color: #00ff00;
  border: 1px solid #00ff00;
  border-radius: 3px;
  font-size: 10px;
  font-weight: bold;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  transition: all 0.2s;

  &:hover {
    background: #00ff00;
    color: #000000;
  }
`;

const DrilldownOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const DrilldownPanel = styled.div`
  background: #000000;
  border: 2px solid #00ff00;
  border-radius: 5px;
  width: 90%;
  max-width: 1000px;
  max-height: 80%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const DrilldownHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #0a0a0a;
  border-bottom: 1px solid #00ff00;
`;

const DrilldownTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  gap: 15px;
`;

const PerformanceBadge = styled.span<{ $positive: boolean }>`
  padding: 4px 12px;
  background: ${props => props.$positive ? '#00ff00' : '#ff0000'};
  color: #000000;
  border-radius: 3px;
  font-size: 14px;
`;

const CloseButton = styled.button`
  padding: 8px 20px;
  background: transparent;
  color: #00ff00;
  border: 1px solid #00ff00;
  border-radius: 3px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  transition: all 0.2s;

  &:hover {
    background: #ff0000;
    border-color: #ff0000;
    color: #ffffff;
  }
`;

const DrilldownStats = styled.div`
  display: flex;
  gap: 40px;
  padding: 20px;
  background: #050505;
  border-bottom: 1px solid #003300;
`;

const DrilldownStatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const DrilldownStatLabel = styled.div`
  font-size: 11px;
  color: #888888;
  letter-spacing: 1px;
`;

const DrilldownStatValue = styled.div<{ $positive?: boolean }>`
  font-size: 18px;
  font-weight: bold;
  color: ${props => props.$positive !== undefined ? (props.$positive ? '#00ff00' : '#ff0000') : '#00ff00'};
`;

const DrilldownSubtitle = styled.div`
  padding: 15px 20px;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 1px;
  background: #0a0a0a;
  border-bottom: 1px solid #003300;
`;

const StockTable = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const StockTableHeader = styled.div`
  display: flex;
  padding: 12px 20px;
  background: #0a0a0a;
  border-bottom: 1px solid #00ff00;
  font-size: 11px;
  font-weight: bold;
  letter-spacing: 1px;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const StockTableHeaderCell = styled.div<{ width: string }>`
  width: ${props => props.width};
`;

const StockTableBody = styled.div`
  flex: 1;
`;

const StockTableRow = styled.div`
  display: flex;
  padding: 15px 20px;
  border-bottom: 1px solid #003300;
  transition: background 0.2s;

  &:hover {
    background: #001100;
  }
`;

const StockTableCell = styled.div<{ width: string }>`
  width: ${props => props.width};
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 12px;
`;

const StockTicker = styled.div`
  font-weight: bold;
  margin-bottom: 2px;
`;

const StockName = styled.div`
  font-size: 10px;
  color: #888888;
`;

const StockChange = styled.span<{ $positive: boolean }>`
  color: ${props => props.$positive ? '#00ff00' : '#ff0000'};
  font-weight: bold;
`;

export default SectorHeatmap;
