import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// ============================================================================
// INTERFACES
// ============================================================================

interface NewsArticle {
  id: string;
  headline: string;
  summary: string;
  source: string;
  timestamp: Date;
  url: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number; // -1 to 1
  impactScore: number; // 0 to 100
  relevance: number; // 0 to 100
  credibilityScore: number; // 0 to 100
  priceImpact?: {
    change: number;
    percentage: number;
  };
  keywords: string[];
  category: 'earnings' | 'merger' | 'product' | 'regulatory' | 'market' | 'analyst' | 'other';
}

interface NewsWithSentimentProps {
  ticker: string;
}

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

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
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  border-bottom: 2px solid #00ff00;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #00ff00;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TickerBadge = styled.span`
  background: #00ff00;
  color: #000000;
  padding: 4px 12px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 14px;
`;

const Controls = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const FilterButton = styled.button<{ $active?: boolean }>`
  background: ${props => props.$active ? '#00ff00' : 'transparent'};
  color: ${props => props.$active ? '#000000' : '#00ff00'};
  border: 2px solid #00ff00;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  font-weight: bold;
  transition: all 0.2s;

  &:hover {
    background: #00ff00;
    color: #000000;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 255, 0, 0.3);
  }
`;

const TimeframeSelector = styled.select`
  background: #000000;
  color: #00ff00;
  border: 2px solid #00ff00;
  padding: 8px 12px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  cursor: pointer;

  &:focus {
    outline: none;
    box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
  }
`;

const SummaryBar = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 15px;
  background: #0a0a0a;
  border-bottom: 1px solid #00ff00;
`;

const SummaryItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
`;

const SummaryLabel = styled.div`
  font-size: 11px;
  color: #00ff00;
  opacity: 0.7;
  text-transform: uppercase;
`;

const SummaryValue = styled.div<{ $color?: string }>`
  font-size: 18px;
  font-weight: bold;
  color: ${props => props.$color || '#00ff00'};
`;

const NewsFeed = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  
  &::-webkit-scrollbar {
    width: 12px;
  }
  
  &::-webkit-scrollbar-track {
    background: #0a0a0a;
    border-left: 1px solid #00ff00;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #00ff00;
    border-radius: 6px;
    
    &:hover {
      background: #00cc00;
    }
  }
`;

const NewsCard = styled.div<{ $sentiment: string }>`
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  border: 2px solid ${props => 
    props.$sentiment === 'positive' ? '#00ff00' : 
    props.$sentiment === 'negative' ? '#ff0000' : 
    '#ffff00'
  };
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateX(5px);
    box-shadow: 0 4px 20px ${props => 
      props.$sentiment === 'positive' ? 'rgba(0, 255, 0, 0.3)' : 
      props.$sentiment === 'negative' ? 'rgba(255, 0, 0, 0.3)' : 
      'rgba(255, 255, 0, 0.3)'
    };
  }
`;

const NewsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
`;

const NewsHeadline = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #00ff00;
  margin-bottom: 8px;
  line-height: 1.4;
  flex: 1;
`;

const NewsMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-bottom: 10px;
`;

const Badge = styled.span<{ $type?: string; $color?: string }>`
  background: ${props => props.$color || '#00ff00'};
  color: #000000;
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
`;

const SentimentBadge = styled(Badge)<{ $sentiment: string }>`
  background: ${props => 
    props.$sentiment === 'positive' ? '#00ff00' : 
    props.$sentiment === 'negative' ? '#ff0000' : 
    '#ffff00'
  };
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ImpactIndicator = styled.div<{ $level: string }>`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: ${props => 
    props.$level === 'high' ? '#ff0000' : 
    props.$level === 'medium' ? '#ffff00' : 
    '#00ff00'
  };
`;

const ProgressBar = styled.div`
  width: 60px;
  height: 8px;
  background: #0a0a0a;
  border: 1px solid #00ff00;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percentage: number; $color: string }>`
  height: 100%;
  width: ${props => props.$percentage}%;
  background: ${props => props.$color};
  transition: width 0.3s;
`;

const NewsSource = styled.div`
  font-size: 11px;
  color: #00ff00;
  opacity: 0.7;
`;

const NewsTime = styled.div`
  font-size: 11px;
  color: #00ff00;
  opacity: 0.7;
`;

const NewsSummary = styled.div`
  font-size: 13px;
  color: #00ff00;
  opacity: 0.8;
  line-height: 1.5;
  margin-bottom: 10px;
`;

const PriceImpact = styled.div<{ $positive: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  background: ${props => props.$positive ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)'};
  border: 1px solid ${props => props.$positive ? '#00ff00' : '#ff0000'};
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  color: ${props => props.$positive ? '#00ff00' : '#ff0000'};
`;

const KeywordTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 10px;
`;

const KeywordTag = styled.span`
  background: #0a0a0a;
  color: #00ff00;
  border: 1px solid #00ff00;
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 10px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #00ff00;
  opacity: 0.5;
  font-size: 16px;
  gap: 10px;
`;

const LoadingSpinner = styled.div`
  border: 4px solid #0a0a0a;
  border-top: 4px solid #00ff00;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// ============================================================================
// COMPONENT
// ============================================================================

const NewsWithSentiment: React.FC<NewsWithSentimentProps> = ({ ticker }) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [sentimentFilter, setSentimentFilter] = useState<string>('all');
  const [timeframe, setTimeframe] = useState<string>('24h');

  // Load mock news data (replace with real API)
  useEffect(() => {
    loadNews();
  }, [ticker, timeframe]);

  // Filter articles based on sentiment
  useEffect(() => {
    if (sentimentFilter === 'all') {
      setFilteredArticles(articles);
    } else {
      setFilteredArticles(articles.filter(a => a.sentiment === sentimentFilter));
    }
  }, [articles, sentimentFilter]);

  const loadNews = async () => {
    setLoading(true);
    
    // Simulate API call - Replace with actual news API
    setTimeout(() => {
      const mockNews = generateMockNews(ticker);
      setArticles(mockNews);
      setLoading(false);
    }, 1000);
  };

  const generateMockNews = (symbol: string): NewsArticle[] => {
    const now = new Date();
    
    return [
      {
        id: '1',
        headline: `${symbol} Reports Strong Q3 Earnings, Beats Expectations by 15%`,
        summary: `${symbol} announced quarterly earnings that exceeded analyst expectations, with revenue up 23% year-over-year. The company raised guidance for the full year.`,
        source: 'Bloomberg',
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
        url: '#',
        sentiment: 'positive',
        sentimentScore: 0.85,
        impactScore: 92,
        relevance: 98,
        credibilityScore: 95,
        priceImpact: { change: 5.23, percentage: 3.2 },
        keywords: ['earnings', 'revenue', 'guidance', 'beat'],
        category: 'earnings'
      },
      {
        id: '2',
        headline: `Analyst Upgrades ${symbol} to 'Strong Buy', Sets $250 Price Target`,
        summary: 'Major investment bank upgrades rating citing strong fundamentals, market position, and growth trajectory. Raised price target from $210 to $250.',
        source: 'CNBC',
        timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000), // 5 hours ago
        url: '#',
        sentiment: 'positive',
        sentimentScore: 0.75,
        impactScore: 78,
        relevance: 92,
        credibilityScore: 88,
        priceImpact: { change: 2.15, percentage: 1.3 },
        keywords: ['analyst', 'upgrade', 'price target', 'buy'],
        category: 'analyst'
      },
      {
        id: '3',
        headline: `${symbol} Faces SEC Investigation Over Accounting Practices`,
        summary: 'The Securities and Exchange Commission has opened an investigation into the company\'s accounting methods. Management denies any wrongdoing.',
        source: 'Reuters',
        timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000), // 8 hours ago
        url: '#',
        sentiment: 'negative',
        sentimentScore: -0.82,
        impactScore: 88,
        relevance: 95,
        credibilityScore: 92,
        priceImpact: { change: -8.45, percentage: -5.1 },
        keywords: ['SEC', 'investigation', 'accounting', 'regulatory'],
        category: 'regulatory'
      },
      {
        id: '4',
        headline: `New Product Launch: ${symbol} Unveils Revolutionary AI Platform`,
        summary: 'Company announces new AI-powered platform that could transform the industry. Early customer feedback has been overwhelmingly positive.',
        source: 'TechCrunch',
        timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000), // 12 hours ago
        url: '#',
        sentiment: 'positive',
        sentimentScore: 0.68,
        impactScore: 65,
        relevance: 88,
        credibilityScore: 82,
        priceImpact: { change: 3.12, percentage: 1.9 },
        keywords: ['product', 'AI', 'launch', 'innovation'],
        category: 'product'
      },
      {
        id: '5',
        headline: `${symbol} CEO Announces Retirement, Succession Plan in Place`,
        summary: 'Long-time CEO will step down at year end. Board has named current COO as successor. Transition expected to be smooth.',
        source: 'Wall Street Journal',
        timestamp: new Date(now.getTime() - 18 * 60 * 60 * 1000), // 18 hours ago
        url: '#',
        sentiment: 'neutral',
        sentimentScore: 0.05,
        impactScore: 55,
        relevance: 85,
        credibilityScore: 90,
        keywords: ['CEO', 'retirement', 'succession', 'leadership'],
        category: 'other'
      },
      {
        id: '6',
        headline: `Market Volatility: ${symbol} Down 2% on Broader Market Concerns`,
        summary: 'Stock falls in line with broader market decline as investors worry about economic indicators. No company-specific news driving the move.',
        source: 'MarketWatch',
        timestamp: new Date(now.getTime() - 22 * 60 * 60 * 1000), // 22 hours ago
        url: '#',
        sentiment: 'negative',
        sentimentScore: -0.35,
        impactScore: 42,
        relevance: 65,
        credibilityScore: 78,
        priceImpact: { change: -3.21, percentage: -2.0 },
        keywords: ['market', 'volatility', 'decline', 'macro'],
        category: 'market'
      }
    ];
  };

  const calculateSummaryStats = () => {
    const positive = articles.filter(a => a.sentiment === 'positive').length;
    const negative = articles.filter(a => a.sentiment === 'negative').length;
    const neutral = articles.filter(a => a.sentiment === 'neutral').length;
    
    const avgSentiment = articles.length > 0
      ? articles.reduce((sum, a) => sum + a.sentimentScore, 0) / articles.length
      : 0;
    
    const avgImpact = articles.length > 0
      ? articles.reduce((sum, a) => sum + a.impactScore, 0) / articles.length
      : 0;

    return { positive, negative, neutral, avgSentiment, avgImpact };
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (hours < 1) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getImpactLevel = (score: number): string => {
    if (score >= 75) return 'high';
    if (score >= 50) return 'medium';
    return 'low';
  };

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '📈';
      case 'negative': return '📉';
      default: return '➖';
    }
  };

  const stats = calculateSummaryStats();

  return (
    <Container>
      <Header>
        <Title>
          📰 NEWS SENTIMENT
          <TickerBadge>{ticker}</TickerBadge>
        </Title>
        <Controls>
          <TimeframeSelector value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </TimeframeSelector>
          
          <FilterButton 
            $active={sentimentFilter === 'all'} 
            onClick={() => setSentimentFilter('all')}
          >
            ALL
          </FilterButton>
          <FilterButton 
            $active={sentimentFilter === 'positive'} 
            onClick={() => setSentimentFilter('positive')}
          >
            📈 POSITIVE
          </FilterButton>
          <FilterButton 
            $active={sentimentFilter === 'negative'} 
            onClick={() => setSentimentFilter('negative')}
          >
            📉 NEGATIVE
          </FilterButton>
          <FilterButton 
            $active={sentimentFilter === 'neutral'} 
            onClick={() => setSentimentFilter('neutral')}
          >
            ➖ NEUTRAL
          </FilterButton>
        </Controls>
      </Header>

      <SummaryBar>
        <SummaryItem>
          <SummaryLabel>Total Articles</SummaryLabel>
          <SummaryValue>{articles.length}</SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>Positive</SummaryLabel>
          <SummaryValue $color="#00ff00">{stats.positive}</SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>Negative</SummaryLabel>
          <SummaryValue $color="#ff0000">{stats.negative}</SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>Neutral</SummaryLabel>
          <SummaryValue $color="#ffff00">{stats.neutral}</SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>Avg Sentiment</SummaryLabel>
          <SummaryValue $color={stats.avgSentiment > 0 ? '#00ff00' : stats.avgSentiment < 0 ? '#ff0000' : '#ffff00'}>
            {(stats.avgSentiment * 100).toFixed(0)}%
          </SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>Avg Impact</SummaryLabel>
          <SummaryValue>{stats.avgImpact.toFixed(0)}/100</SummaryValue>
        </SummaryItem>
      </SummaryBar>

      <NewsFeed>
        {loading ? (
          <EmptyState>
            <LoadingSpinner />
            <div>Loading news articles...</div>
          </EmptyState>
        ) : filteredArticles.length === 0 ? (
          <EmptyState>
            <div>📰</div>
            <div>No news articles found</div>
          </EmptyState>
        ) : (
          filteredArticles.map(article => (
            <NewsCard 
              key={article.id} 
              $sentiment={article.sentiment}
              onClick={() => window.open(article.url, '_blank')}
            >
              <NewsHeader>
                <div style={{ flex: 1 }}>
                  <NewsHeadline>{article.headline}</NewsHeadline>
                  <NewsMeta>
                    <SentimentBadge $sentiment={article.sentiment}>
                      {getSentimentEmoji(article.sentiment)}
                      {article.sentiment.toUpperCase()}
                      <span style={{ marginLeft: '4px' }}>
                        ({(article.sentimentScore * 100).toFixed(0)}%)
                      </span>
                    </SentimentBadge>
                    
                    <Badge $color="#00cccc">{article.category.toUpperCase()}</Badge>
                    
                    <ImpactIndicator $level={getImpactLevel(article.impactScore)}>
                      <span>Impact:</span>
                      <ProgressBar>
                        <ProgressFill 
                          $percentage={article.impactScore} 
                          $color={
                            getImpactLevel(article.impactScore) === 'high' ? '#ff0000' : 
                            getImpactLevel(article.impactScore) === 'medium' ? '#ffff00' : 
                            '#00ff00'
                          }
                        />
                      </ProgressBar>
                      <span>{article.impactScore}/100</span>
                    </ImpactIndicator>
                    
                    <Badge $color="#ff00ff">
                      Credibility: {article.credibilityScore}%
                    </Badge>
                  </NewsMeta>
                </div>
              </NewsHeader>

              <NewsSummary>{article.summary}</NewsSummary>

              {article.priceImpact && (
                <PriceImpact $positive={article.priceImpact.change > 0}>
                  {article.priceImpact.change > 0 ? '▲' : '▼'}
                  ${Math.abs(article.priceImpact.change).toFixed(2)} 
                  ({article.priceImpact.percentage > 0 ? '+' : ''}
                  {article.priceImpact.percentage.toFixed(2)}%)
                </PriceImpact>
              )}

              <KeywordTags>
                {article.keywords.map(keyword => (
                  <KeywordTag key={keyword}>{keyword}</KeywordTag>
                ))}
              </KeywordTags>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <NewsSource>📡 {article.source}</NewsSource>
                <NewsTime>🕐 {formatTimestamp(article.timestamp)}</NewsTime>
              </div>
            </NewsCard>
          ))
        )}
      </NewsFeed>
    </Container>
  );
};

export default NewsWithSentiment;
