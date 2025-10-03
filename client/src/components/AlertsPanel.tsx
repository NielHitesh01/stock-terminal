import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { alertApi, Alert } from '../services/api';

interface AlertsPanelProps {
  onClose: () => void;
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ onClose }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // New alert form
  const [newAlert, setNewAlert] = useState({
    ticker: '',
    type: 'PRICE_ABOVE' as Alert['type'],
    threshold: ''
  });

  // Load alerts on mount
  useEffect(() => {
    loadAlerts();
    requestNotificationPermission();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(() => {
      loadAlerts();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Check for triggered alerts and show notifications
  useEffect(() => {
    const triggeredAlerts = alerts.filter(
      a => a.status === 'TRIGGERED' && !a.notificationSent
    );

    triggeredAlerts.forEach(alert => {
      showNotification(alert);
    });
  }, [alerts]);

  // Request browser notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  // Show browser notification
  const showNotification = (alert: Alert) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Stock Alert Triggered! 🚨', {
        body: alert.message || `${alert.ticker} ${alert.type} ${alert.threshold}`,
        icon: '/terminal-icon.svg',
        tag: alert.id,
        requireInteraction: true
      });
    }
  };

  // Load all alerts
  const loadAlerts = async () => {
    try {
      const data = await alertApi.getAll();
      setAlerts(data);
      setLoading(false);
    } catch (error: any) {
      showMessage('error', error.message);
      setLoading(false);
    }
  };

  // Show message
  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  // Handle create alert
  const handleCreateAlert = async () => {
    if (!newAlert.ticker || !newAlert.threshold) {
      showMessage('error', 'Ticker and threshold are required');
      return;
    }

    try {
      await alertApi.create({
        ticker: newAlert.ticker.toUpperCase(),
        type: newAlert.type,
        threshold: parseFloat(newAlert.threshold)
      });

      setNewAlert({ ticker: '', type: 'PRICE_ABOVE', threshold: '' });
      showMessage('success', 'Alert created successfully');
      loadAlerts();
    } catch (error: any) {
      showMessage('error', error.message);
    }
  };

  // Handle toggle alert
  const handleToggle = async (id: string) => {
    try {
      await alertApi.toggle(id);
      showMessage('success', 'Alert toggled');
      loadAlerts();
    } catch (error: any) {
      showMessage('error', error.message);
    }
  };

  // Handle delete alert
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this alert?')) {
      return;
    }

    try {
      await alertApi.delete(id);
      showMessage('success', 'Alert deleted');
      loadAlerts();
    } catch (error: any) {
      showMessage('error', error.message);
    }
  };

  // Handle clear triggered
  const handleClearTriggered = async () => {
    try {
      const result = await alertApi.clearTriggered();
      showMessage('success', `Cleared ${result.count} triggered alerts`);
      loadAlerts();
    } catch (error: any) {
      showMessage('error', error.message);
    }
  };

  // Format alert type for display
  const formatAlertType = (type: Alert['type']): string => {
    const typeMap: Record<Alert['type'], string> = {
      'PRICE_ABOVE': 'Price Above',
      'PRICE_BELOW': 'Price Below',
      'RSI_ABOVE': 'RSI Above',
      'RSI_BELOW': 'RSI Below',
      'VOLUME_SPIKE': 'Volume Spike'
    };
    return typeMap[type] || type;
  };

  // Get status color
  const getStatusColor = (status: Alert['status']): string => {
    switch (status) {
      case 'ACTIVE':
        return '#00ff00';
      case 'TRIGGERED':
        return '#ff6b6b';
      case 'DISABLED':
        return '#666666';
      default:
        return '#cccccc';
    }
  };

  const activeAlerts = alerts.filter(a => a.status === 'ACTIVE');
  const triggeredAlerts = alerts.filter(a => a.status === 'TRIGGERED');
  const disabledAlerts = alerts.filter(a => a.status === 'DISABLED');

  return (
    <Overlay onClick={onClose}>
      <PanelContainer onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>🚨 Price & RSI Alerts</Title>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </Header>

        {message && (
          <Message type={message.type}>
            {message.text}
          </Message>
        )}

        {/* Create New Alert */}
        <Section>
          <SectionTitle>Create New Alert</SectionTitle>
          <Form>
            <InputGroup>
              <Label>Ticker</Label>
              <Input
                type="text"
                placeholder="AAPL"
                value={newAlert.ticker}
                onChange={(e) => setNewAlert({ ...newAlert, ticker: e.target.value.toUpperCase() })}
                maxLength={5}
              />
            </InputGroup>

            <InputGroup>
              <Label>Alert Type</Label>
              <Select
                value={newAlert.type}
                onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value as Alert['type'] })}
              >
                <option value="PRICE_ABOVE">Price Above</option>
                <option value="PRICE_BELOW">Price Below</option>
                <option value="RSI_ABOVE">RSI Above (Overbought)</option>
                <option value="RSI_BELOW">RSI Below (Oversold)</option>
              </Select>
            </InputGroup>

            <InputGroup>
              <Label>Threshold</Label>
              <Input
                type="number"
                placeholder={newAlert.type.includes('RSI') ? '70' : '150.00'}
                value={newAlert.threshold}
                onChange={(e) => setNewAlert({ ...newAlert, threshold: e.target.value })}
                step={newAlert.type.includes('RSI') ? '1' : '0.01'}
              />
            </InputGroup>

            <CreateButton onClick={handleCreateAlert}>
              ➕ Create Alert
            </CreateButton>
          </Form>
        </Section>

        {/* Active Alerts */}
        {activeAlerts.length > 0 && (
          <Section>
            <SectionTitle>
              Active Alerts ({activeAlerts.length})
            </SectionTitle>
            <AlertList>
              {activeAlerts.map((alert) => (
                <AlertItem key={alert.id} status={alert.status}>
                  <AlertHeader>
                    <AlertTicker>{alert.ticker}</AlertTicker>
                    <AlertStatus color={getStatusColor(alert.status)}>
                      {alert.status}
                    </AlertStatus>
                  </AlertHeader>
                  <AlertDetails>
                    <span>{formatAlertType(alert.type)}</span>
                    <AlertThreshold>{alert.threshold}</AlertThreshold>
                  </AlertDetails>
                  <AlertMeta>
                    Created: {new Date(alert.createdAt).toLocaleString()}
                  </AlertMeta>
                  <AlertActions>
                    <ActionButton onClick={() => handleToggle(alert.id)}>
                      ⏸️ Disable
                    </ActionButton>
                    <ActionButton onClick={() => handleDelete(alert.id)}>
                      🗑️ Delete
                    </ActionButton>
                  </AlertActions>
                </AlertItem>
              ))}
            </AlertList>
          </Section>
        )}

        {/* Triggered Alerts */}
        {triggeredAlerts.length > 0 && (
          <Section>
            <SectionHeader>
              <SectionTitle>
                🚨 Triggered Alerts ({triggeredAlerts.length})
              </SectionTitle>
              <ClearButton onClick={handleClearTriggered}>
                Clear All
              </ClearButton>
            </SectionHeader>
            <AlertList>
              {triggeredAlerts.map((alert) => (
                <AlertItem key={alert.id} status={alert.status}>
                  <AlertHeader>
                    <AlertTicker>{alert.ticker}</AlertTicker>
                    <AlertStatus color={getStatusColor(alert.status)}>
                      TRIGGERED
                    </AlertStatus>
                  </AlertHeader>
                  <AlertDetails>
                    <span>{formatAlertType(alert.type)}</span>
                    <AlertThreshold>{alert.threshold}</AlertThreshold>
                  </AlertDetails>
                  <AlertMessage>{alert.message}</AlertMessage>
                  <AlertMeta>
                    Triggered: {alert.triggeredAt ? new Date(alert.triggeredAt).toLocaleString() : 'N/A'}
                  </AlertMeta>
                  <AlertActions>
                    <ActionButton onClick={() => handleToggle(alert.id)}>
                      🔄 Reset
                    </ActionButton>
                    <ActionButton onClick={() => handleDelete(alert.id)}>
                      🗑️ Delete
                    </ActionButton>
                  </AlertActions>
                </AlertItem>
              ))}
            </AlertList>
          </Section>
        )}

        {/* Disabled Alerts */}
        {disabledAlerts.length > 0 && (
          <Section>
            <SectionTitle>
              Disabled Alerts ({disabledAlerts.length})
            </SectionTitle>
            <AlertList>
              {disabledAlerts.map((alert) => (
                <AlertItem key={alert.id} status={alert.status}>
                  <AlertHeader>
                    <AlertTicker>{alert.ticker}</AlertTicker>
                    <AlertStatus color={getStatusColor(alert.status)}>
                      DISABLED
                    </AlertStatus>
                  </AlertHeader>
                  <AlertDetails>
                    <span>{formatAlertType(alert.type)}</span>
                    <AlertThreshold>{alert.threshold}</AlertThreshold>
                  </AlertDetails>
                  <AlertActions>
                    <ActionButton onClick={() => handleToggle(alert.id)}>
                      ▶️ Enable
                    </ActionButton>
                    <ActionButton onClick={() => handleDelete(alert.id)}>
                      🗑️ Delete
                    </ActionButton>
                  </AlertActions>
                </AlertItem>
              ))}
            </AlertList>
          </Section>
        )}

        {/* Empty State */}
        {!loading && alerts.length === 0 && (
          <EmptyState>
            <EmptyIcon>🔔</EmptyIcon>
            <EmptyText>No alerts yet</EmptyText>
            <EmptySubtext>Create your first alert to get notified about price or RSI changes</EmptySubtext>
          </EmptyState>
        )}

        {loading && (
          <EmptyState>
            <EmptyText>Loading alerts...</EmptyText>
          </EmptyState>
        )}
      </PanelContainer>
    </Overlay>
  );
};

// Styled Components
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const PanelContainer = styled.div`
  background-color: #1a1a1a;
  border: 2px solid #00ff00;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #0a0a0a;
  }

  &::-webkit-scrollbar-thumb {
    background: #00ff00;
    border-radius: 4px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #00ff00;
  position: sticky;
  top: 0;
  background-color: #1a1a1a;
  z-index: 10;
`;

const Title = styled.h2`
  color: #00ff00;
  margin: 0;
  font-size: 24px;
  font-family: 'Courier New', monospace;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #00ff00;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #ff6b6b;
  }
`;

const Message = styled.div<{ type: 'success' | 'error' }>`
  margin: 15px 20px;
  padding: 12px;
  border-radius: 4px;
  background-color: ${props => props.type === 'success' ? '#00330022' : '#33000022'};
  border: 1px solid ${props => props.type === 'success' ? '#00ff00' : '#ff6b6b'};
  color: ${props => props.type === 'success' ? '#00ff00' : '#ff6b6b'};
  font-family: 'Courier New', monospace;
`;

const Section = styled.div`
  padding: 20px;
  border-bottom: 1px solid #333;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const SectionTitle = styled.h3`
  color: #00ff00;
  margin: 0 0 15px 0;
  font-size: 18px;
  font-family: 'Courier New', monospace;
`;

const Form = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 15px;
  align-items: end;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: #00ff00;
  font-size: 14px;
  font-family: 'Courier New', monospace;
`;

const Input = styled.input`
  background-color: #0a0a0a;
  border: 1px solid #00ff00;
  color: #00ff00;
  padding: 10px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #00ffff;
    box-shadow: 0 0 5px rgba(0, 255, 255, 0.3);
  }

  &::placeholder {
    color: #666;
  }
`;

const Select = styled.select`
  background-color: #0a0a0a;
  border: 1px solid #00ff00;
  color: #00ff00;
  padding: 10px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #00ffff;
    box-shadow: 0 0 5px rgba(0, 255, 255, 0.3);
  }

  option {
    background-color: #0a0a0a;
    color: #00ff00;
  }
`;

const CreateButton = styled.button`
  background-color: #00ff00;
  color: #000;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background-color: #00cc00;
    box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const ClearButton = styled.button`
  background-color: #ff6b6b;
  color: #000;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #ff5252;
  }
`;

const AlertList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const AlertItem = styled.div<{ status: Alert['status'] }>`
  background-color: ${props => {
    if (props.status === 'TRIGGERED') return '#330000';
    if (props.status === 'DISABLED') return '#1a1a1a';
    return '#002200';
  }};
  border: 1px solid ${props => {
    if (props.status === 'TRIGGERED') return '#ff6b6b';
    if (props.status === 'DISABLED') return '#666666';
    return '#00ff00';
  }};
  border-radius: 4px;
  padding: 15px;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 0 10px rgba(0, 255, 0, 0.2);
  }
`;

const AlertHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const AlertTicker = styled.div`
  color: #00ffff;
  font-size: 18px;
  font-weight: bold;
  font-family: 'Courier New', monospace;
`;

const AlertStatus = styled.div<{ color: string }>`
  color: ${props => props.color};
  font-size: 12px;
  font-weight: bold;
  font-family: 'Courier New', monospace;
`;

const AlertDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  color: #00ff00;
  font-family: 'Courier New', monospace;
  font-size: 14px;
`;

const AlertThreshold = styled.div`
  color: #ffff00;
  font-weight: bold;
`;

const AlertMessage = styled.div`
  color: #ff6b6b;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  margin-bottom: 8px;
  font-weight: bold;
`;

const AlertMeta = styled.div`
  color: #666;
  font-size: 12px;
  font-family: 'Courier New', monospace;
  margin-bottom: 10px;
`;

const AlertActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  background-color: transparent;
  border: 1px solid #00ff00;
  color: #00ff00;
  padding: 6px 12px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #00ff00;
    color: #000;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #666;
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 20px;
`;

const EmptyText = styled.div`
  font-size: 18px;
  font-family: 'Courier New', monospace;
  margin-bottom: 10px;
`;

const EmptySubtext = styled.div`
  font-size: 14px;
  font-family: 'Courier New', monospace;
  text-align: center;
  max-width: 400px;
`;

export default AlertsPanel;
