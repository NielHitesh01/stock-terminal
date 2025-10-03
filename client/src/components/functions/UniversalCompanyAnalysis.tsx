import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface SupplyChainFunctionProps {
  ticker: string;
}

interface SupplyChainEntity {
  name: string;
  ticker?: string;
  category: string;
  description: string;
}

interface CompanyOverview {
  fullName: string;
  founded: number;
  founders: string[];
  headquarters: string;
  industrySector: string;
  keyProducts: string[];
  revenue: string;
  employees: string;
  marketCap: string;
}

interface BusinessModel {
  revenueStreams: string[];
  marketPosition: 'Market Leader' | 'Strong Challenger' | 'Niche Player' | 'Emerging';
  competitiveAdvantages: string[];
  businessType: string;
}

interface RecentDevelopment {
  date: string;
  type: 'Acquisition' | 'Product Launch' | 'Expansion' | 'Partnership' | 'Challenge' | 'News';
  title: string;
  description: string;
}

interface FutureOutlook {
  trends: string[];
  opportunities: string[];
  risks: string[];
  outlook: string;
}

interface SupplyChainData {
  company: string;
  ticker: string;
  industry: string;
  overview?: CompanyOverview;
  businessModel?: BusinessModel;
  recentDevelopments?: RecentDevelopment[];
  futureOutlook?: FutureOutlook;
  suppliers: SupplyChainEntity[];
  customers: SupplyChainEntity[];
}

const SupplyChainFunction: React.FC<SupplyChainFunctionProps> = ({ ticker }) => {
  const [data, setData] = useState<SupplyChainData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'chain' | 'analysis'>('overview');

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
        <LoadingMessage>Loading company analysis for {ticker}...</LoadingMessage>
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
        <ErrorMessage>No data available for {ticker}</ErrorMessage>
      </Container>
    );
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Product Launch': return '#00ff00';
      case 'Acquisition': return '#00ffff';
      case 'Expansion': return '#ffff00';
      case 'Partnership': return '#ff00ff';
      case 'Challenge': return '#ff0000';
      case 'News': return '#00aa00';
      default: return '#00ff00';
    }
  };

  return (
    <Container>
      <Header>
        <Title>Universal Company Analysis</Title>
        <Subtitle>{data.company} ({ticker})</Subtitle>
        <Industry>{data.industry}</Industry>
      </Header>

      <TabBar>
        <Tab $active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
          OVERVIEW
        </Tab>
        <Tab $active={activeTab === 'chain'} onClick={() => setActiveTab('chain')}>
          SUPPLY CHAIN
        </Tab>
        <Tab $active={activeTab === 'analysis'} onClick={() => setActiveTab('analysis')}>
          ANALYSIS
        </Tab>
      </TabBar>

      <Content>
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && data.overview && (
          <OverviewSection>
            <Section>
              <SectionTitle>COMPANY OVERVIEW</SectionTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>Full Name:</InfoLabel>
                  <InfoValue>{data.overview.fullName}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Founded:</InfoLabel>
                  <InfoValue>{data.overview.founded}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Founders:</InfoLabel>
                  <InfoValue>{data.overview.founders.join(', ')}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Headquarters:</InfoLabel>
                  <InfoValue>{data.overview.headquarters}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Industry Sector:</InfoLabel>
                  <InfoValue>{data.overview.industrySector}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Revenue:</InfoLabel>
                  <InfoValue $highlight>{data.overview.revenue}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Employees:</InfoLabel>
                  <InfoValue>{data.overview.employees}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Market Cap:</InfoLabel>
                  <InfoValue $highlight>{data.overview.marketCap}</InfoValue>
                </InfoItem>
              </InfoGrid>
            </Section>

            <Section>
              <SectionTitle>KEY PRODUCTS & SERVICES</SectionTitle>
              <ProductList>
                {data.overview.keyProducts.map((product, index) => (
                  <ProductItem key={index}>
                    <Bullet>▸</Bullet> {product}
                  </ProductItem>
                ))}
              </ProductList>
            </Section>

            {data.businessModel && (
              <Section>
                <SectionTitle>BUSINESS MODEL</SectionTitle>
                <BusinessTypeBox>
                  <BusinessType>{data.businessModel.businessType}</BusinessType>
                  <MarketPosition $position={data.businessModel.marketPosition}>
                    {data.businessModel.marketPosition}
                  </MarketPosition>
                </BusinessTypeBox>

                <SubSection>
                  <SubSectionTitle>Revenue Streams:</SubSectionTitle>
                  <List>
                    {data.businessModel.revenueStreams.map((stream, index) => (
                      <ListItem key={index}>• {stream}</ListItem>
                    ))}
                  </List>
                </SubSection>

                <SubSection>
                  <SubSectionTitle>Competitive Advantages:</SubSectionTitle>
                  <List>
                    {data.businessModel.competitiveAdvantages.map((advantage, index) => (
                      <ListItem key={index}>✓ {advantage}</ListItem>
                    ))}
                  </List>
                </SubSection>
              </Section>
            )}
          </OverviewSection>
        )}

        {/* SUPPLY CHAIN TAB */}
        {activeTab === 'chain' && (
          <ChainSection>
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
          </ChainSection>
        )}

        {/* ANALYSIS TAB */}
        {activeTab === 'analysis' && (
          <AnalysisSection>
            {data.recentDevelopments && data.recentDevelopments.length > 0 && (
              <Section>
                <SectionTitle>RECENT DEVELOPMENTS</SectionTitle>
                <DevelopmentsList>
                  {data.recentDevelopments.map((dev, index) => (
                    <DevelopmentCard key={index}>
                      <DevelopmentHeader>
                        <DevelopmentDate>{dev.date}</DevelopmentDate>
                        <DevelopmentType $color={getTypeColor(dev.type)}>
                          {dev.type}
                        </DevelopmentType>
                      </DevelopmentHeader>
                      <DevelopmentTitle>{dev.title}</DevelopmentTitle>
                      <DevelopmentDescription>{dev.description}</DevelopmentDescription>
                    </DevelopmentCard>
                  ))}
                </DevelopmentsList>
              </Section>
            )}

            {data.futureOutlook && (
              <>
                <Section>
                  <SectionTitle>FUTURE OUTLOOK</SectionTitle>
                  <OutlookBox>{data.futureOutlook.outlook}</OutlookBox>
                </Section>

                <ThreeColumnGrid>
                  <OutlookColumn>
                    <OutlookColumnTitle $color="#00ffff">TRENDS</OutlookColumnTitle>
                    <OutlookList>
                      {data.futureOutlook.trends.map((trend, index) => (
                        <OutlookItem key={index}>▸ {trend}</OutlookItem>
                      ))}
                    </OutlookList>
                  </OutlookColumn>

                  <OutlookColumn>
                    <OutlookColumnTitle $color="#00ff00">OPPORTUNITIES</OutlookColumnTitle>
                    <OutlookList>
                      {data.futureOutlook.opportunities.map((opp, index) => (
                        <OutlookItem key={index}>+ {opp}</OutlookItem>
                      ))}
                    </OutlookList>
                  </OutlookColumn>

                  <OutlookColumn>
                    <OutlookColumnTitle $color="#ff6600">RISKS</OutlookColumnTitle>
                    <OutlookList>
                      {data.futureOutlook.risks.map((risk, index) => (
                        <OutlookItem key={index}>! {risk}</OutlookItem>
                      ))}
                    </OutlookList>
                  </OutlookColumn>
                </ThreeColumnGrid>
              </>
            )}
          </AnalysisSection>
        )}
      </Content>
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
  margin-bottom: 20px;
  border-bottom: 2px solid #00ff00;
  padding-bottom: 15px;
`;

const Title = styled.h2`
  margin: 0 0 5px 0;
  font-size: 20px;
  color: #00ff00;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const Subtitle = styled.div`
  font-size: 18px;
  margin: 5px 0;
  color: #00ff00;
  font-weight: bold;
`;

const Industry = styled.div`
  font-size: 13px;
  color: #00aa00;
  font-style: italic;
  margin-top: 5px;
`;

const TabBar = styled.div`
  display: flex;
  gap: 0;
  margin-bottom: 20px;
  border-bottom: 2px solid #333;
`;

const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 12px;
  background: ${props => props.$active ? 'rgba(0, 255, 0, 0.15)' : 'transparent'};
  border: none;
  border-bottom: 3px solid ${props => props.$active ? '#00ff00' : 'transparent'};
  color: ${props => props.$active ? '#00ff00' : '#666'};
  font-family: 'Courier New', monospace;
  font-size: 13px;
  font-weight: bold;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(0, 255, 0, 0.1);
    color: #00ff00;
  }
`;

const Content = styled.div`
  margin-top: 20px;
`;

const OverviewSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const Section = styled.div`
  background: rgba(0, 100, 0, 0.05);
  border: 1px solid #00ff00;
  border-radius: 8px;
  padding: 20px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #00ff00;
  text-transform: uppercase;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const InfoLabel = styled.div`
  font-size: 11px;
  color: #00aa00;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const InfoValue = styled.div<{ $highlight?: boolean }>`
  font-size: 14px;
  color: ${props => props.$highlight ? '#00ffff' : '#00ff00'};
  font-weight: ${props => props.$highlight ? 'bold' : 'normal'};
`;

const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ProductItem = styled.div`
  font-size: 13px;
  color: #00ff00;
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

const Bullet = styled.span`
  color: #00ffff;
  font-weight: bold;
`;

const BusinessTypeBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background: rgba(0, 255, 0, 0.1);
  border-radius: 6px;
`;

const BusinessType = styled.div`
  font-size: 14px;
  color: #00ffff;
  font-weight: bold;
`;

const MarketPosition = styled.div<{ $position: string }>`
  font-size: 14px;
  color: ${props => {
    switch (props.$position) {
      case 'Market Leader': return '#00ff00';
      case 'Strong Challenger': return '#ffff00';
      case 'Niche Player': return '#ff9900';
      case 'Emerging': return '#00ffff';
      default: return '#00ff00';
    }
  }};
  font-weight: bold;
  padding: 6px 12px;
  background: rgba(0, 255, 0, 0.1);
  border-radius: 4px;
`;

const SubSection = styled.div`
  margin-top: 15px;
`;

const SubSectionTitle = styled.div`
  font-size: 13px;
  color: #00ffff;
  font-weight: bold;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ListItem = styled.div`
  font-size: 12px;
  color: #00aa00;
  line-height: 1.5;
`;

const ChainSection = styled.div``;

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

const TitleText = styled.span`
  letter-spacing: 2px;
`;

const Arrow = styled.span`
  font-size: 24px;
  color: #00ff00;
`;

const SectionSubtitle = styled.div`
  font-size: 11px;
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
  font-size: 15px;
  font-weight: bold;
  color: #00ff00;
  margin-bottom: 3px;
`;

const EntityTicker = styled.span`
  font-size: 11px;
  color: #00aa00;
  margin-left: 5px;
`;

const EntityCategory = styled.div`
  font-size: 10px;
  color: #00aa00;
  text-transform: uppercase;
  margin: 5px 0;
  letter-spacing: 1px;
`;

const EntityDescription = styled.div`
  font-size: 11px;
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
  font-size: 17px;
  font-weight: bold;
  color: #00ff00;
  margin-bottom: 5px;
  word-wrap: break-word;
`;

const CenterTicker = styled.div`
  font-size: 15px;
  color: #00ff00;
  margin-bottom: 8px;
`;

const CenterLabel = styled.div`
  font-size: 10px;
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
  font-size: 11px;
  color: #00aa00;
`;

const LegendArrow = styled.span`
  font-size: 18px;
  color: #00ff00;
  font-weight: bold;
`;

const AnalysisSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const DevelopmentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const DevelopmentCard = styled.div`
  background: rgba(0, 100, 0, 0.05);
  border-left: 4px solid #00ff00;
  padding: 15px;
  border-radius: 4px;
  transition: all 0.3s;

  &:hover {
    background: rgba(0, 100, 0, 0.1);
    transform: translateX(5px);
  }
`;

const DevelopmentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const DevelopmentDate = styled.div`
  font-size: 11px;
  color: #00aa00;
  font-weight: bold;
`;

const DevelopmentType = styled.div<{ $color: string }>`
  font-size: 10px;
  color: ${props => props.$color};
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const DevelopmentTitle = styled.div`
  font-size: 14px;
  color: #00ff00;
  font-weight: bold;
  margin-bottom: 8px;
`;

const DevelopmentDescription = styled.div`
  font-size: 12px;
  color: #00aa00;
  line-height: 1.5;
`;

const OutlookBox = styled.div`
  font-size: 13px;
  color: #00ffff;
  line-height: 1.7;
  padding: 15px;
  background: rgba(0, 255, 255, 0.05);
  border-radius: 6px;
  border-left: 4px solid #00ffff;
`;

const ThreeColumnGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 20px;
`;

const OutlookColumn = styled.div`
  background: rgba(0, 100, 0, 0.05);
  border: 1px solid #00ff00;
  border-radius: 8px;
  padding: 15px;
`;

const OutlookColumnTitle = styled.h4<{ $color: string }>`
  margin: 0 0 12px 0;
  font-size: 13px;
  color: ${props => props.$color};
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 2px solid ${props => props.$color};
  padding-bottom: 8px;
`;

const OutlookList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const OutlookItem = styled.div`
  font-size: 11px;
  color: #00aa00;
  line-height: 1.5;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 15px;
  color: #00aa00;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 15px;
  color: #ff0000;
  border: 1px solid #ff0000;
  border-radius: 8px;
  background: rgba(255, 0, 0, 0.1);
`;

export default SupplyChainFunction;
