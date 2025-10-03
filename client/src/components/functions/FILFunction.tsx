import styled from 'styled-components';

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
`;

const CompanyName = styled.div`
  font-size: 11px;
  color: #666666;
  margin-top: 5px;
`;

const FilingsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FilingCard = styled.a`
  display: block;
  background: #0a0a0a;
  border: 1px solid #333333;
  padding: 12px 15px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    border-color: #00ff00;
    background: #1a1a1a;
  }
`;

const FilingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const FilingType = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #00ffff;
  font-family: 'Courier New', monospace;
`;

const FilingDate = styled.div`
  font-size: 11px;
  color: #ffff00;
`;

const FilingDescription = styled.div`
  font-size: 11px;
  color: #00ff00;
  line-height: 1.4;
`;

const FilingMeta = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 8px;
  font-size: 10px;
  color: #666666;
`;

const ViewLink = styled.span`
  color: #00ffff;
  text-decoration: underline;

  &:hover {
    color: #ffff00;
  }
`;

const NoData = styled.div`
  color: #666666;
  font-style: italic;
  padding: 40px;
  text-align: center;
`;

const InfoBox = styled.div`
  background: #0a0a0a;
  border: 1px solid #ffff00;
  border-left: 4px solid #ffff00;
  padding: 12px 15px;
  margin-bottom: 15px;
  font-size: 11px;
  color: #ffff00;
  line-height: 1.5;
`;

const FilingTypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  margin-bottom: 20px;
`;

const FilingTypeCard = styled.div`
  background: #0a0a0a;
  border: 1px solid #333333;
  padding: 10px;
  font-size: 10px;
`;

const FilingTypeLabel = styled.div`
  color: #00ffff;
  font-weight: bold;
  margin-bottom: 4px;
`;

const FilingTypeDesc = styled.div`
  color: #666666;
  line-height: 1.3;
`;

interface FILFunctionProps {
  ticker: string;
  data: any;
}

const FILFunction = ({ ticker, data }: FILFunctionProps) => {
  if (!data || !data.filings) {
    return <NoData>No SEC filings data available for {ticker}</NoData>;
  }

  const filings = data.filings || [];

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Container>
      <Header>
        {ticker} - SEC Filings
        <CompanyName>{data.companyName}</CompanyName>
      </Header>

      <InfoBox>
        💡 SEC filings are official documents companies must file with the Securities and Exchange Commission.
        Click any filing to view the full document on SEC.gov.
      </InfoBox>

      <FilingTypeGrid>
        <FilingTypeCard>
          <FilingTypeLabel>10-K</FilingTypeLabel>
          <FilingTypeDesc>Annual report with comprehensive financial information</FilingTypeDesc>
        </FilingTypeCard>
        <FilingTypeCard>
          <FilingTypeLabel>10-Q</FilingTypeLabel>
          <FilingTypeDesc>Quarterly report with unaudited financials</FilingTypeDesc>
        </FilingTypeCard>
        <FilingTypeCard>
          <FilingTypeLabel>8-K</FilingTypeLabel>
          <FilingTypeDesc>Current report of material events</FilingTypeDesc>
        </FilingTypeCard>
        <FilingTypeCard>
          <FilingTypeLabel>DEF 14A</FilingTypeLabel>
          <FilingTypeDesc>Proxy statement for shareholder meetings</FilingTypeDesc>
        </FilingTypeCard>
      </FilingTypeGrid>

      {filings.length === 0 ? (
        <NoData>No recent filings found for {ticker}</NoData>
      ) : (
        <FilingsList>
          {filings.map((filing: any, index: number) => (
            <FilingCard
              key={index}
              href={filing.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FilingHeader>
                <FilingType>{filing.type}</FilingType>
                <FilingDate>{formatDate(filing.date)}</FilingDate>
              </FilingHeader>
              <FilingDescription>{filing.description}</FilingDescription>
              <FilingMeta>
                <ViewLink>View on SEC.gov →</ViewLink>
              </FilingMeta>
            </FilingCard>
          ))}
        </FilingsList>
      )}
    </Container>
  );
};

export default FILFunction;
