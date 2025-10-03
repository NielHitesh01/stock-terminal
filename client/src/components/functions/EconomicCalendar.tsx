import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// ============================================================================
// INTERFACES
// ============================================================================

interface EconomicEvent {
  id: string;
  date: Date;
  time: string;
  title: string;
  type: 'earnings' | 'fed' | 'economic' | 'dividend' | 'ipo';
  ticker?: string;
  importance: 'high' | 'medium' | 'low';
  description: string;
  estimate?: string;
  previous?: string;
  actual?: string;
}

type ViewMode = 'calendar' | 'list';
type FilterImportance = 'all' | 'high' | 'medium' | 'low';
type FilterType = 'all' | 'earnings' | 'fed' | 'economic' | 'dividend' | 'ipo';

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

const HeaderTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #00ff00;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Controls = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const Button = styled.button<{ $active?: boolean }>`
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

const Select = styled.select`
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

const FiltersBar = styled.div`
  display: flex;
  gap: 15px;
  padding: 15px 20px;
  background: #0a0a0a;
  border-bottom: 1px solid #333333;
  flex-wrap: wrap;
  align-items: center;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const FilterLabel = styled.div`
  font-size: 11px;
  color: #00ff00;
  opacity: 0.7;
  text-transform: uppercase;
`;

const FilterButton = styled.button<{ $active?: boolean }>`
  background: ${props => props.$active ? '#00ff00' : 'transparent'};
  color: ${props => props.$active ? '#000000' : '#00ff00'};
  border: 1px solid #00ff00;
  padding: 4px 12px;
  border-radius: 3px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  transition: all 0.2s;

  &:hover {
    background: #00ff00;
    color: #000000;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;

  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-track {
    background: #0a0a0a;
  }

  &::-webkit-scrollbar-thumb {
    background: #00ff00;
    border-radius: 6px;
  }
`;

// Calendar View Components
const CalendarGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const MonthHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const MonthTitle = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #00ff00;
`;

const NavButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const NavButton = styled.button`
  background: transparent;
  border: 2px solid #00ff00;
  color: #00ff00;
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
  }
`;

const WeekdayHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  margin-bottom: 10px;
`;

const Weekday = styled.div`
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  color: #00ff00;
  padding: 10px;
  background: #1a1a1a;
  border-radius: 4px;
`;

const CalendarDays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
`;

const DayCell = styled.div<{ $isToday?: boolean; $isOtherMonth?: boolean; $hasEvents?: boolean }>`
  background: ${props => 
    props.$isToday ? 'linear-gradient(135deg, #00ff00 0%, #00cc00 100%)' :
    props.$hasEvents ? '#1a1a1a' : '#0a0a0a'
  };
  border: 2px solid ${props => 
    props.$isToday ? '#00ff00' :
    props.$hasEvents ? '#00ff00' : '#333333'
  };
  border-radius: 8px;
  padding: 10px;
  min-height: 120px;
  cursor: ${props => props.$hasEvents ? 'pointer' : 'default'};
  opacity: ${props => props.$isOtherMonth ? 0.3 : 1};
  transition: all 0.2s;

  &:hover {
    ${props => props.$hasEvents && `
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 255, 0, 0.3);
    `}
  }
`;

const DayNumber = styled.div<{ $isToday?: boolean }>`
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.$isToday ? '#000000' : '#00ff00'};
  margin-bottom: 8px;
`;

const EventDot = styled.div<{ $importance: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${props => 
    props.$importance === 'high' ? '#ff0000' :
    props.$importance === 'medium' ? '#ffff00' :
    '#00ff00'
  };
  display: inline-block;
  margin-right: 4px;
`;

const EventPreview = styled.div`
  font-size: 10px;
  color: #00ff00;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
`;

const EventCount = styled.div`
  font-size: 10px;
  color: #00ff00;
  opacity: 0.7;
  margin-top: 4px;
`;

// List View Components
const EventsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const EventCard = styled.div<{ $importance: string }>`
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  border-left: 4px solid ${props => 
    props.$importance === 'high' ? '#ff0000' :
    props.$importance === 'medium' ? '#ffff00' :
    '#00ff00'
  };
  border-radius: 8px;
  padding: 15px;
  transition: all 0.3s;

  &:hover {
    transform: translateX(5px);
    box-shadow: 0 4px 20px rgba(0, 255, 0, 0.2);
  }
`;

const EventHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
`;

const EventTitleSection = styled.div`
  flex: 1;
`;

const EventTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #00ff00;
  margin-bottom: 5px;
`;

const EventMeta = styled.div`
  display: flex;
  gap: 15px;
  font-size: 11px;
  color: #00ff00;
  opacity: 0.7;
`;

const EventBadges = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Badge = styled.span<{ $type?: string; $importance?: string }>`
  background: ${props => 
    props.$importance === 'high' ? '#ff0000' :
    props.$importance === 'medium' ? '#ffff00' :
    props.$type === 'earnings' ? '#00ffff' :
    props.$type === 'fed' ? '#ff00ff' :
    props.$type === 'economic' ? '#ffff00' :
    '#00ff00'
  };
  color: #000000;
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
`;

const EventDescription = styled.div`
  font-size: 13px;
  color: #00ff00;
  opacity: 0.8;
  line-height: 1.5;
  margin-bottom: 10px;
`;

const EventDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #333333;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const DetailLabel = styled.div`
  font-size: 10px;
  color: #00ff00;
  opacity: 0.7;
  text-transform: uppercase;
`;

const DetailValue = styled.div`
  font-size: 12px;
  color: #00ff00;
  font-weight: bold;
`;

const Countdown = styled.div<{ $urgent?: boolean }>`
  font-size: 14px;
  color: ${props => props.$urgent ? '#ff0000' : '#00ff00'};
  font-weight: bold;
  text-align: right;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #00ff00;
  opacity: 0.5;
  gap: 15px;
`;

const EmptyText = styled.div`
  font-size: 16px;
  text-align: center;
`;

// ============================================================================
// COMPONENT
// ============================================================================

const EconomicCalendar: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EconomicEvent[]>([]);
  const [filterImportance, setFilterImportance] = useState<FilterImportance>('all');
  const [filterType, setFilterType] = useState<FilterType>('all');

  // Generate mock events
  useEffect(() => {
    const mockEvents = generateMockEvents();
    setEvents(mockEvents);
  }, []);

  // Filter events
  useEffect(() => {
    let filtered = [...events];

    if (filterImportance !== 'all') {
      filtered = filtered.filter(e => e.importance === filterImportance);
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(e => e.type === filterType);
    }

    setFilteredEvents(filtered);
  }, [events, filterImportance, filterType]);

  const generateMockEvents = (): EconomicEvent[] => {
    const now = new Date();
    const events: EconomicEvent[] = [];

    // Earnings events
    const earningsStocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX'];
    earningsStocks.forEach((ticker, i) => {
      const date = new Date(now);
      date.setDate(now.getDate() + i * 3);
      events.push({
        id: `earnings-${i}`,
        date,
        time: '16:00',
        title: `${ticker} Quarterly Earnings`,
        type: 'earnings',
        ticker,
        importance: i < 3 ? 'high' : 'medium',
        description: `${ticker} reports Q3 2025 earnings. Analysts expect EPS growth and revenue guidance.`,
        estimate: '$2.45 EPS',
        previous: '$2.21 EPS',
      });
    });

    // Fed meetings
    const fedDate = new Date(now);
    fedDate.setDate(now.getDate() + 15);
    events.push({
      id: 'fed-1',
      date: fedDate,
      time: '14:00',
      title: 'Federal Reserve FOMC Meeting',
      type: 'fed',
      importance: 'high',
      description: 'Federal Open Market Committee announces interest rate decision and economic outlook.',
      estimate: 'No change expected',
      previous: '5.25-5.50%',
    });

    // Economic data
    const economicEvents = [
      { days: 2, title: 'CPI Inflation Data', time: '08:30', importance: 'high' as const, est: '3.2% YoY', prev: '3.0% YoY' },
      { days: 5, title: 'Non-Farm Payrolls', time: '08:30', importance: 'high' as const, est: '185K jobs', prev: '209K jobs' },
      { days: 7, title: 'Retail Sales Report', time: '08:30', importance: 'medium' as const, est: '0.3% MoM', prev: '0.7% MoM' },
      { days: 10, title: 'GDP Growth Rate', time: '08:30', importance: 'high' as const, est: '2.4% QoQ', prev: '2.1% QoQ' },
      { days: 12, title: 'ISM Manufacturing PMI', time: '10:00', importance: 'medium' as const, est: '48.5', prev: '47.6' },
      { days: 14, title: 'Consumer Confidence Index', time: '10:00', importance: 'low' as const, est: '101.5', prev: '99.7' },
    ];

    economicEvents.forEach((event, i) => {
      const date = new Date(now);
      date.setDate(now.getDate() + event.days);
      events.push({
        id: `econ-${i}`,
        date,
        time: event.time,
        title: event.title,
        type: 'economic',
        importance: event.importance,
        description: `${event.title} release. Market-moving economic indicator.`,
        estimate: event.est,
        previous: event.prev,
      });
    });

    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const calculateCountdown = (eventDate: Date, eventTime: string): string => {
    const now = new Date();
    const [hours, minutes] = eventTime.split(':').map(Number);
    const eventDateTime = new Date(eventDate);
    eventDateTime.setHours(hours, minutes, 0, 0);

    const diff = eventDateTime.getTime() - now.getTime();
    
    if (diff < 0) return 'Past';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hrs = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hrs}h`;
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days: Date[] = [];
    
    // Add days from previous month to fill first week
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = new Date(year, month, -i);
      days.push(day);
    }
    
    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    // Add days from next month to fill last week
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    return days;
  };

  const getEventsForDay = (day: Date): EconomicEvent[] => {
    return filteredEvents.filter(event => 
      event.date.getDate() === day.getDate() &&
      event.date.getMonth() === day.getMonth() &&
      event.date.getFullYear() === day.getFullYear()
    );
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentDate.getMonth() &&
           date.getFullYear() === currentDate.getFullYear();
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <Container>
      <Header>
        <HeaderTitle>ECONOMIC CALENDAR</HeaderTitle>
        <Controls>
          <Button $active={viewMode === 'calendar'} onClick={() => setViewMode('calendar')}>
            CALENDAR
          </Button>
          <Button $active={viewMode === 'list'} onClick={() => setViewMode('list')}>
            LIST
          </Button>
        </Controls>
      </Header>

      <FiltersBar>
        <FilterGroup>
          <FilterLabel>Importance:</FilterLabel>
          <FilterButton $active={filterImportance === 'all'} onClick={() => setFilterImportance('all')}>
            ALL
          </FilterButton>
          <FilterButton $active={filterImportance === 'high'} onClick={() => setFilterImportance('high')}>
            HIGH
          </FilterButton>
          <FilterButton $active={filterImportance === 'medium'} onClick={() => setFilterImportance('medium')}>
            MEDIUM
          </FilterButton>
          <FilterButton $active={filterImportance === 'low'} onClick={() => setFilterImportance('low')}>
            LOW
          </FilterButton>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Type:</FilterLabel>
          <FilterButton $active={filterType === 'all'} onClick={() => setFilterType('all')}>
            ALL
          </FilterButton>
          <FilterButton $active={filterType === 'earnings'} onClick={() => setFilterType('earnings')}>
            EARNINGS
          </FilterButton>
          <FilterButton $active={filterType === 'fed'} onClick={() => setFilterType('fed')}>
            FED
          </FilterButton>
          <FilterButton $active={filterType === 'economic'} onClick={() => setFilterType('economic')}>
            ECONOMIC
          </FilterButton>
        </FilterGroup>
      </FiltersBar>

      <ContentArea>
        {viewMode === 'calendar' ? (
          <CalendarGrid>
            <MonthHeader>
              <MonthTitle>{monthName}</MonthTitle>
              <NavButtons>
                <NavButton onClick={goToPreviousMonth}>PREV</NavButton>
                <NavButton onClick={goToToday}>TODAY</NavButton>
                <NavButton onClick={goToNextMonth}>NEXT</NavButton>
              </NavButtons>
            </MonthHeader>

            <WeekdayHeader>
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                <Weekday key={day}>{day}</Weekday>
              ))}
            </WeekdayHeader>

            <CalendarDays>
              {getDaysInMonth(currentDate).map((day, index) => {
                const dayEvents = getEventsForDay(day);
                const hasEvents = dayEvents.length > 0;
                const isTodayCell = isToday(day);
                const isOtherMonth = !isCurrentMonth(day);

                return (
                  <DayCell 
                    key={index} 
                    $isToday={isTodayCell}
                    $isOtherMonth={isOtherMonth}
                    $hasEvents={hasEvents}
                  >
                    <DayNumber $isToday={isTodayCell}>{day.getDate()}</DayNumber>
                    {dayEvents.slice(0, 3).map(event => (
                      <EventPreview key={event.id}>
                        <EventDot $importance={event.importance} />
                        {event.time} {event.ticker || event.title.substring(0, 15)}
                      </EventPreview>
                    ))}
                    {dayEvents.length > 3 && (
                      <EventCount>+{dayEvents.length - 3} more</EventCount>
                    )}
                  </DayCell>
                );
              })}
            </CalendarDays>
          </CalendarGrid>
        ) : (
          <EventsList>
            {filteredEvents.length === 0 ? (
              <EmptyState>
                <EmptyText>No events match your filters</EmptyText>
              </EmptyState>
            ) : (
              filteredEvents.map(event => {
                const countdown = calculateCountdown(event.date, event.time);
                const isUrgent = countdown !== 'Past' && !countdown.includes('d');

                return (
                  <EventCard key={event.id} $importance={event.importance}>
                    <EventHeader>
                      <EventTitleSection>
                        <EventTitle>{event.title}</EventTitle>
                        <EventMeta>
                          <span>{event.date.toLocaleDateString()}</span>
                          <span>{event.time}</span>
                          {event.ticker && <span>TICKER: {event.ticker}</span>}
                        </EventMeta>
                      </EventTitleSection>
                      <Countdown $urgent={isUrgent}>{countdown}</Countdown>
                    </EventHeader>

                    <EventBadges>
                      <Badge $importance={event.importance}>{event.importance}</Badge>
                      <Badge $type={event.type}>{event.type}</Badge>
                    </EventBadges>

                    <EventDescription>{event.description}</EventDescription>

                    {(event.estimate || event.previous || event.actual) && (
                      <EventDetails>
                        {event.estimate && (
                          <DetailItem>
                            <DetailLabel>Estimate</DetailLabel>
                            <DetailValue>{event.estimate}</DetailValue>
                          </DetailItem>
                        )}
                        {event.previous && (
                          <DetailItem>
                            <DetailLabel>Previous</DetailLabel>
                            <DetailValue>{event.previous}</DetailValue>
                          </DetailItem>
                        )}
                        {event.actual && (
                          <DetailItem>
                            <DetailLabel>Actual</DetailLabel>
                            <DetailValue>{event.actual}</DetailValue>
                          </DetailItem>
                        )}
                      </EventDetails>
                    )}
                  </EventCard>
                );
              })
            )}
          </EventsList>
        )}
      </ContentArea>
    </Container>
  );
};

export default EconomicCalendar;
