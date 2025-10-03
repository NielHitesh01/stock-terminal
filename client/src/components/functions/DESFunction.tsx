import styled from 'styled-components';
import LivePriceIndicator from '../LivePriceIndicator';

const Container = styled.div`
  padding: 10px;
  color: #00ff00;
`;

const Header = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #00ffff;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #333333;
`;

const Section = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.div`
  color: #ffff00;
  font-size: 11px;
  margin-bottom: 5px;
  text-transform: uppercase;
`;

const Value = styled.div`
  color: #00ff00;
  font-size: 13px;
  margin-left: 10px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 10px;
`;

const GridItem = styled.div``;

const NoData = styled.div`
  color: #666666;
  font-style: italic;
  padding: 20px;
  text-align: center;
`;

interface DESFunctionProps {
  ticker: string;
  data: any;
}

const DESFunction = ({ ticker, data }: DESFunctionProps) => {
  if (!data) {
    return <NoData>No data available for {ticker}</NoData>;
  }

  const formatNumber = (num: number | undefined) => {
    if (num === undefined || num === null) return 'N/A';
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  return (
    <Container>
      <Header>
        {data.name || ticker} ({ticker})
      </Header>

      {/* Live Price Indicator */}
      <Section>
        <LivePriceIndicator ticker={ticker} showRSI={true} />
      </Section>

      <Section>
        <Label>Description</Label>
        <Value>{data.description || 'No description available'}</Value>
      </Section>

      <Grid>
        <GridItem>
          <Section>
            <Label>Exchange</Label>
            <Value>{data.exchange || 'N/A'}</Value>
          </Section>
        </GridItem>
        
        <GridItem>
          <Section>
            <Label>Sector</Label>
            <Value>{data.sector || 'N/A'}</Value>
          </Section>
        </GridItem>

        <GridItem>
          <Section>
            <Label>Industry</Label>
            <Value>{data.industry || 'N/A'}</Value>
          </Section>
        </GridItem>

        <GridItem>
          <Section>
            <Label>Country</Label>
            <Value>{data.country || 'N/A'}</Value>
          </Section>
        </GridItem>

        <GridItem>
          <Section>
            <Label>Market Cap</Label>
            <Value>{formatNumber(data.marketCap)}</Value>
          </Section>
        </GridItem>

        <GridItem>
          <Section>
            <Label>Employees</Label>
            <Value>{data.employees?.toLocaleString() || 'N/A'}</Value>
          </Section>
        </GridItem>

        <GridItem>
          <Section>
            <Label>CEO</Label>
            <Value>{data.ceo || 'N/A'}</Value>
          </Section>
        </GridItem>

        <GridItem>
          <Section>
            <Label>Website</Label>
            <Value style={{ color: '#00ffff', textDecoration: 'underline', cursor: 'pointer' }}>
              {data.website || 'N/A'}
            </Value>
          </Section>
        </GridItem>
      </Grid>
    </Container>
  );
};

export default DESFunction;
