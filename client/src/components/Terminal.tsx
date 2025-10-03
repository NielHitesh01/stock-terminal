import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Panel from './Panel';
import Toolbar from './Toolbar';
import LayoutManagerEnhanced from './LayoutManagerEnhanced';
import AlertsPanel from './AlertsPanel';
import ConnectionStatusIndicator from './ConnectionStatusIndicator';
import BloombergHeader from './BloombergHeader';
import CommandPalette from './CommandPalette';
import KeyboardShortcutsPanel from './KeyboardShortcutsPanel';
import { loadDefault } from '../services/layoutStorage';
import { alertApi } from '../services/api';

const TerminalContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #000000;
`;

const TabBar = styled.div`
  display: flex;
  background-color: #0a0a0a;
  border-bottom: 2px solid #00ff00;
  overflow-x: auto;
  flex-shrink: 0;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: #1a1a1a;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #00ff00;
    border-radius: 2px;
  }
`;

const Tab = styled.button<{ active: boolean; hasData: boolean }>`
  background-color: ${props => props.active ? '#1a1a1a' : '#0a0a0a'};
  border: none;
  border-right: 1px solid #333;
  border-bottom: ${props => props.active ? '3px solid #00ff00' : '3px solid transparent'};
  color: ${props => props.hasData ? '#00ff00' : '#666'};
  padding: 8px 16px;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  cursor: pointer;
  transition: all 0.2s;
  min-width: 120px;
  text-align: left;
  position: relative;
  
  &:hover {
    background-color: #1a1a1a;
    color: ${props => props.hasData ? '#00ffff' : '#999'};
  }
  
  &::before {
    content: '${props => props.active ? '▶' : '○'}';
    margin-right: 6px;
    color: ${props => props.active ? '#00ff00' : '#666'};
  }
`;

const TabLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const TabTitle = styled.div`
  font-size: 11px;
  font-weight: bold;
`;

const TabSubtitle = styled.div`
  font-size: 9px;
  color: #888;
`;

const CloseTabButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  background: transparent;
  border: none;
  color: #666;
  font-size: 10px;
  cursor: pointer;
  padding: 2px 4px;
  opacity: 0.6;
  
  &:hover {
    color: #ff0000;
    opacity: 1;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;

const PageView = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
`;

const SplitViewContainer = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 2px;
  background-color: #00ff00;
  overflow: hidden;
`;

const SplitPanel = styled.div<{ isActive: boolean }>`
  background-color: #000000;
  border: 2px solid ${props => props.isActive ? '#00ff00' : '#333'};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  
  &:hover {
    border-color: ${props => props.isActive ? '#00ff00' : '#666'};
  }
`;

const StatusBar = styled.div`
  background-color: #0a0a0a;
  border-top: 1px solid #00ff00;
  padding: 4px 16px;
  font-size: 10px;
  color: #00ffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
`;

const StatusSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const ToggleButton = styled.button`
  background: transparent;
  border: 1px solid #00ff00;
  color: #00ff00;
  padding: 2px 8px;
  font-size: 10px;
  font-family: 'Courier New', monospace;
  cursor: pointer;
  
  &:hover {
    background-color: #00ff00;
    color: #000000;
  }
`;

const NewTabButton = styled.button`
  background: transparent;
  border: 1px dashed #00ff00;
  color: #00ff00;
  padding: 8px 16px;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  cursor: pointer;
  min-width: 100px;
  
  &:hover {
    background-color: #1a1a1a;
    color: #00ffff;
  }
  
  &::before {
    content: '+ ';
    font-weight: bold;
  }
`;

export interface PanelState {
  id: number;
  ticker: string;
  function: string;
  data: any;
  loading: boolean;
  error: string | null;
  name?: string; // Custom tab name
}

const Terminal = () => {
  const [panels, setPanels] = useState<PanelState[]>([
    { id: 1, ticker: '', function: '', data: null, loading: false, error: null, name: 'Tab 1' },
  ]);

  const [activePanel, setActivePanel] = useState<number>(1);
  const [statusMessage, setStatusMessage] = useState<string>('Ready');
  const [showCommandLine, setShowCommandLine] = useState<boolean>(true);
  const [showLayoutManager, setShowLayoutManager] = useState<boolean>(false);
  const [currentLayoutName, setCurrentLayoutName] = useState<string>('');
  const [showAlertsPanel, setShowAlertsPanel] = useState<boolean>(false);
  const [alertCount, setAlertCount] = useState<{ active: number; triggered: number }>({ active: 0, triggered: 0 });
  const [nextTabId, setNextTabId] = useState<number>(2);
  const [splitViewMode, setSplitViewMode] = useState<boolean>(false);
  const [hideHeader, setHideHeader] = useState<boolean>(false);
  const [showCommandPalette, setShowCommandPalette] = useState<boolean>(false);
  const [showShortcutsPanel, setShowShortcutsPanel] = useState<boolean>(false);

  // Load default layout on mount
  useEffect(() => {
    const defaultLayout = loadDefault();
    if (defaultLayout) {
      setPanels(defaultLayout);
      setStatusMessage('Default layout loaded');
    }
  }, []);

  // Poll alert stats every 30 seconds
  useEffect(() => {
    const fetchAlertStats = async () => {
      try {
        const stats = await alertApi.getStats();
        setAlertCount({ active: stats.activeAlerts, triggered: stats.triggeredAlerts });
      } catch (error) {
        console.error('Failed to fetch alert stats:', error);
      }
    };

    fetchAlertStats(); // Initial fetch
    const interval = setInterval(fetchAlertStats, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command Palette (Ctrl+P)
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        setShowCommandPalette(true);
        setStatusMessage('Command Palette opened');
        return;
      }
      
      // Keyboard Shortcuts (Ctrl+? or Ctrl+/)
      if (e.ctrlKey && (e.key === '?' || e.key === '/')) {
        e.preventDefault();
        setShowShortcutsPanel(true);
        setStatusMessage('Keyboard Shortcuts opened');
        return;
      }
      
      if (e.ctrlKey) {
        switch (e.key) {
          case 't':
          case 'T':
            e.preventDefault();
            handleAddNewTab();
            break;
          case 'w':
          case 'W':
            e.preventDefault();
            handleCloseTab(activePanel);
            break;
          case 'Tab':
            e.preventDefault();
            handleNextTab();
            break;
          case 'h':
          case 'H':
            e.preventDefault();
            setShowCommandLine(prev => !prev);
            break;
          case 's':
          case 'S':
            e.preventDefault();
            setShowLayoutManager(true);
            setStatusMessage('Layout Manager opened');
            break;
          case 'l':
          case 'L':
            e.preventDefault();
            setShowLayoutManager(true);
            setStatusMessage('Layout Manager opened');
            break;
          case 'a':
          case 'A':
            e.preventDefault();
            setShowAlertsPanel(true);
            setStatusMessage('Alerts Panel opened');
            break;
          case '4':
            e.preventDefault();
            handleToggleSplitView();
            break;
        }
      }
      // Ctrl+Shift+H to toggle header
      if (e.ctrlKey && e.shiftKey && (e.key === 'h' || e.key === 'H')) {
        e.preventDefault();
        setHideHeader(prev => !prev);
        setStatusMessage(hideHeader ? 'Header shown' : 'Header hidden');
      }
      // ESC key to close any open modals
      if (e.key === 'Escape') {
        if (showCommandPalette) {
          setShowCommandPalette(false);
          setStatusMessage('Command Palette closed');
        } else if (showShortcutsPanel) {
          setShowShortcutsPanel(false);
          setStatusMessage('Keyboard Shortcuts closed');
        } else if (showAlertsPanel) {
          setShowAlertsPanel(false);
          setStatusMessage('Alerts Panel closed');
        } else if (showLayoutManager) {
          setShowLayoutManager(false);
          setStatusMessage('Layout Manager closed');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePanel, showLayoutManager, showAlertsPanel, showCommandPalette, showShortcutsPanel, panels]);

  const updatePanel = (panelId: number, updates: Partial<PanelState>) => {
    setPanels(prev =>
      prev.map(panel =>
        panel.id === panelId ? { ...panel, ...updates } : panel
      )
    );
  };

  const handleToolbarTickerSelect = (ticker: string) => {
    // Update active panel with selected ticker
    const currentPanel = panels.find(p => p.id === activePanel);
    if (currentPanel && currentPanel.function) {
      // If panel has a function, update ticker
      updatePanel(activePanel, { ticker, loading: false, error: null });
      setStatusMessage(`Ticker ${ticker} selected for Panel ${activePanel}`);
    } else {
      // If no function, prompt user
      setStatusMessage(`Select a function for ${ticker} (use FN button or type command)`);
      updatePanel(activePanel, { ticker, loading: false, error: null });
    }
  };

  const handleToolbarFunctionSelect = (func: string) => {
    const currentPanel = panels.find(p => p.id === activePanel);
    if (currentPanel && currentPanel.ticker) {
      // Execute function with current ticker
      updatePanel(activePanel, { function: func, loading: true, error: null });
      setStatusMessage(`Executing ${currentPanel.ticker} ${func}...`);
      
      // Import and execute command
      import('../services/api').then(({ executeCommand }) => {
        executeCommand(currentPanel.ticker, func)
          .then(data => {
            updatePanel(activePanel, { loading: false, data });
            setStatusMessage(`Success: ${currentPanel.ticker} ${func} loaded`);
          })
          .catch((error: any) => {
            updatePanel(activePanel, { loading: false, error: error.message });
            setStatusMessage(`Error: ${error.message}`);
          });
      });
    } else {
      setStatusMessage(`Select a ticker first (use search or quick access buttons)`);
    }
  };

  const handleAddNewTab = () => {
    const newTab: PanelState = {
      id: nextTabId,
      ticker: '',
      function: '',
      data: null,
      loading: false,
      error: null,
      name: `Tab ${nextTabId}`
    };
    setPanels(prev => [...prev, newTab]);
    setActivePanel(nextTabId);
    setNextTabId(nextTabId + 1);
    setStatusMessage(`New tab created: Tab ${nextTabId}`);
  };

  const handleCloseTab = (tabId: number) => {
    if (panels.length === 1) {
      setStatusMessage('Cannot close the last tab');
      return;
    }
    
    const tabIndex = panels.findIndex(p => p.id === tabId);
    setPanels(prev => prev.filter(p => p.id !== tabId));
    
    // Switch to adjacent tab
    if (tabId === activePanel) {
      const newActiveIndex = Math.max(0, tabIndex - 1);
      const newActiveTab = panels[newActiveIndex === tabIndex ? newActiveIndex + 1 : newActiveIndex];
      if (newActiveTab) {
        setActivePanel(newActiveTab.id);
      }
    }
    
    setStatusMessage(`Tab closed`);
  };

  const handleNextTab = () => {
    const currentIndex = panels.findIndex(p => p.id === activePanel);
    const nextIndex = (currentIndex + 1) % panels.length;
    setActivePanel(panels[nextIndex].id);
  };

  const getTabDisplayName = (panel: PanelState): string => {
    if (panel.ticker && panel.function) {
      return `${panel.ticker} ${panel.function}`;
    } else if (panel.ticker) {
      return panel.ticker;
    } else if (panel.name) {
      return panel.name;
    }
    return `Tab ${panel.id}`;
  };

  const getTabSubtitle = (panel: PanelState): string => {
    if (panel.loading) return 'Loading...';
    if (panel.error) return 'Error';
    if (panel.data) return 'Ready';
    return 'Empty';
  };

  const handleToggleSplitView = () => {
    const newMode = !splitViewMode;
    setSplitViewMode(newMode);
    
    if (newMode) {
      // Entering split view - ensure we have at least 4 tabs
      while (panels.length < 4) {
        const newTab: PanelState = {
          id: nextTabId,
          ticker: '',
          function: '',
          data: null,
          loading: false,
          error: null,
          name: `Tab ${nextTabId}`
        };
        setPanels(prev => [...prev, newTab]);
        setNextTabId(nextTabId + 1);
      }
      setStatusMessage('4-Terminal Split View activated (Ctrl+4 to exit)');
    } else {
      setStatusMessage('Single Tab View restored');
    }
  };

  const handleLoadLayout = (loadedPanels: PanelState[]) => {
    setPanels(loadedPanels);
    setStatusMessage('Layout loaded successfully');
  };

  const handleSaveSuccess = (name: string) => {
    setCurrentLayoutName(name);
    setStatusMessage(`Layout "${name}" saved`);
  };

  const currentPanel = panels.find(p => p.id === activePanel) || panels[0];
  
  // Debug logging
  console.log('Terminal render:', {
    activePanelId: activePanel,
    currentPanel: currentPanel?.id,
    totalPanels: panels.length,
    panelIds: panels.map(p => p.id)
  });

  return (
    <TerminalContainer>
      {showLayoutManager && (
        <LayoutManagerEnhanced
          currentPanels={panels}
          onClose={() => setShowLayoutManager(false)}
          onLoadLayout={handleLoadLayout}
          onSaveSuccess={handleSaveSuccess}
        />
      )}
      
      {showAlertsPanel && (
        <AlertsPanel
          onClose={() => setShowAlertsPanel(false)}
        />
      )}
      
      {!hideHeader && <BloombergHeader />}
      
      <Toolbar
        onTickerSelect={handleToolbarTickerSelect}
        onFunctionSelect={handleToolbarFunctionSelect}
        activePanel={activePanel}
        onOpenLayoutManager={() => setShowLayoutManager(true)}
      />
      
      {/* Tab Bar */}
      <TabBar>
        {panels.map((panel) => (
          <Tab
            key={panel.id}
            active={panel.id === activePanel}
            hasData={!!panel.data || !!panel.ticker}
            onClick={() => setActivePanel(panel.id)}
          >
            <TabLabel>
              <TabTitle>{getTabDisplayName(panel)}</TabTitle>
              <TabSubtitle>{getTabSubtitle(panel)}</TabSubtitle>
            </TabLabel>
            {panels.length > 1 && (
              <CloseTabButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseTab(panel.id);
                }}
              >
                ✕
              </CloseTabButton>
            )}
          </Tab>
        ))}
        <NewTabButton onClick={handleAddNewTab}>
          New Tab
        </NewTabButton>
      </TabBar>
      
      {/* Content Area - Split View or Single Tab View */}
      <ContentArea>
        {splitViewMode ? (
          <SplitViewContainer>
            {panels.slice(0, 4).map((panel) => (
              <SplitPanel 
                key={panel.id}
                isActive={panel.id === activePanel}
                onClick={() => setActivePanel(panel.id)}
              >
                <Panel
                  panel={panel}
                  isActive={panel.id === activePanel}
                  onClick={() => setActivePanel(panel.id)}
                  updatePanel={updatePanel}
                  setStatusMessage={setStatusMessage}
                  showCommandLine={false}
                  isFullscreen={false}
                />
              </SplitPanel>
            ))}
          </SplitViewContainer>
        ) : (
          currentPanel ? (
            <PageView>
              <Panel
                panel={currentPanel}
                updatePanel={updatePanel}
                setStatusMessage={setStatusMessage}
                showCommandLine={showCommandLine}
                isFullscreen={true}
              />
            </PageView>
          ) : (
            <PageView>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%', 
                color: '#ff0000',
                fontSize: '16px',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <div>⚠️ NO ACTIVE PANEL</div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  Active Panel ID: {activePanel}<br />
                  Available Panels: {panels.map(p => p.id).join(', ')}
                </div>
              </div>
            </PageView>
          )
        )}
      </ContentArea>
      
      <StatusBar>
        <StatusSection>
          <span>{statusMessage}</span>
          {currentLayoutName && (
            <span style={{ color: '#00ffff', marginLeft: '10px' }}>
              📋 Layout: {currentLayoutName}
            </span>
          )}
          {alertCount.triggered > 0 && (
            <span style={{ color: '#ff6b6b', marginLeft: '10px', fontWeight: 'bold' }}>
              🚨 {alertCount.triggered} Alert{alertCount.triggered !== 1 ? 's' : ''} Triggered!
            </span>
          )}
        </StatusSection>
        <StatusSection>
          <ConnectionStatusIndicator showLabel={true} />
          <span>|</span>
          <span>Tabs: {panels.length} | Active: {currentPanel ? getTabDisplayName(currentPanel) : 'None'}</span>
          <span>|</span>
          <ToggleButton onClick={() => setShowCommandLine(!showCommandLine)}>
            {showCommandLine ? 'Hide' : 'Show'} CMD
          </ToggleButton>
          <span>|</span>
          <ToggleButton onClick={handleAddNewTab}>
            ➕ New Tab
          </ToggleButton>
          <span>|</span>
          <ToggleButton onClick={handleToggleSplitView} style={{
            backgroundColor: splitViewMode ? '#1a4d1a' : 'transparent',
            fontWeight: splitViewMode ? 'bold' : 'normal'
          }}>
            ⊞ {splitViewMode ? '4-Split' : 'Split'}
          </ToggleButton>
          <span>|</span>
          <ToggleButton onClick={() => setHideHeader(!hideHeader)}>
            {hideHeader ? '▼ Show' : '▲ Hide'} Header
          </ToggleButton>
          <span>|</span>
          <ToggleButton onClick={() => setShowLayoutManager(true)}>
            📋 Layouts
          </ToggleButton>
          <span>|</span>
          <ToggleButton onClick={() => setShowAlertsPanel(true)} style={{ 
            color: alertCount.triggered > 0 ? '#ff6b6b' : '#00ff00',
            borderColor: alertCount.triggered > 0 ? '#ff6b6b' : '#00ff00',
            fontWeight: alertCount.triggered > 0 ? 'bold' : 'normal'
          }}>
            🚨 Alerts {alertCount.active > 0 && `(${alertCount.active})`}
          </ToggleButton>
          <span>|</span>
          <ToggleButton onClick={() => setShowCommandPalette(true)} style={{
            backgroundColor: showCommandPalette ? '#1a4d1a' : 'transparent',
            fontWeight: showCommandPalette ? 'bold' : 'normal'
          }}>
            ⚡ Palette
          </ToggleButton>
          <span>|</span>
          <ToggleButton onClick={() => setShowShortcutsPanel(true)}>
            ⌨️ Shortcuts
          </ToggleButton>
          <span>|</span>
          <span style={{ fontSize: '10px' }}>
            Ctrl+P: Palette | Ctrl+?: Keys | Ctrl+4: Split | Ctrl+T: Tab
          </span>
        </StatusSection>
      </StatusBar>

      {/* Command Palette */}
      {showCommandPalette && (
        <CommandPalette
          onClose={() => setShowCommandPalette(false)}
          onExecuteCommand={(ticker, func) => {
            // Execute command for active panel
            const currentPanel = panels.find(p => p.id === activePanel) || panels[0];
            if (currentPanel) {
              updatePanel(currentPanel.id, { 
                ticker, 
                function: func, 
                loading: true, 
                error: null 
              });
              setStatusMessage(`Executing ${ticker} ${func}...`);
            }
            setShowCommandPalette(false);
          }}
          onNavigate={(action) => {
            // Handle navigation actions
            switch (action) {
              case 'new-tab':
                handleAddNewTab();
                break;
              case 'close-tab':
                handleCloseTab(activePanel);
                break;
              case 'split-view':
                handleToggleSplitView();
                break;
              case 'hide-header':
                setHideHeader(prev => !prev);
                setStatusMessage(hideHeader ? 'Header shown' : 'Header hidden');
                break;
              case 'refresh':
                setStatusMessage('Refreshing data...');
                // Trigger data refresh for active panel
                const currentPanel = panels.find(p => p.id === activePanel);
                if (currentPanel && currentPanel.ticker && currentPanel.function) {
                  updatePanel(currentPanel.id, { loading: true, error: null });
                }
                break;
              case 'save-layout':
                setShowLayoutManager(true);
                setStatusMessage('Layout Manager opened');
                break;
              case 'load-layout':
                setShowLayoutManager(true);
                setStatusMessage('Layout Manager opened');
                break;
              case 'alerts':
                setShowAlertsPanel(true);
                setStatusMessage('Alerts Panel opened');
                break;
              case 'shortcuts':
                setShowShortcutsPanel(true);
                setStatusMessage('Keyboard Shortcuts opened');
                break;
            }
            setShowCommandPalette(false);
          }}
        />
      )}

      {/* Keyboard Shortcuts Panel */}
      {showShortcutsPanel && (
        <KeyboardShortcutsPanel
          onClose={() => setShowShortcutsPanel(false)}
        />
      )}
    </TerminalContainer>
  );
};

export default Terminal;
