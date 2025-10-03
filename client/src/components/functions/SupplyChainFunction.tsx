import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface SupplyChainFunctionProps {
  ticker: string;
}

interface SupplyChainData {
  company: string;
  ticker: string;
  industry: string;
  suppliers: Array<{
    name: string;
    ticker?: string;
    category: string;
    description: string;
  }>;
  customers: Array<{
    name: string;
    ticker?: string;
    category: string;
    description: string;
  }>;
}

const SupplyChainFunction: React.FC<SupplyChainFunctionProps> = ({ ticker }) => {
  const [data, setData] = useState<SupplyChainData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSupplyChainData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:3002/api/supply-chain/${ticker}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch supply chain data');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSupplyChainData();
  }, [ticker]);

  if (loading) {
    return (
      <Container>
        <LoadingMessage>Loading supply chain diagram for {ticker}...</LoadingMessage>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>Error: {error}</ErrorMessage>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container>
        <ErrorMessage>No supply chain data available for {ticker}</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Supply Chain Diagram</Title>
        <Subtitle>{data.company} ({ticker})</Subtitle>
        <Industry>{data.industry}</Industry>
      </Header>

      <DiagramContainer>
        {/* Suppliers Section (Right Side) */}
        <SuppliersSection>
          <SectionTitle>
            <Arrow>←</Arrow>
            <TitleText>SUPPLIERS</TitleText>
          </SectionTitle>
          <SectionSubtitle>Raw Materials, Components & Services</SectionSubtitle>
          
          <EntitiesList>
            {data.suppliers.map((supplier, index) => (
              <EntityCard key={index} side="right">
                <EntityName>{supplier.name}</EntityName>
                {supplier.ticker && <EntityTicker>({supplier.ticker})</EntityTicker>}
                <EntityCategory>{supplier.category}</EntityCategory>
                <EntityDescription>{supplier.description}</EntityDescription>
              </EntityCard>
            ))}
          </EntitiesList>
        </SuppliersSection>

        {/* Center Company */}
        <CenterSection>
          <ConnectionLine side="left" />
          <CenterCompany>
            <CenterCompanyName>{data.company}</CenterCompanyName>
            <CenterTicker>{ticker}</CenterTicker>
            <CenterLabel>HUB</CenterLabel>
          </CenterCompany>
          <ConnectionLine side="right" />
        </CenterSection>

        {/* Customers Section (Left Side) */}
        <CustomersSection>
          <SectionTitle>
            <TitleText>CUSTOMERS</TitleText>
            <Arrow>→</Arrow>
          </SectionTitle>
          <SectionSubtitle>Buyers & Distribution Channels</SectionSubtitle>
          
          <EntitiesList>
            {data.customers.map((customer, index) => (
              <EntityCard key={index} side="left">
                <EntityName>{customer.name}</EntityName>
                {customer.ticker && <EntityTicker>({customer.ticker})</EntityTicker>}
                <EntityCategory>{customer.category}</EntityCategory>
                <EntityDescription>{customer.description}</EntityDescription>
              </EntityCard>
            ))}
          </EntitiesList>
        </CustomersSection>
      </DiagramContainer>

      <Legend>
        <LegendItem>
          <LegendArrow>←</LegendArrow>
          <span>Input Flow (Suppliers provide materials/services)</span>
        </LegendItem>
        <LegendItem>
          <LegendArrow>→</LegendArrow>
          <span>Output Flow (Products/services to customers)</span>
        </LegendItem>
      </Legend>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  padding: 20px;
  color: #00ff00;
  font-family: 'Courier New', monospace;
  height: 100%;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.3);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
  border-bottom: 2px solid #00ff00;
  padding-bottom: 15px;
`;

const Title = styled.h2`
  margin: 0 0 5px 0;
  font-size: 24px;
  color: #00ff00;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const Subtitle = styled.div`
  font-size: 18px;
  margin: 5px 0;
  color: #00ff00;
`;

const Industry = styled.div`
  font-size: 14px;
  color: #00aa00;
  font-style: italic;
  margin-top: 5px;
`;

const DiagramContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 20px;
  margin: 30px 0;
  align-items: start;
`;

const SuppliersSection = styled.div`
  text-align: right;
`;

const CustomersSection = styled.div`
  text-align: left;
`;

const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #00ff00;
`;

const TitleText = styled.span`
  letter-spacing: 2px;
`;

const Arrow = styled.span`
  font-size: 24px;
  color: #00ff00;
`;

const SectionSubtitle = styled.div`
  font-size: 12px;
  color: #00aa00;
  margin-bottom: 15px;
`;

const EntitiesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const EntityCard = styled.div<{ side: 'left' | 'right' }>`
  background: rgba(0, 100, 0, 0.1);
  border: 1px solid #00ff00;
  border-radius: 8px;
  padding: 12px;
  text-align: ${props => props.side === 'right' ? 'right' : 'left'};
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 150, 0, 0.2);
    border-color: #00ff00;
    box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
    transform: ${props => props.side === 'right' ? 'translateX(-5px)' : 'translateX(5px)'};
  }
`;

const EntityName = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #00ff00;
  margin-bottom: 3px;
`;

const EntityTicker = styled.span`
  font-size: 12px;
  color: #00aa00;
  margin-left: 5px;
`;

const EntityCategory = styled.div`
  font-size: 11px;
  color: #00aa00;
  text-transform: uppercase;
  margin: 5px 0;
  letter-spacing: 1px;
`;

const EntityDescription = styled.div`
  font-size: 12px;
  color: #009900;
  line-height: 1.4;
  margin-top: 5px;
`;

const CenterSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  min-width: 200px;
`;

const ConnectionLine = styled.div<{ side: 'left' | 'right' }>`
  width: 2px;
  height: 40px;
  background: linear-gradient(
    ${props => props.side === 'left' ? 'to bottom' : 'to top'},
    #00ff00,
    transparent
  );
  margin: 5px 0;
`;

const CenterCompany = styled.div`
  background: rgba(0, 255, 0, 0.15);
  border: 3px solid #00ff00;
  border-radius: 50%;
  width: 180px;
  height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
    }
    50% {
      box-shadow: 0 0 30px rgba(0, 255, 0, 0.8);
    }
  }
`;

const CenterCompanyName = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #00ff00;
  margin-bottom: 5px;
  word-wrap: break-word;
`;

const CenterTicker = styled.div`
  font-size: 16px;
  color: #00ff00;
  margin-bottom: 8px;
`;

const CenterLabel = styled.div`
  font-size: 11px;
  color: #00aa00;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-top: 5px;
`;

const Legend = styled.div`
  display: flex;
  gap: 30px;
  justify-content: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #00aa00;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: #00aa00;
`;

const LegendArrow = styled.span`
  font-size: 18px;
  color: #00ff00;
  font-weight: bold;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 16px;
  color: #00aa00;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 16px;
  color: #ff0000;
  border: 1px solid #ff0000;
  border-radius: 8px;
  background: rgba(255, 0, 0, 0.1);
`;

export default SupplyChainFunction;
