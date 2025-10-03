import { useState } from 'react';
import styled from 'styled-components';
import { PanelState } from './Terminal';
import { SavedLayout, listLayouts, saveLayout, deleteLayout, loadLayout, exportLayouts, importLayouts } from '../services/layoutStorage';

const ManagerContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #000000;
  border: 2px solid #00ff00;
  border-radius: 4px;
  padding: 20px;
  min-width: 600px;
  max-width: 800px;
  max-height: 85vh;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 0 30px rgba(0, 255, 0, 0.4);
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #1a1a1a;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #00ff00;
    border-radius: 3px;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(4px);
  z-index: 999;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #00ff00;
`;

const Title = styled.h2`
  color: #00ff00;
  font-size: 20px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CloseButton = styled.button`
  background: transparent;
  border: 1px solid #ff0000;
  color: #ff0000;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 14px;
  font-family: 'Courier New', monospace;
  transition: all 0.2s;
  
  &:hover {
    background-color: #ff0000;
    color: #000000;
    transform: scale(1.05);
  }
`;

const Section = styled.div`
  margin-bottom: 25px;
  background: #0a0a0a;
  border: 1px solid #333;
  border-radius: 4px;
  padding: 15px;
`;

const SectionTitle = styled.h3`
  color: #00ffff;
  font-size: 14px;
  margin: 0 0 15px 0;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
`;

const Input = styled.input`
  flex: 1;
  background-color: #000;
  border: 1px solid #00ff00;
  color: #00ff00;
  padding: 10px 12px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  
  &:focus {
    outline: none;
    border-color: #00ffff;
    box-shadow: 0 0 8px rgba(0, 255, 255, 0.4);
  }
  
  &::placeholder {
    color: #666666;
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  background-color: ${props => 
    props.$variant === 'danger' ? 'transparent' :
    props.$variant === 'secondary' ? 'transparent' : '#00ff00'
  };
  border: 1px solid ${props => 
    props.$variant === 'danger' ? '#ff0000' :
    props.$variant === 'secondary' ? '#00ffff' : '#00ff00'
  };
  color: ${props => 
    props.$variant === 'danger' ? '#ff0000' :
    props.$variant === 'secondary' ? '#00ffff' : '#000000'
  };
  padding: 10px 18px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  font-weight: bold;
  white-space: nowrap;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => 
      props.$variant === 'danger' ? '#ff0000' :
      props.$variant === 'secondary' ? '#00ffff' : '#00ff00'
    };
    color: #000000;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 255, 0, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    transform: none;
  }
`;

const QuickLoadSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 10px;
  margin-bottom: 15px;
`;

const QuickLoadButton = styled.button<{ $isPinned?: boolean }>`
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  border: 2px solid ${props => props.$isPinned ? '#ffff00' : '#00ff00'};
  color: ${props => props.$isPinned ? '#ffff00' : '#00ff00'};
  padding: 15px 12px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  font-weight: bold;
  text-align: left;
  transition: all 0.2s;
  position: relative;
  
  &:hover {
    background: ${props => props.$isPinned ? '#333300' : '#003300'};
    border-color: ${props => props.$isPinned ? '#ffff00' : '#00ffff'};
    transform: scale(1.05);
    box-shadow: 0 4px 12px ${props => props.$isPinned ? 'rgba(255, 255, 0, 0.3)' : 'rgba(0, 255, 255, 0.3)'};
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

const QuickLoadName = styled.div`
  font-size: 13px;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const QuickLoadMeta = styled.div`
  color: #666;
  font-size: 9px;
`;

const PinIcon = styled.span`
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 10px;
`;

const LayoutList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: #0a0a0a;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #00ff00;
    border-radius: 2px;
  }
`;

const LayoutItem = styled.div<{ $isDefault?: boolean }>`
  background-color: ${props => props.$isDefault ? '#1a1a00' : '#0a0a0a'};
  border: 1px solid ${props => props.$isDefault ? '#ffff00' : '#333333'};
  padding: 12px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: ${props => props.$isDefault ? '#ffff00' : '#00ff00'};
    background-color: #1a1a1a;
    transform: translateX(4px);
  }
`;

const LayoutInfo = styled.div`
  flex: 1;
`;

const LayoutName = styled.div<{ $isDefault?: boolean }>`
  color: ${props => props.$isDefault ? '#ffff00' : '#00ff00'};
  font-weight: bold;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DefaultBadge = styled.span`
  background: #ffff00;
  color: #000;
  padding: 2px 6px;
  font-size: 9px;
  border-radius: 3px;
  font-weight: bold;
`;

const LayoutMeta = styled.div`
  color: #666666;
  font-size: 10px;
  line-height: 1.4;
`;

const LayoutActions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const EmptyState = styled.div`
  text-align: center;
  color: #666666;
  padding: 40px 20px;
  font-size: 12px;
  line-height: 1.6;
`;

const Message = styled.div<{ $type: 'success' | 'error' | 'info' }>`
  background-color: ${props => 
    props.$type === 'success' ? '#00330022' :
    props.$type === 'error' ? '#33000022' : '#003333  22'
  };
  border: 1px solid ${props => 
    props.$type === 'success' ? '#00ff00' :
    props.$type === 'error' ? '#ff0000' : '#00ffff'
  };
  color: ${props => 
    props.$type === 'success' ? '#00ff00' :
    props.$type === 'error' ? '#ff0000' : '#00ffff'
  };
  padding: 12px;
  margin-bottom: 15px;
  font-size: 12px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const TemplateSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
`;

const TemplateCard = styled.button`
  background: #0a0a0a;
  border: 1px solid #333;
  padding: 15px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  color: #00ff00;
  font-family: 'Courier New', monospace;
  
  &:hover {
    border-color: #00ff00;
    background: #1a1a1a;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 255, 0, 0.2);
  }
`;

const TemplateName = styled.div`
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #00ffff;
`;

const TemplateDesc = styled.div`
  font-size: 10px;
  color: #666;
  line-height: 1.4;
`;

interface LayoutManagerEnhancedProps {
  currentPanels: PanelState[];
  onClose: () => void;
  onLoadLayout: (panels: PanelState[]) => void;
  onSaveSuccess: (name: string) => void;
}

const LayoutManagerEnhanced = ({ currentPanels, onClose, onLoadLayout, onSaveSuccess }: LayoutManagerEnhancedProps) => {
  const [layouts, setLayouts] = useState<SavedLayout[]>(listLayouts());
  const [newLayoutName, setNewLayoutName] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [pinnedLayouts, setPinnedLayouts] = useState<string[]>(() => {
    const saved = localStorage.getItem('pinnedLayouts');
    return saved ? JSON.parse(saved) : [];
  });

  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSave = () => {
    if (!newLayoutName.trim()) {
      showMessage('error', 'Please enter a layout name');
      return;
    }

    const success = saveLayout(newLayoutName.trim(), currentPanels);
    if (success) {
      showMessage('success', `✅ Layout "${newLayoutName}" saved successfully`);
      setLayouts(listLayouts());
      setNewLayoutName('');
      onSaveSuccess(newLayoutName.trim());
    } else {
      showMessage('error', '❌ Failed to save layout');
    }
  };

  const handleLoad = (name: string) => {
    const panels = loadLayout(name);
    if (panels) {
      onLoadLayout(panels);
      showMessage('success', `✅ Layout "${name}" loaded`);
      setTimeout(onClose, 1000);
    } else {
      showMessage('error', '❌ Failed to load layout');
    }
  };

  const handleDelete = (name: string) => {
    if (confirm(`Delete layout "${name}"?`)) {
      const success = deleteLayout(name);
      if (success) {
        showMessage('success', `✅ Layout "${name}" deleted`);
        setLayouts(listLayouts());
        // Remove from pinned if it was pinned
        setPinnedLayouts(prev => {
          const updated = prev.filter(p => p !== name);
          localStorage.setItem('pinnedLayouts', JSON.stringify(updated));
          return updated;
        });
      } else {
        showMessage('error', '❌ Failed to delete layout');
      }
    }
  };

  const handlePin = (name: string) => {
    setPinnedLayouts(prev => {
      const updated = prev.includes(name) 
        ? prev.filter(p => p !== name)
        : [...prev, name];
      localStorage.setItem('pinnedLayouts', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSetDefault = (name: string) => {
    localStorage.setItem('defaultLayout', name);
    showMessage('success', `✅ "${name}" set as default layout`);
    setLayouts([...layouts]); // Trigger re-render
  };

  const handleExport = () => {
    exportLayouts();
    showMessage('success', '✅ Layouts exported to file');
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const success = await importLayouts(file);
      if (success) {
        showMessage('success', '✅ Layouts imported successfully');
        setLayouts(listLayouts());
      } else {
        showMessage('error', '❌ Failed to import layouts');
      }
    }
    e.target.value = '';
  };

  const handleLoadTemplate = (templateName: string) => {
    let templatePanels: PanelState[] = [];
    
    switch (templateName) {
      case 'trader':
        templatePanels = [
          { id: 1, ticker: 'SPY', function: 'GIP', data: null, loading: false, error: null, name: 'SPY Chart' },
          { id: 2, ticker: 'SPY', function: 'N', data: null, loading: false, error: null, name: 'Market News' },
          { id: 3, ticker: 'QQQ', function: 'GIP', data: null, loading: false, error: null, name: 'QQQ Chart' },
          { id: 4, ticker: 'VIX', function: 'GIP', data: null, loading: false, error: null, name: 'VIX' },
        ];
        break;
      case 'analyst':
        templatePanels = [
          { id: 1, ticker: 'AAPL', function: 'DES', data: null, loading: false, error: null, name: 'Company Info' },
          { id: 2, ticker: 'AAPL', function: 'FA', data: null, loading: false, error: null, name: 'Fundamentals' },
          { id: 3, ticker: 'AAPL', function: 'GIP', data: null, loading: false, error: null, name: 'Chart' },
        ];
        break;
      case 'researcher':
        templatePanels = [
          { id: 1, ticker: '', function: 'EQS', data: null, loading: false, error: null, name: 'Screener' },
          { id: 2, ticker: '', function: 'N', data: null, loading: false, error: null, name: 'News' },
          { id: 3, ticker: '', function: 'W', data: null, loading: false, error: null, name: 'Watchlist' },
        ];
        break;
      case 'options':
        templatePanels = [
          { id: 1, ticker: 'TSLA', function: 'GIP', data: null, loading: false, error: null, name: 'Chart' },
          { id: 2, ticker: 'TSLA', function: 'OPT', data: null, loading: false, error: null, name: 'Options Chain' },
        ];
        break;
    }
    
    onLoadLayout(templatePanels);
    showMessage('info', `📋 ${templateName.toUpperCase()} template loaded`);
    setTimeout(onClose, 1500);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const defaultLayout = localStorage.getItem('defaultLayout');
  const pinnedLayoutsData = layouts.filter(l => pinnedLayouts.includes(l.name));

  return (
    <>
      <Overlay onClick={onClose} />
      <ManagerContainer>
        <Header>
          <Title>
            <span>⚙️</span>
            <span>Workspace Manager</span>
          </Title>
          <CloseButton onClick={onClose}>✕ ESC</CloseButton>
        </Header>

        {message && (
          <Message $type={message.type}>
            <span>{message.text}</span>
          </Message>
        )}

        {/* Quick Load Section */}
        {pinnedLayoutsData.length > 0 && (
          <Section>
            <SectionTitle>⭐ Quick Access</SectionTitle>
            <QuickLoadSection>
              {pinnedLayoutsData.map(layout => (
                <QuickLoadButton 
                  key={layout.name}
                  $isPinned
                  onClick={() => handleLoad(layout.name)}
                >
                  <PinIcon>📌</PinIcon>
                  <QuickLoadName>{layout.name}</QuickLoadName>
                  <QuickLoadMeta>
                    {layout.panels.filter(p => p.ticker).length} panels
                  </QuickLoadMeta>
                </QuickLoadButton>
              ))}
            </QuickLoadSection>
          </Section>
        )}

        {/* Templates Section */}
        <Section>
          <SectionTitle>📋 Workspace Templates</SectionTitle>
          <TemplateSection>
            <TemplateCard onClick={() => handleLoadTemplate('trader')}>
              <TemplateName>📊 Day Trader</TemplateName>
              <TemplateDesc>
                4-panel layout with SPY, QQQ, VIX charts and market news
              </TemplateDesc>
            </TemplateCard>
            <TemplateCard onClick={() => handleLoadTemplate('analyst')}>
              <TemplateName>📈 Stock Analyst</TemplateName>
              <TemplateDesc>
                Company description, fundamentals, and price chart
              </TemplateDesc>
            </TemplateCard>
            <TemplateCard onClick={() => handleLoadTemplate('researcher')}>
              <TemplateName>🔍 Researcher</TemplateName>
              <TemplateDesc>
                Stock screener, news feed, and watchlist
              </TemplateDesc>
            </TemplateCard>
            <TemplateCard onClick={() => handleLoadTemplate('options')}>
              <TemplateName>📉 Options Trader</TemplateName>
              <TemplateDesc>
                Chart and options chain for derivatives trading
              </TemplateDesc>
            </TemplateCard>
          </TemplateSection>
        </Section>

        {/* Save Current Layout */}
        <Section>
          <SectionTitle>💾 Save Current Workspace</SectionTitle>
          <InputGroup>
            <Input
              type="text"
              placeholder="Enter workspace name (e.g., 'FAANG Analysis')..."
              value={newLayoutName}
              onChange={(e) => setNewLayoutName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSave()}
            />
            <Button onClick={handleSave} disabled={!newLayoutName.trim()}>
              💾 Save
            </Button>
          </InputGroup>
        </Section>

        {/* Saved Layouts */}
        <Section>
          <SectionTitle>📂 My Workspaces ({layouts.length})</SectionTitle>
          <LayoutList>
            {layouts.length === 0 ? (
              <EmptyState>
                📁 No saved workspaces yet.<br />
                <br />
                Save your current panel configuration above to create your first workspace!<br />
                Or try a template to get started quickly.
              </EmptyState>
            ) : (
              layouts.map(layout => (
                <LayoutItem key={layout.name} $isDefault={layout.name === defaultLayout}>
                  <LayoutInfo onClick={() => handleLoad(layout.name)}>
                    <LayoutName $isDefault={layout.name === defaultLayout}>
                      {pinnedLayouts.includes(layout.name) && '📌 '}
                      {layout.name}
                      {layout.name === defaultLayout && <DefaultBadge>DEFAULT</DefaultBadge>}
                    </LayoutName>
                    <LayoutMeta>
                      {layout.panels.filter(p => p.ticker).length} active panels • 
                      {layout.panels.filter(p => p.function).length} functions • 
                      Updated: {formatDate(layout.updatedAt)}
                    </LayoutMeta>
                  </LayoutInfo>
                  <LayoutActions>
                    <Button 
                      $variant="secondary" 
                      onClick={() => handleLoad(layout.name)}
                      title="Load this workspace"
                    >
                      📂 Load
                    </Button>
                    <Button 
                      $variant="secondary" 
                      onClick={() => handlePin(layout.name)}
                      title={pinnedLayouts.includes(layout.name) ? 'Unpin from Quick Access' : 'Pin to Quick Access'}
                    >
                      {pinnedLayouts.includes(layout.name) ? '📌' : '📍'}
                    </Button>
                    <Button 
                      $variant="secondary" 
                      onClick={() => handleSetDefault(layout.name)}
                      title="Set as default workspace"
                    >
                      ⭐
                    </Button>
                    <Button 
                      $variant="danger" 
                      onClick={() => handleDelete(layout.name)}
                      title="Delete this workspace"
                    >
                      🗑️
                    </Button>
                  </LayoutActions>
                </LayoutItem>
              ))
            )}
          </LayoutList>
        </Section>

        {/* Import / Export */}
        <Section>
          <SectionTitle>📤 Backup & Restore</SectionTitle>
          <InputGroup>
            <Button $variant="secondary" onClick={handleExport} disabled={layouts.length === 0}>
              📤 Export All Workspaces
            </Button>
            <Button $variant="secondary" onClick={() => document.getElementById('layout-import')?.click()}>
              📥 Import Workspaces
            </Button>
            <HiddenFileInput
              id="layout-import"
              type="file"
              accept=".json"
              onChange={handleImport}
            />
          </InputGroup>
        </Section>
      </ManagerContainer>
    </>
  );
};

export default LayoutManagerEnhanced;
