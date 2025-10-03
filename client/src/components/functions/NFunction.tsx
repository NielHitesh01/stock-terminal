import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import NewsSentimentChart from '../NewsSentimentChart';

const Container = styled.div`
  padding: 10px;
  color: #00ff00;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
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

const HeaderTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LiveBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  color: #00ff00;
  background-color: #0a0a0a;
  padding: 4px 8px;
  border: 1px solid #00ff00;
  border-radius: 3px;
`;

const PulsingDot = styled.div`
  width: 6px;
  height: 6px;
  background-color: #00ff00;
  border-radius: 50%;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const RefreshInfo = styled.div`
  font-size: 9px;
  color: #666666;
`;

const ArticleCard = styled.div`
  background-color: #0a0a0a;
  border: 1px solid #333333;
  padding: 12px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #00ff00;
    background-color: #0f0f0f;
  }
`;

const ArticleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const ArticleTitle = styled.div`
  font-size: 13px;
  font-weight: bold;
  color: #00ffff;
  line-height: 1.4;
  flex: 1;
  margin-right: 10px;
`;

const ArticleMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
`;

const Source = styled.div`
  font-size: 10px;
  color: #ffff00;
  text-transform: uppercase;
  background-color: #1a1a1a;
  padding: 2px 6px;
  border-radius: 2px;
`;

const NewBadge = styled.div`
  font-size: 9px;
  color: #000000;
  background-color: #00ff00;
  padding: 2px 6px;
  border-radius: 2px;
  font-weight: bold;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const Timestamp = styled.div`
  font-size: 9px;
  color: #666666;
`;

const Description = styled.div`
  font-size: 11px;
  color: #00ff00;
  line-height: 1.5;
  margin-bottom: 8px;
`;

const ReadMore = styled.div`
  font-size: 10px;
  color: #00ffff;
  text-decoration: underline;
  
  &:hover {
    color: #ffff00;
  }
`;

const NoData = styled.div`
  color: #666666;
  font-style: italic;
  padding: 20px;
  text-align: center;
`;

const ResultCount = styled.div`
  font-size: 11px;
  color: #666666;
  margin-bottom: 15px;
`;

interface NFunctionProps {
  ticker: string;
  data: any;
}

const NFunction = ({ ticker, data: initialData }: NFunctionProps) => {
  const [newsData, setNewsData] = useState(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [countdown, setCountdown] = useState(60);
  
  const REFRESH_INTERVAL = 60000; // 60 seconds

  // Fetch news data
  const fetchNews = async (showLoading = false) => {
    if (showLoading) setIsRefreshing(true);
    
    try {
      const response = await fetch(`/api/execute?ticker=${ticker}&function=N`);
      const result = await response.json();
      
      if (result.success && result.data) {
        setNewsData(result.data);
        setLastUpdate(new Date());
        setCountdown(60);
      }
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      if (showLoading) setIsRefreshing(false);
    }
  };

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const refreshTimer = setInterval(() => {
      fetchNews(false);
    }, REFRESH_INTERVAL);

    return () => clearInterval(refreshTimer);
  }, [ticker]);

  // Countdown timer
  useEffect(() => {
    const countdownTimer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) return 60;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, []);

  if (!newsData) {
    return <NoData>No news data available for {ticker}</NoData>;
  }

  const articles = newsData.articles || [];
  const totalResults = newsData.totalResults || articles.length;

  const formatTimestamp = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 60) {
        return `${diffMins}m ago`;
      } else if (diffHours < 24) {
        return `${diffHours}h ago`;
      } else if (diffDays < 7) {
        return `${diffDays}d ago`;
      } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
    } catch {
      return 'Recently';
    }
  };

  const isNewArticle = (timestamp: string): boolean => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMins = Math.floor((now.getTime() - date.getTime()) / 60000);
      return diffMins <= 5; // Article is "new" if published within last 5 minutes
    } catch {
      return false;
    }
  };

  const handleArticleClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleManualRefresh = () => {
    fetchNews(true);
  };

  return (
    <Container>
      {/* News Sentiment Impact Chart */}
      <NewsSentimentChart ticker={ticker} data={newsData} />
      
      <Header>
        <HeaderTitle>
          <div>{ticker} - Latest News</div>
          <LiveBadge>
            <PulsingDot /> LIVE
          </LiveBadge>
        </HeaderTitle>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          <RefreshInfo>
            Next refresh: {countdown}s
          </RefreshInfo>
          <RefreshInfo 
            onClick={handleManualRefresh}
            style={{ 
              cursor: 'pointer', 
              color: isRefreshing ? '#ffff00' : '#00ffff',
              textDecoration: 'underline'
            }}
          >
            {isRefreshing ? '⟳ Refreshing...' : '↻ Refresh now'}
          </RefreshInfo>
        </div>
      </Header>
      
      {totalResults > 0 && (
        <ResultCount>
          Showing {articles.length} of {totalResults} articles
        </ResultCount>
      )}

      {articles.length === 0 ? (
        <NoData>No recent news articles found for {ticker}</NoData>
      ) : (
        articles.map((article: any, index: number) => (
          <ArticleCard key={index} onClick={() => handleArticleClick(article.url)}>
            <ArticleHeader>
              <ArticleTitle>{article.title}</ArticleTitle>
              <ArticleMeta>
                {isNewArticle(article.publishedAt) && <NewBadge>NEW</NewBadge>}
                <Source>{article.source}</Source>
                <Timestamp>{formatTimestamp(article.publishedAt)}</Timestamp>
              </ArticleMeta>
            </ArticleHeader>
            {article.description && (
              <Description>{article.description}</Description>
            )}
            <ReadMore>Read full article →</ReadMore>
          </ArticleCard>
        ))
      )}
    </Container>
  );
};

export default NFunction;
