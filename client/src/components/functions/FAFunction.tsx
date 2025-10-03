import styled from 'styled-components';
import { exportFinancialData } from '../../utils/exportUtils';

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

const HeaderLeft = styled.div`
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

const Currency = styled.span`
  font-size: 11px;
  color: #666666;
  font-weight: normal;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.div`
  font-size: 13px;
  font-weight: bold;
  color: #ffff00;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
`;

const Thead = styled.thead`
  background-color: #0a0a0a;
`;

const Th = styled.th`
  text-align: right;
  padding: 8px 10px;
  color: #00ffff;
  font-weight: bold;
  border-bottom: 1px solid #00ff00;
  
  &:first-child {
    text-align: left;
    color: #ffff00;
  }
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  &:hover {
    background-color: #0a0a0a;
  }
`;

const Td = styled.td<{ $highlight?: boolean }>`
  text-align: right;
  padding: 8px 10px;
  color: ${props => props.$highlight ? '#00ffff' : '#00ff00'};
  border-bottom: 1px solid #1a1a1a;
  
  &:first-child {
    text-align: left;
    color: #00ff00;
    font-weight: bold;
  }
`;

const RatiosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 10px;
`;

const RatioCard = styled.div`
  background-color: #0a0a0a;
  border: 1px solid #333333;
  padding: 12px;
`;

const RatioLabel = styled.div`
  font-size: 10px;
  color: #666666;
  text-transform: uppercase;
  margin-bottom: 5px;
`;

const RatioValue = styled.div<{ $positive?: boolean; $negative?: boolean }>`
  font-size: 16px;
  font-weight: bold;
  color: ${props => 
    props.$positive ? '#00ff00' : 
    props.$negative ? '#ff0000' : 
    '#00ffff'};
`;

const NoData = styled.div`
  color: #666666;
  font-style: italic;
  padding: 20px;
  text-align: center;
`;

interface FAFunctionProps {
  ticker: string;
  data: any;
}

const FAFunction = ({ ticker, data }: FAFunctionProps) => {
  if (!data) {
    return <NoData>No financial data available for {ticker}</NoData>;
  }

  const formatNumber = (num: number | undefined, decimals: number = 0): string => {
    if (num === undefined || num === null || isNaN(num)) return 'N/A';
    if (num === 0) return '0';
    
    const absNum = Math.abs(num);
    if (absNum >= 1e12) return `${(num / 1e12).toFixed(decimals)}T`;
    if (absNum >= 1e9) return `${(num / 1e9).toFixed(decimals)}B`;
    if (absNum >= 1e6) return `${(num / 1e6).toFixed(decimals)}M`;
    if (absNum >= 1e3) return `${(num / 1e3).toFixed(decimals)}K`;
    return num.toFixed(decimals);
  };

  const formatRatio = (num: number | undefined, decimals: number = 2): string => {
    if (num === undefined || num === null || isNaN(num)) return 'N/A';
    return num.toFixed(decimals);
  };

  const incomeStatement = data.incomeStatement || [];
  const balanceSheet = data.balanceSheet || [];
  const ratios = data.keyRatios || {};

  const handleExport = () => {
    exportFinancialData(data, ticker);
  };

  return (
    <Container>
      <Header>
        <HeaderLeft>
          {ticker} - Financial Analysis
          <Currency>{data.currency || 'USD'}</Currency>
        </HeaderLeft>
        <ExportButton onClick={handleExport}>
          EXPORT CSV
        </ExportButton>
      </Header>

      {/* Income Statement */}
      {incomeStatement.length > 0 && (
        <Section>
          <SectionTitle>Income Statement (Annual)</SectionTitle>
          <Table>
            <Thead>
              <Tr>
                <Th>Metric</Th>
                {incomeStatement.map((year: any) => (
                  <Th key={year.fiscalYear}>{year.fiscalYear}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>Revenue</Td>
                {incomeStatement.map((year: any) => (
                  <Td key={year.fiscalYear} $highlight>
                    {formatNumber(year.revenue)}
                  </Td>
                ))}
              </Tr>
              <Tr>
                <Td>Gross Profit</Td>
                {incomeStatement.map((year: any) => (
                  <Td key={year.fiscalYear}>{formatNumber(year.grossProfit)}</Td>
                ))}
              </Tr>
              <Tr>
                <Td>Operating Income</Td>
                {incomeStatement.map((year: any) => (
                  <Td key={year.fiscalYear}>{formatNumber(year.operatingIncome)}</Td>
                ))}
              </Tr>
              <Tr>
                <Td>EBITDA</Td>
                {incomeStatement.map((year: any) => (
                  <Td key={year.fiscalYear}>{formatNumber(year.ebitda)}</Td>
                ))}
              </Tr>
              <Tr>
                <Td>Net Income</Td>
                {incomeStatement.map((year: any) => (
                  <Td key={year.fiscalYear} $highlight>
                    {formatNumber(year.netIncome)}
                  </Td>
                ))}
              </Tr>
              <Tr>
                <Td>EPS (Diluted)</Td>
                {incomeStatement.map((year: any) => (
                  <Td key={year.fiscalYear} $highlight>
                    ${formatRatio(year.eps)}
                  </Td>
                ))}
              </Tr>
            </Tbody>
          </Table>
        </Section>
      )}

      {/* Balance Sheet */}
      {balanceSheet.length > 0 && (
        <Section>
          <SectionTitle>Balance Sheet (Annual)</SectionTitle>
          <Table>
            <Thead>
              <Tr>
                <Th>Metric</Th>
                {balanceSheet.map((year: any) => (
                  <Th key={year.fiscalYear}>{year.fiscalYear}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>Total Assets</Td>
                {balanceSheet.map((year: any) => (
                  <Td key={year.fiscalYear} $highlight>
                    {formatNumber(year.totalAssets)}
                  </Td>
                ))}
              </Tr>
              <Tr>
                <Td>Total Liabilities</Td>
                {balanceSheet.map((year: any) => (
                  <Td key={year.fiscalYear}>{formatNumber(year.totalLiabilities)}</Td>
                ))}
              </Tr>
              <Tr>
                <Td>Total Equity</Td>
                {balanceSheet.map((year: any) => (
                  <Td key={year.fiscalYear} $highlight>
                    {formatNumber(year.totalEquity)}
                  </Td>
                ))}
              </Tr>
              <Tr>
                <Td>Cash & Equivalents</Td>
                {balanceSheet.map((year: any) => (
                  <Td key={year.fiscalYear}>{formatNumber(year.cashAndEquivalents)}</Td>
                ))}
              </Tr>
              <Tr>
                <Td>Total Debt</Td>
                {balanceSheet.map((year: any) => (
                  <Td key={year.fiscalYear}>{formatNumber(year.totalDebt)}</Td>
                ))}
              </Tr>
              <Tr>
                <Td>Current Ratio</Td>
                {balanceSheet.map((year: any) => (
                  <Td key={year.fiscalYear}>{formatRatio(year.currentRatio)}</Td>
                ))}
              </Tr>
            </Tbody>
          </Table>
        </Section>
      )}

      {/* Key Ratios */}
      {Object.keys(ratios).length > 0 && (
        <Section>
          <SectionTitle>Key Financial Ratios</SectionTitle>
          <RatiosGrid>
            <RatioCard>
              <RatioLabel>P/E Ratio</RatioLabel>
              <RatioValue>{formatRatio(ratios.peRatio)}</RatioValue>
            </RatioCard>
            <RatioCard>
              <RatioLabel>P/B Ratio</RatioLabel>
              <RatioValue>{formatRatio(ratios.pbRatio)}</RatioValue>
            </RatioCard>
            <RatioCard>
              <RatioLabel>Return on Equity</RatioLabel>
              <RatioValue $positive={ratios.roe > 15}>
                {formatRatio(ratios.roe)}%
              </RatioValue>
            </RatioCard>
            <RatioCard>
              <RatioLabel>Return on Assets</RatioLabel>
              <RatioValue $positive={ratios.roa > 5}>
                {formatRatio(ratios.roa)}%
              </RatioValue>
            </RatioCard>
            <RatioCard>
              <RatioLabel>Debt to Equity</RatioLabel>
              <RatioValue $negative={ratios.debtToEquity > 200}>
                {formatRatio(ratios.debtToEquity)}%
              </RatioValue>
            </RatioCard>
            <RatioCard>
              <RatioLabel>Current Ratio</RatioLabel>
              <RatioValue $positive={ratios.currentRatio >= 1}>
                {formatRatio(ratios.currentRatio)}
              </RatioValue>
            </RatioCard>
            <RatioCard>
              <RatioLabel>Profit Margin</RatioLabel>
              <RatioValue $positive={ratios.profitMargin > 10}>
                {formatRatio(ratios.profitMargin)}%
              </RatioValue>
            </RatioCard>
          </RatiosGrid>
        </Section>
      )}
    </Container>
  );
};

export default FAFunction;
