import { useState, useEffect } from 'react';
import styled from 'styled-components';

type AlertCondition = 'price_above' | 'price_below' | 'percent_change' | 'volume_spike' | 'rsi_overbought' | 'rsi_oversold';

interface Alert {
  id: string;
  ticker: string;
  condition: AlertCondition;
  threshold: number;
  enabled: boolean;
  soundEnabled: boolean;
  browserNotificationEnabled: boolean;
  soundType: 'beep' | 'chime' | 'bell' | 'alert';
  lastTriggered?: Date;
  triggerCount: number;
  createdAt: Date;
}

interface AlertHistory {
  id: string;
  alertId: string;
  ticker: string;
  condition: string;
  threshold: number;
  triggeredAt: Date;
  currentValue: number;
  message: string;
}

const AlertsEnhanced = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [history, setHistory] = useState<AlertHistory[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  // Form state
  const [newTicker, setNewTicker] = useState('');
  const [newCondition, setNewCondition] = useState<AlertCondition>('price_above');
  const [newThreshold, setNewThreshold] = useState('');
  const [newSoundEnabled, setNewSoundEnabled] = useState(true);
  const [newBrowserNotification, setNewBrowserNotification] = useState(true);
  const [newSoundType, setNewSoundType] = useState<'beep' | 'chime' | 'bell' | 'alert'>('chime');

  // Load alerts and history from localStorage
  useEffect(() => {
    const savedAlerts = localStorage.getItem('terminal-alerts');
    const savedHistory = localStorage.getItem('terminal-alert-history');
    
    if (savedAlerts) {
      const parsed = JSON.parse(savedAlerts);
      setAlerts(parsed.map((a: any) => ({
        ...a,
        createdAt: new Date(a.createdAt),
        lastTriggered: a.lastTriggered ? new Date(a.lastTriggered) : undefined
      })));
    }
    
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      setHistory(parsed.map((h: any) => ({
        ...h,
        triggeredAt: new Date(h.triggeredAt)
      })));
    }

    // Request notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          setNotificationPermission(permission);
        });
      }
    }
  }, []);

  // Save alerts to localStorage
  useEffect(() => {
    if (alerts.length > 0) {
      localStorage.setItem('terminal-alerts', JSON.stringify(alerts));
    }
  }, [alerts]);

  // Save history to localStorage
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('terminal-alert-history', JSON.stringify(history));
    }
  }, [history]);

  // Real-time alert monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      alerts.forEach(alert => {
        if (!alert.enabled) return;

        // Simulate checking alert conditions with mock data
        const mockPrice = 100 + Math.random() * 50;
        const mockPercentChange = (Math.random() - 0.5) * 10;
        const mockVolume = Math.random() * 100000000;
        const mockRSI = Math.random() * 100;

        let triggered = false;
        let currentValue = 0;
        let message = '';

        switch (alert.condition) {
          case 'price_above':
            currentValue = mockPrice;
            if (mockPrice > alert.threshold) {
              triggered = true;
              message = `${alert.ticker} price ($${mockPrice.toFixed(2)}) is above $${alert.threshold.toFixed(2)}`;
            }
            break;
          case 'price_below':
            currentValue = mockPrice;
            if (mockPrice < alert.threshold) {
              triggered = true;
              message = `${alert.ticker} price ($${mockPrice.toFixed(2)}) is below $${alert.threshold.toFixed(2)}`;
            }
            break;
          case 'percent_change':
            currentValue = mockPercentChange;
            if (Math.abs(mockPercentChange) > alert.threshold) {
              triggered = true;
              message = `${alert.ticker} changed ${mockPercentChange > 0 ? '+' : ''}${mockPercentChange.toFixed(2)}% (threshold: ${alert.threshold}%)`;
            }
            break;
          case 'volume_spike':
            currentValue = mockVolume;
            if (mockVolume > alert.threshold) {
              triggered = true;
              message = `${alert.ticker} volume (${(mockVolume / 1000000).toFixed(2)}M) exceeds ${(alert.threshold / 1000000).toFixed(2)}M`;
            }
            break;
          case 'rsi_overbought':
            currentValue = mockRSI;
            if (mockRSI > alert.threshold) {
              triggered = true;
              message = `${alert.ticker} RSI (${mockRSI.toFixed(2)}) is overbought (>${alert.threshold})`;
            }
            break;
          case 'rsi_oversold':
            currentValue = mockRSI;
            if (mockRSI < alert.threshold) {
              triggered = true;
              message = `${alert.ticker} RSI (${mockRSI.toFixed(2)}) is oversold (<${alert.threshold})`;
            }
            break;
        }

        if (triggered) {
          // Play sound
          if (alert.soundEnabled) {
            playSound(alert.soundType);
          }

          // Show browser notification
          if (alert.browserNotificationEnabled && notificationPermission === 'granted') {
            new Notification(`Alert: ${alert.ticker}`, {
              body: message,
              icon: '/terminal-icon.svg',
              badge: '/terminal-icon.svg'
            });
          }

          // Update alert
          setAlerts(prev => prev.map(a => 
            a.id === alert.id 
              ? { ...a, lastTriggered: new Date(), triggerCount: a.triggerCount + 1 }
              : a
          ));

          // Add to history
          const historyEntry: AlertHistory = {
            id: `history-${Date.now()}-${Math.random()}`,
            alertId: alert.id,
            ticker: alert.ticker,
            condition: getConditionLabel(alert.condition),
            threshold: alert.threshold,
            triggeredAt: new Date(),
            currentValue,
            message
          };
          setHistory(prev => [historyEntry, ...prev].slice(0, 100)); // Keep last 100
        }
      });
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [alerts, notificationPermission]);

  const playSound = (soundType: string) => {
    // Create audio context for generating sounds
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Configure sound based on type
    switch (soundType) {
      case 'beep':
        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.3;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
        break;
      case 'chime':
        oscillator.frequency.value = 1000;
        gainNode.gain.value = 0.2;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
        setTimeout(() => {
          const osc2 = audioContext.createOscillator();
          const gain2 = audioContext.createGain();
          osc2.connect(gain2);
          gain2.connect(audioContext.destination);
          osc2.frequency.value = 1200;
          gain2.gain.value = 0.2;
          osc2.start();
          osc2.stop(audioContext.currentTime + 0.2);
        }, 150);
        break;
      case 'bell':
        oscillator.frequency.value = 1500;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
        break;
      case 'alert':
        oscillator.frequency.value = 600;
        gainNode.gain.value = 0.4;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
        setTimeout(() => {
          const osc2 = audioContext.createOscillator();
          const gain2 = audioContext.createGain();
          osc2.connect(gain2);
          gain2.connect(audioContext.destination);
          osc2.frequency.value = 600;
          gain2.gain.value = 0.4;
          osc2.start();
          osc2.stop(audioContext.currentTime + 0.3);
        }, 400);
        break;
    }
  };

  const getConditionLabel = (condition: AlertCondition): string => {
    const labels: Record<AlertCondition, string> = {
      price_above: 'Price Above',
      price_below: 'Price Below',
      percent_change: 'Percent Change',
      volume_spike: 'Volume Spike',
      rsi_overbought: 'RSI Overbought',
      rsi_oversold: 'RSI Oversold'
    };
    return labels[condition];
  };

  const handleAddAlert = () => {
    if (!newTicker || !newThreshold) return;

    const alert: Alert = {
      id: `alert-${Date.now()}-${Math.random()}`,
      ticker: newTicker.toUpperCase(),
      condition: newCondition,
      threshold: parseFloat(newThreshold),
      enabled: true,
      soundEnabled: newSoundEnabled,
      browserNotificationEnabled: newBrowserNotification,
      soundType: newSoundType,
      triggerCount: 0,
      createdAt: new Date()
    };

    setAlerts(prev => [...prev, alert]);
    
    // Reset form
    setNewTicker('');
    setNewThreshold('');
    setShowAddModal(false);
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const handleToggleAlert = (id: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === id ? { ...a, enabled: !a.enabled } : a
    ));
  };

  const handleToggleSound = (id: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === id ? { ...a, soundEnabled: !a.soundEnabled } : a
    ));
  };

  const handleToggleBrowserNotification = (id: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === id ? { ...a, browserNotificationEnabled: !a.browserNotificationEnabled } : a
    ));
  };

  const handleTestSound = (soundType: string) => {
    playSound(soundType);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('terminal-alert-history');
  };

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <Container>
      <Header>
        <Title>ALERT MANAGER</Title>
        <Controls>
          <ControlButton onClick={() => setShowHistoryModal(true)}>
            VIEW HISTORY ({history.length})
          </ControlButton>
          <AddButton onClick={() => setShowAddModal(true)}>
            + NEW ALERT
          </AddButton>
        </Controls>
      </Header>

      <Stats>
        <StatItem>
          <StatLabel>TOTAL ALERTS</StatLabel>
          <StatValue>{alerts.length}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>ACTIVE ALERTS</StatLabel>
          <StatValue $active={true}>{alerts.filter(a => a.enabled).length}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>TRIGGERED TODAY</StatLabel>
          <StatValue $warning={true}>
            {history.filter(h => {
              const today = new Date();
              return h.triggeredAt.toDateString() === today.toDateString();
            }).length}
          </StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>NOTIFICATIONS</StatLabel>
          <StatValue $status={notificationPermission}>
            {notificationPermission === 'granted' ? 'ENABLED' : 
             notificationPermission === 'denied' ? 'BLOCKED' : 'PENDING'}
          </StatValue>
        </StatItem>
      </Stats>

      {alerts.length === 0 ? (
        <EmptyState>
          <EmptyIcon>🔔</EmptyIcon>
          <EmptyTitle>No Alerts Configured</EmptyTitle>
          <EmptyText>Create your first alert to get notified when market conditions are met.</EmptyText>
          <EmptyButton onClick={() => setShowAddModal(true)}>
            CREATE FIRST ALERT
          </EmptyButton>
        </EmptyState>
      ) : (
        <AlertList>
          {alerts.map(alert => (
            <AlertCard key={alert.id} $enabled={alert.enabled}>
              <AlertHeader>
                <AlertTicker>{alert.ticker}</AlertTicker>
                <AlertActions>
                  <IconButton 
                    onClick={() => handleToggleSound(alert.id)}
                    $active={alert.soundEnabled}
                    title={alert.soundEnabled ? 'Sound On' : 'Sound Off'}
                  >
                    {alert.soundEnabled ? '🔊' : '🔇'}
                  </IconButton>
                  <IconButton 
                    onClick={() => handleToggleBrowserNotification(alert.id)}
                    $active={alert.browserNotificationEnabled}
                    title={alert.browserNotificationEnabled ? 'Notifications On' : 'Notifications Off'}
                  >
                    {alert.browserNotificationEnabled ? '🔔' : '🔕'}
                  </IconButton>
                  <ToggleButton 
                    onClick={() => handleToggleAlert(alert.id)}
                    $enabled={alert.enabled}
                  >
                    {alert.enabled ? 'ENABLED' : 'DISABLED'}
                  </ToggleButton>
                  <DeleteButton onClick={() => handleDeleteAlert(alert.id)}>
                    DELETE
                  </DeleteButton>
                </AlertActions>
              </AlertHeader>

              <AlertBody>
                <AlertCondition>
                  <ConditionLabel>CONDITION:</ConditionLabel>
                  <ConditionValue>{getConditionLabel(alert.condition)}</ConditionValue>
                </AlertCondition>
                <AlertThreshold>
                  <ThresholdLabel>THRESHOLD:</ThresholdLabel>
                  <ThresholdValue>{alert.threshold}</ThresholdValue>
                </AlertThreshold>
                <AlertSound>
                  <SoundLabel>SOUND:</SoundLabel>
                  <SoundValue>{alert.soundType.toUpperCase()}</SoundValue>
                </AlertSound>
              </AlertBody>

              <AlertFooter>
                <AlertInfo>
                  Created {formatTimestamp(alert.createdAt)} • 
                  Triggered {alert.triggerCount} times
                  {alert.lastTriggered && ` • Last: ${formatTimestamp(alert.lastTriggered)}`}
                </AlertInfo>
              </AlertFooter>
            </AlertCard>
          ))}
        </AlertList>
      )}

      {showAddModal && (
        <ModalOverlay onClick={() => setShowAddModal(false)}>
          <ModalPanel onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>CREATE NEW ALERT</ModalTitle>
              <CloseButton onClick={() => setShowAddModal(false)}>CLOSE</CloseButton>
            </ModalHeader>

            <ModalBody>
              <FormGroup>
                <Label>TICKER SYMBOL</Label>
                <Input
                  type="text"
                  value={newTicker}
                  onChange={(e) => setNewTicker(e.target.value.toUpperCase())}
                  placeholder="e.g., AAPL"
                  maxLength={5}
                />
              </FormGroup>

              <FormGroup>
                <Label>ALERT CONDITION</Label>
                <Select value={newCondition} onChange={(e) => setNewCondition(e.target.value as AlertCondition)}>
                  <option value="price_above">Price Above</option>
                  <option value="price_below">Price Below</option>
                  <option value="percent_change">Percent Change (absolute)</option>
                  <option value="volume_spike">Volume Spike</option>
                  <option value="rsi_overbought">RSI Overbought</option>
                  <option value="rsi_oversold">RSI Oversold</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>THRESHOLD VALUE</Label>
                <Input
                  type="number"
                  value={newThreshold}
                  onChange={(e) => setNewThreshold(e.target.value)}
                  placeholder={
                    newCondition.includes('price') ? '150.00' :
                    newCondition.includes('percent') ? '5' :
                    newCondition.includes('volume') ? '50000000' :
                    '70'
                  }
                  step="0.01"
                />
                <Hint>
                  {newCondition.includes('price') && 'Enter price in dollars (e.g., 150.00)'}
                  {newCondition.includes('percent') && 'Enter percentage change (e.g., 5 for ±5%)'}
                  {newCondition.includes('volume') && 'Enter volume in shares (e.g., 50000000)'}
                  {newCondition.includes('rsi') && 'Enter RSI value 0-100 (e.g., 70 for overbought, 30 for oversold)'}
                </Hint>
              </FormGroup>

              <FormGroup>
                <Label>SOUND TYPE</Label>
                <SoundSelector>
                  {(['beep', 'chime', 'bell', 'alert'] as const).map(sound => (
                    <SoundOption
                      key={sound}
                      $selected={newSoundType === sound}
                      onClick={() => setNewSoundType(sound)}
                    >
                      <SoundName>{sound.toUpperCase()}</SoundName>
                      <TestButton onClick={(e) => {
                        e.stopPropagation();
                        handleTestSound(sound);
                      }}>
                        TEST
                      </TestButton>
                    </SoundOption>
                  ))}
                </SoundSelector>
              </FormGroup>

              <FormGroup>
                <CheckboxGroup>
                  <Checkbox
                    type="checkbox"
                    checked={newSoundEnabled}
                    onChange={(e) => setNewSoundEnabled(e.target.checked)}
                    id="sound-enabled"
                  />
                  <CheckboxLabel htmlFor="sound-enabled">
                    Enable sound notifications
                  </CheckboxLabel>
                </CheckboxGroup>
              </FormGroup>

              <FormGroup>
                <CheckboxGroup>
                  <Checkbox
                    type="checkbox"
                    checked={newBrowserNotification}
                    onChange={(e) => setNewBrowserNotification(e.target.checked)}
                    id="browser-notification"
                  />
                  <CheckboxLabel htmlFor="browser-notification">
                    Enable browser push notifications
                  </CheckboxLabel>
                </CheckboxGroup>
              </FormGroup>

              <CreateButton 
                onClick={handleAddAlert}
                disabled={!newTicker || !newThreshold}
              >
                CREATE ALERT
              </CreateButton>
            </ModalBody>
          </ModalPanel>
        </ModalOverlay>
      )}

      {showHistoryModal && (
        <ModalOverlay onClick={() => setShowHistoryModal(false)}>
          <ModalPanel $large onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>ALERT HISTORY</ModalTitle>
              <div style={{ display: 'flex', gap: '10px' }}>
                <ClearButton onClick={handleClearHistory}>CLEAR ALL</ClearButton>
                <CloseButton onClick={() => setShowHistoryModal(false)}>CLOSE</CloseButton>
              </div>
            </ModalHeader>

            <HistoryList>
              {history.length === 0 ? (
                <EmptyHistory>No alert history yet</EmptyHistory>
              ) : (
                history.map(entry => (
                  <HistoryEntry key={entry.id}>
                    <HistoryTime>{formatTimestamp(entry.triggeredAt)}</HistoryTime>
                    <HistoryTicker>{entry.ticker}</HistoryTicker>
                    <HistoryMessage>{entry.message}</HistoryMessage>
                  </HistoryEntry>
                ))
              )}
            </HistoryList>
          </ModalPanel>
        </ModalOverlay>
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
  gap: 10px;
`;

const ControlButton = styled.button`
  padding: 8px 15px;
  background: transparent;
  color: #00ff00;
  border: 1px solid #00ff00;
  border-radius: 3px;
  font-size: 11px;
  font-weight: bold;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  transition: all 0.2s;

  &:hover {
    background: #003300;
  }
`;

const AddButton = styled(ControlButton)`
  background: #00ff00;
  color: #000000;

  &:hover {
    background: #00cc00;
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

const StatValue = styled.div<{ $active?: boolean; $warning?: boolean; $status?: string }>`
  font-size: 16px;
  font-weight: bold;
  color: ${props => 
    props.$active ? '#00ff00' : 
    props.$warning ? '#ffff00' : 
    props.$status === 'granted' ? '#00ff00' :
    props.$status === 'denied' ? '#ff0000' :
    props.$status === 'default' ? '#ffff00' :
    '#00ff00'
  };
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 20px;
  padding: 40px;
`;

const EmptyIcon = styled.div`
  font-size: 64px;
`;

const EmptyTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 1px;
`;

const EmptyText = styled.div`
  font-size: 12px;
  color: #888888;
  text-align: center;
  max-width: 400px;
`;

const EmptyButton = styled.button`
  padding: 12px 30px;
  background: #00ff00;
  color: #000000;
  border: none;
  border-radius: 3px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  transition: all 0.2s;

  &:hover {
    background: #00cc00;
    transform: scale(1.05);
  }
`;

const AlertList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const AlertCard = styled.div<{ $enabled: boolean }>`
  background: ${props => props.$enabled ? '#0a0a0a' : '#050505'};
  border: 1px solid ${props => props.$enabled ? '#00ff00' : '#333333'};
  border-radius: 5px;
  padding: 15px;
  opacity: ${props => props.$enabled ? 1 : 0.6};
  transition: all 0.2s;

  &:hover {
    border-color: #00ff00;
    opacity: 1;
  }
`;

const AlertHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const AlertTicker = styled.div`
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 1px;
`;

const AlertActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const IconButton = styled.button<{ $active?: boolean }>`
  padding: 4px 8px;
  background: transparent;
  border: 1px solid ${props => props.$active ? '#00ff00' : '#333333'};
  border-radius: 3px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  opacity: ${props => props.$active ? 1 : 0.5};

  &:hover {
    opacity: 1;
    border-color: #00ff00;
  }
`;

const ToggleButton = styled.button<{ $enabled: boolean }>`
  padding: 6px 12px;
  background: ${props => props.$enabled ? '#00ff00' : '#333333'};
  color: ${props => props.$enabled ? '#000000' : '#888888'};
  border: none;
  border-radius: 3px;
  font-size: 10px;
  font-weight: bold;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$enabled ? '#00cc00' : '#444444'};
  }
`;

const DeleteButton = styled.button`
  padding: 6px 12px;
  background: transparent;
  color: #ff0000;
  border: 1px solid #ff0000;
  border-radius: 3px;
  font-size: 10px;
  font-weight: bold;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  transition: all 0.2s;

  &:hover {
    background: #ff0000;
    color: #ffffff;
  }
`;

const AlertBody = styled.div`
  display: flex;
  gap: 20px;
  padding: 10px 0;
  border-top: 1px solid #003300;
  border-bottom: 1px solid #003300;
`;

const AlertCondition = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const ConditionLabel = styled.div`
  font-size: 9px;
  color: #888888;
`;

const ConditionValue = styled.div`
  font-size: 12px;
  font-weight: bold;
`;

const AlertThreshold = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const ThresholdLabel = styled.div`
  font-size: 9px;
  color: #888888;
`;

const ThresholdValue = styled.div`
  font-size: 12px;
  font-weight: bold;
  color: #ffff00;
`;

const AlertSound = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const SoundLabel = styled.div`
  font-size: 9px;
  color: #888888;
`;

const SoundValue = styled.div`
  font-size: 12px;
  font-weight: bold;
`;

const AlertFooter = styled.div`
  margin-top: 10px;
`;

const AlertInfo = styled.div`
  font-size: 10px;
  color: #666666;
`;

const ModalOverlay = styled.div`
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

const ModalPanel = styled.div<{ $large?: boolean }>`
  background: #000000;
  border: 2px solid #00ff00;
  border-radius: 5px;
  width: ${props => props.$large ? '90%' : '600px'};
  max-width: ${props => props.$large ? '1000px' : '600px'};
  max-height: 80%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #0a0a0a;
  border-bottom: 1px solid #00ff00;
`;

const ModalTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 2px;
`;

const CloseButton = styled.button`
  padding: 8px 20px;
  background: transparent;
  color: #00ff00;
  border: 1px solid #00ff00;
  border-radius: 3px;
  font-size: 11px;
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

const ClearButton = styled(CloseButton)`
  &:hover {
    background: #ffff00;
    border-color: #ffff00;
    color: #000000;
  }
`;

const ModalBody = styled.div`
  padding: 20px;
  overflow-y: auto;
  flex: 1;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 11px;
  font-weight: bold;
  margin-bottom: 8px;
  letter-spacing: 1px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  background: #0a0a0a;
  color: #00ff00;
  border: 1px solid #00ff00;
  border-radius: 3px;
  font-size: 12px;
  font-family: 'Courier New', monospace;

  &:focus {
    outline: none;
    border-color: #00ff00;
    box-shadow: 0 0 5px #00ff00;
  }

  &::placeholder {
    color: #666666;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  background: #0a0a0a;
  color: #00ff00;
  border: 1px solid #00ff00;
  border-radius: 3px;
  font-size: 12px;
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

const Hint = styled.div`
  font-size: 10px;
  color: #666666;
  margin-top: 5px;
`;

const SoundSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const SoundOption = styled.div<{ $selected: boolean }>`
  padding: 12px;
  background: ${props => props.$selected ? '#003300' : '#0a0a0a'};
  border: 1px solid ${props => props.$selected ? '#00ff00' : '#333333'};
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    border-color: #00ff00;
    background: #003300;
  }
`;

const SoundName = styled.div`
  font-size: 12px;
  font-weight: bold;
`;

const TestButton = styled.button`
  padding: 4px 10px;
  background: #00ff00;
  color: #000000;
  border: none;
  border-radius: 3px;
  font-size: 9px;
  font-weight: bold;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  transition: all 0.2s;

  &:hover {
    background: #00cc00;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-size: 12px;
  cursor: pointer;
`;

const CreateButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #00ff00;
  color: #000000;
  border: none;
  border-radius: 3px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #00cc00;
    transform: scale(1.02);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const HistoryList = styled.div`
  padding: 20px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const EmptyHistory = styled.div`
  text-align: center;
  color: #666666;
  padding: 40px;
  font-size: 14px;
`;

const HistoryEntry = styled.div`
  padding: 12px;
  background: #0a0a0a;
  border: 1px solid #003300;
  border-radius: 3px;
  display: flex;
  gap: 15px;
  align-items: center;
  transition: all 0.2s;

  &:hover {
    border-color: #00ff00;
  }
`;

const HistoryTime = styled.div`
  font-size: 10px;
  color: #666666;
  min-width: 80px;
`;

const HistoryTicker = styled.div`
  font-size: 12px;
  font-weight: bold;
  min-width: 60px;
`;

const HistoryMessage = styled.div`
  font-size: 11px;
  color: #00ff00;
  flex: 1;
`;

export default AlertsEnhanced;
