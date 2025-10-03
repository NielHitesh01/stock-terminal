/**
 * Options Chain Function Component
 * 
 * Displays options chain with calls, puts, Greeks, and advanced filtering.
 * Professional Bloomberg-style options data display.
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { OptionsChain, OptionContract } from '@shared/types';

interface OptionsChainFunctionProps {
  ticker: string;
}

const OptionsChainFunction: React.FC<OptionsChainFunctionProps> = ({ ticker }) => {
  const [optionsData, setOptionsData] = useState<OptionsChain | null>(null);
  const [selectedExpiration, setSelectedExpiration] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [strikeFilter, setStrikeFilter] = useState<'ALL' | 'ITM' | 'ATM' | 'OTM'>('ALL');
  const [showGreeks, setShowGreeks] = useState(true);

  useEffect(() => {
    fetchOptionsData();
  }, [ticker]);

  const fetchOptionsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:3002/api/options/${ticker}`);
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch options data');
      }
      
      setOptionsData(result.data);
      if (result.data.expirations.length > 0) {
        setSelectedExpiration(result.data.expirations[0]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterContracts = (contracts: OptionContract[]): OptionContract[] => {
    if (!optionsData || strikeFilter === 'ALL') return contracts;
    
    const spotPrice = optionsData.underlyingPrice;
    
    return contracts.filter(contract => {
      if (strikeFilter === 'ITM') {
        return contract.inTheMoney;
      } else if (strikeFilter === 'OTM') {
        return !contract.inTheMoney;
      } else if (strikeFilter === 'ATM') {
        // ATM defined as within 5% of spot price
        const diff = Math.abs(contract.strike - spotPrice) / spotPrice;
        return diff <= 0.05;
      }
      return true;
    });
  };

  const getDeltaColor = (delta: number, _type: 'CALL' | 'PUT'): string => {
    const absDelta = Math.abs(delta);
    if (absDelta > 0.7) return '#00ff00'; // Deep ITM - bright green
    if (absDelta > 0.4) return '#88ff88'; // ATM - light green
    return '#444444'; // OTM - gray
  };

  const getIVColor = (iv: number): string => {
    if (iv > 60) return '#ff4444'; // High IV - red
    if (iv > 40) return '#ffaa00'; // Medium-high IV - orange
    if (iv > 25) return '#ffff00'; // Medium IV - yellow
    return '#88ff88'; // Low IV - green
  };

  if (loading) {
    return (
      <Container>
        <LoadingMessage>Loading options chain for {ticker}...</LoadingMessage>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>
          <ErrorTitle>Error Loading Options Data</ErrorTitle>
          <ErrorText>{error}</ErrorText>
          <RetryButton onClick={fetchOptionsData}>Retry</RetryButton>
        </ErrorMessage>
      </Container>
    );
  }

  if (!optionsData) {
    return (
      <Container>
        <ErrorMessage>No options data available for {ticker}</ErrorMessage>
      </Container>
    );
  }

  const currentChain = optionsData.chains[selectedExpiration];
  const filteredCalls = filterContracts(currentChain?.calls || []);
  const filteredPuts = filterContracts(currentChain?.puts || []);

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <Title>OPTIONS CHAIN</Title>
          <Ticker>{ticker}</Ticker>
          <SpotPrice>
            Underlying: <PriceValue>${optionsData.underlyingPrice.toFixed(2)}</PriceValue>
          </SpotPrice>
        </HeaderLeft>
        <HeaderRight>
          <UpdateTime>
            Updated: {new Date(optionsData.timestamp).toLocaleTimeString()}
          </UpdateTime>
        </HeaderRight>
      </Header>

      <Controls>
        <ControlGroup>
          <Label>Expiration:</Label>
          <Select
            value={selectedExpiration}
            onChange={(e) => setSelectedExpiration(e.target.value)}
          >
            {optionsData.expirations.map((exp: string) => {
              const date = new Date(exp);
              const daysToExp = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              return (
                <option key={exp} value={exp}>
                  {date.toLocaleDateString()} ({daysToExp}d)
                </option>
              );
            })}
          </Select>
        </ControlGroup>

        <ControlGroup>
          <Label>Strike Filter:</Label>
          <FilterButtons>
            <FilterButton
              $active={strikeFilter === 'ALL'}
              onClick={() => setStrikeFilter('ALL')}
            >
              All
            </FilterButton>
            <FilterButton
              $active={strikeFilter === 'ITM'}
              onClick={() => setStrikeFilter('ITM')}
            >
              ITM
            </FilterButton>
            <FilterButton
              $active={strikeFilter === 'ATM'}
              onClick={() => setStrikeFilter('ATM')}
            >
              ATM
            </FilterButton>
            <FilterButton
              $active={strikeFilter === 'OTM'}
              onClick={() => setStrikeFilter('OTM')}
            >
              OTM
            </FilterButton>
          </FilterButtons>
        </ControlGroup>

        <ControlGroup>
          <ToggleButton
            $active={showGreeks}
            onClick={() => setShowGreeks(!showGreeks)}
          >
            {showGreeks ? '✓' : ''} Show Greeks
          </ToggleButton>
        </ControlGroup>
      </Controls>

      <ChainContainer>
        {/* Calls Section */}
        <Section>
          <SectionHeader $type="CALL">CALLS</SectionHeader>
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <Th>Strike</Th>
                  <Th>Bid</Th>
                  <Th>Ask</Th>
                  <Th>Last</Th>
                  <Th>Vol</Th>
                  <Th>OI</Th>
                  <Th>IV</Th>
                  {showGreeks && (
                    <>
                      <Th>Δ</Th>
                      <Th>Γ</Th>
                      <Th>Θ</Th>
                      <Th>V</Th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredCalls.map((contract, idx) => (
                  <Tr key={idx} $inTheMoney={contract.inTheMoney}>
                    <Td $bold>{contract.strike.toFixed(2)}</Td>
                    <Td>{contract.bid.toFixed(2)}</Td>
                    <Td>{contract.ask.toFixed(2)}</Td>
                    <Td $bold>{contract.last.toFixed(2)}</Td>
                    <Td>{contract.volume.toLocaleString()}</Td>
                    <Td>{contract.openInterest.toLocaleString()}</Td>
                    <Td $color={getIVColor(contract.impliedVolatility)}>
                      {contract.impliedVolatility.toFixed(1)}%
                    </Td>
                    {showGreeks && (
                      <>
                        <Td $color={getDeltaColor(contract.greeks.delta, 'CALL')}>
                          {contract.greeks.delta.toFixed(3)}
                        </Td>
                        <Td>{contract.greeks.gamma.toFixed(4)}</Td>
                        <Td $color={contract.greeks.theta < 0 ? '#ff8888' : '#88ff88'}>
                          {contract.greeks.theta.toFixed(3)}
                        </Td>
                        <Td>{contract.greeks.vega.toFixed(3)}</Td>
                      </>
                    )}
                  </Tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        </Section>

        {/* Puts Section */}
        <Section>
          <SectionHeader $type="PUT">PUTS</SectionHeader>
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <Th>Strike</Th>
                  <Th>Bid</Th>
                  <Th>Ask</Th>
                  <Th>Last</Th>
                  <Th>Vol</Th>
                  <Th>OI</Th>
                  <Th>IV</Th>
                  {showGreeks && (
                    <>
                      <Th>Δ</Th>
                      <Th>Γ</Th>
                      <Th>Θ</Th>
                      <Th>V</Th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredPuts.map((contract, idx) => (
                  <Tr key={idx} $inTheMoney={contract.inTheMoney}>
                    <Td $bold>{contract.strike.toFixed(2)}</Td>
                    <Td>{contract.bid.toFixed(2)}</Td>
                    <Td>{contract.ask.toFixed(2)}</Td>
                    <Td $bold>{contract.last.toFixed(2)}</Td>
                    <Td>{contract.volume.toLocaleString()}</Td>
                    <Td>{contract.openInterest.toLocaleString()}</Td>
                    <Td $color={getIVColor(contract.impliedVolatility)}>
                      {contract.impliedVolatility.toFixed(1)}%
                    </Td>
                    {showGreeks && (
                      <>
                        <Td $color={getDeltaColor(contract.greeks.delta, 'PUT')}>
                          {contract.greeks.delta.toFixed(3)}
                        </Td>
                        <Td>{contract.greeks.gamma.toFixed(4)}</Td>
                        <Td $color={contract.greeks.theta < 0 ? '#ff8888' : '#88ff88'}>
                          {contract.greeks.theta.toFixed(3)}
                        </Td>
                        <Td>{contract.greeks.vega.toFixed(3)}</Td>
                      </>
                    )}
                  </Tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        </Section>
      </ChainContainer>

      <Legend>
        <LegendTitle>Legend:</LegendTitle>
        <LegendItem>
          <LegendColor $color="#00ff00" /> Deep ITM
        </LegendItem>
        <LegendItem>
          <LegendColor $color="#88ff88" /> ATM
        </LegendItem>
        <LegendItem>
          <LegendColor $color="#444444" /> OTM
        </LegendItem>
        <LegendDivider />
        <LegendItem>
          Δ = Delta | Γ = Gamma | Θ = Theta | V = Vega
        </LegendItem>
        <LegendItem>
          Vol = Volume | OI = Open Interest | IV = Implied Volatility
        </LegendItem>
      </Legend>
    </Container>
  );
};

export default OptionsChainFunction;

// Styled Components

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #0a0a0a;
  color: #ffffff;
  font-family: 'Courier New', monospace;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
  border-bottom: 2px solid #ff6600;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const HeaderRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #ff6600;
  letter-spacing: 2px;
`;

const Ticker = styled.span`
  font-size: 24px;
  font-weight: bold;
  color: #00ffff;
  letter-spacing: 1px;
`;

const SpotPrice = styled.div`
  font-size: 14px;
  color: #aaaaaa;
`;

const PriceValue = styled.span`
  color: #00ff00;
  font-weight: bold;
  font-size: 16px;
`;

const UpdateTime = styled.div`
  font-size: 11px;
  color: #666666;
`;

const Controls = styled.div`
  display: flex;
  gap: 30px;
  padding: 15px 20px;
  background: #111111;
  border-bottom: 1px solid #333333;
  flex-wrap: wrap;
`;

const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Label = styled.label`
  font-size: 12px;
  color: #aaaaaa;
  font-weight: bold;
`;

const Select = styled.select`
  background: #1a1a1a;
  color: #ffffff;
  border: 1px solid #ff6600;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 12px;
  font-family: 'Courier New', monospace;
  cursor: pointer;
  outline: none;

  &:hover {
    background: #222222;
    border-color: #ff8833;
  }

  &:focus {
    border-color: #ffaa00;
  }

  option {
    background: #1a1a1a;
    color: #ffffff;
  }
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 5px;
`;

const FilterButton = styled.button<{ $active: boolean }>`
  background: ${props => props.$active ? '#ff6600' : '#1a1a1a'};
  color: ${props => props.$active ? '#000000' : '#ffffff'};
  border: 1px solid ${props => props.$active ? '#ff6600' : '#444444'};
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 11px;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$active ? '#ff8833' : '#222222'};
    border-color: #ff6600;
  }
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  background: ${props => props.$active ? '#00ff00' : '#1a1a1a'};
  color: ${props => props.$active ? '#000000' : '#ffffff'};
  border: 1px solid ${props => props.$active ? '#00ff00' : '#444444'};
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 11px;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$active ? '#00ff33' : '#222222'};
    border-color: #00ff00;
  }
`;

const ChainContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 10px;
  flex: 1;
  overflow: hidden;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  background: #0f0f0f;
  border: 1px solid #333333;
  border-radius: 6px;
  overflow: hidden;
`;

const SectionHeader = styled.div<{ $type: 'CALL' | 'PUT' }>`
  background: ${props => props.$type === 'CALL' ? '#00ff0022' : '#ff000022'};
  color: ${props => props.$type === 'CALL' ? '#00ff00' : '#ff6666'};
  padding: 10px;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  border-bottom: 2px solid ${props => props.$type === 'CALL' ? '#00ff00' : '#ff6666'};
  letter-spacing: 2px;
`;

const TableContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: auto;

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #0a0a0a;
  }

  &::-webkit-scrollbar-thumb {
    background: #333333;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #444444;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
`;

const Th = styled.th`
  background: #1a1a1a;
  color: #aaaaaa;
  padding: 8px 6px;
  text-align: right;
  font-weight: bold;
  position: sticky;
  top: 0;
  border-bottom: 1px solid #333333;
  font-size: 10px;
  white-space: nowrap;

  &:first-child {
    text-align: left;
  }
`;

const Tr = styled.tr<{ $inTheMoney?: boolean }>`
  background: ${props => props.$inTheMoney ? '#00220011' : 'transparent'};
  border-bottom: 1px solid #222222;

  &:hover {
    background: #1a1a1a;
  }
`;

const Td = styled.td<{ $bold?: boolean; $color?: string }>`
  padding: 8px 6px;
  text-align: right;
  color: ${props => props.$color || '#ffffff'};
  font-weight: ${props => props.$bold ? 'bold' : 'normal'};
  white-space: nowrap;

  &:first-child {
    text-align: left;
  }
`;

const Legend = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  padding: 10px 20px;
  background: #111111;
  border-top: 1px solid #333333;
  font-size: 10px;
  color: #888888;
  flex-wrap: wrap;
`;

const LegendTitle = styled.span`
  color: #aaaaaa;
  font-weight: bold;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const LegendColor = styled.div<{ $color: string }>`
  width: 12px;
  height: 12px;
  background: ${props => props.$color};
  border: 1px solid #666666;
  border-radius: 2px;
`;

const LegendDivider = styled.div`
  width: 1px;
  height: 15px;
  background: #444444;
`;

const LoadingMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 16px;
  color: #aaaaaa;
`;

const ErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 20px;
  text-align: center;
`;

const ErrorTitle = styled.div`
  font-size: 18px;
  color: #ff6666;
  font-weight: bold;
  margin-bottom: 10px;
`;

const ErrorText = styled.div`
  font-size: 14px;
  color: #aaaaaa;
  margin-bottom: 20px;
`;

const RetryButton = styled.button`
  background: #ff6600;
  color: #000000;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 12px;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #ff8833;
    transform: scale(1.05);
  }
`;
