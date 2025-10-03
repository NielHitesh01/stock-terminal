import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 9999;
  padding-top: 100px;
  backdrop-filter: blur(2px);
`;

const Container = styled.div`
  background: #0a0a0a;
  border: 2px solid #00ff00;
  border-radius: 8px;
  width: 600px;
  max-height: 500px;
  box-shadow: 0 10px 40px rgba(0, 255, 0, 0.3);
  overflow: hidden;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 15px 20px;
  background: #1a1a1a;
  border: none;
  border-bottom: 1px solid #333;
  color: #00ff00;
  font-size: 16px;
  font-family: 'Courier New', monospace;
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: #666;
  }
`;

const ResultsList = styled.div`
  max-height: 400px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #1a1a1a;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #00ff00;
    border-radius: 4px;
  }
`;

const ResultItem = styled.div<{ $isSelected: boolean }>`
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: ${props => props.$isSelected ? '#1a3a1a' : 'transparent'};
  border-left: 3px solid ${props => props.$isSelected ? '#00ff00' : 'transparent'};
  cursor: pointer;
  transition: all 0.15s;
  
  &:hover {
    background: #1a3a1a;
    border-left-color: #00ff00;
  }
`;

const Icon = styled.span`
  font-size: 18px;
  width: 24px;
  text-align: center;
`;

const Details = styled.div`
  flex: 1;
`;

const Title = styled.div`
  color: #00ff00;
  font-size: 14px;
  font-weight: bold;
`;

const Description = styled.div`
  color: #666;
  font-size: 12px;
  margin-top: 2px;
`;

const Shortcut = styled.div`
  color: #00ffff;
  font-size: 11px;
  font-family: 'Courier New', monospace;
  background: #000;
  padding: 2px 8px;
  border-radius: 3px;
  border: 1px solid #00ffff;
`;

const NoResults = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #666;
  font-size: 14px;
`;

const Hint = styled.div`
  padding: 10px 20px;
  background: #1a1a1a;
  border-top: 1px solid #333;
  color: #666;
  font-size: 11px;
  display: flex;
  justify-content: space-between;
`;

interface Command {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: () => void;
  keywords: string[];
  shortcut?: string;
  category: 'navigation' | 'function' | 'action' | 'layout';
}

interface CommandPaletteProps {
  onClose: () => void;
  onExecuteCommand: (ticker: string, func: string) => void;
  onNavigate: (action: string) => void;
}

const CommandPalette = ({ onClose, onExecuteCommand, onNavigate }: CommandPaletteProps) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Define all available commands
  const commands: Command[] = [
    // Navigation
    { id: 'new-tab', title: 'New Tab', description: 'Open a new empty tab', icon: '➕', action: () => onNavigate('new-tab'), keywords: ['new', 'tab', 'add', 'create'], shortcut: 'Ctrl+T', category: 'navigation' },
    { id: 'close-tab', title: 'Close Tab', description: 'Close the current tab', icon: '✕', action: () => onNavigate('close-tab'), keywords: ['close', 'tab', 'remove'], shortcut: 'Ctrl+W', category: 'navigation' },
    { id: 'split-view', title: 'Toggle 4-Split View', description: 'View 4 tabs simultaneously', icon: '⊞', action: () => onNavigate('split-view'), keywords: ['split', '4', 'quad', 'view'], shortcut: 'Ctrl+4', category: 'navigation' },
    { id: 'hide-header', title: 'Toggle Header', description: 'Hide/show the header to maximize workspace', icon: '▲', action: () => onNavigate('hide-header'), keywords: ['header', 'hide', 'maximize'], shortcut: 'Ctrl+Shift+H', category: 'navigation' },
    
    // Functions
    { id: 'des', title: 'Description (DES)', description: 'View company description and overview', icon: '📄', action: () => {}, keywords: ['description', 'des', 'company', 'info'], category: 'function' },
    { id: 'gip', title: 'Graph (GIP)', description: 'View price chart with technical indicators', icon: '📊', action: () => {}, keywords: ['graph', 'gip', 'chart', 'price'], category: 'function' },
    { id: 'fa', title: 'Financial Analysis (FA)', description: 'View financial statements and ratios', icon: '💰', action: () => {}, keywords: ['financial', 'fa', 'statements', 'balance'], category: 'function' },
    { id: 'news', title: 'News (N)', description: 'View latest news with sentiment analysis', icon: '📰', action: () => {}, keywords: ['news', 'n', 'articles'], category: 'function' },
    { id: 'watchlist', title: 'Watchlist (W)', description: 'View and manage your watchlist', icon: '👁️', action: () => onExecuteCommand('SYSTEM', 'W'), keywords: ['watchlist', 'w', 'watch', 'list'], category: 'function' },
    { id: 'eqs', title: 'Equity Screener (EQS)', description: 'Screen stocks by criteria', icon: '🔍', action: () => onExecuteCommand('SYSTEM', 'EQS'), keywords: ['screener', 'eqs', 'filter'], category: 'function' },
    { id: 'fil', title: 'SEC Filings (FIL)', description: 'View SEC filings and documents', icon: '📋', action: () => {}, keywords: ['filings', 'fil', 'sec', '10k'], category: 'function' },
    { id: 'opt', title: 'Options Chain (OPT)', description: 'View options chain with Greeks', icon: '⚡', action: () => {}, keywords: ['options', 'opt', 'greeks', 'calls'], category: 'function' },
    { id: 'sch', title: 'Supply Chain (SCH)', description: 'View supply chain diagram', icon: '🔗', action: () => {}, keywords: ['supply', 'sch', 'chain'], category: 'function' },
    
    // Actions
    { id: 'refresh', title: 'Refresh Data', description: 'Reload current panel data', icon: '🔄', action: () => onNavigate('refresh'), keywords: ['refresh', 'reload', 'update'], shortcut: 'Ctrl+R', category: 'action' },
    { id: 'export', title: 'Export Data', description: 'Download data as CSV/Excel', icon: '📥', action: () => onNavigate('export'), keywords: ['export', 'download', 'csv', 'excel'], shortcut: 'Ctrl+E', category: 'action' },
    { id: 'alerts', title: 'Manage Alerts', description: 'View and configure price alerts', icon: '🔔', action: () => onNavigate('alerts'), keywords: ['alerts', 'notifications', 'alarm'], shortcut: 'Ctrl+A', category: 'action' },
    { id: 'shortcuts', title: 'Keyboard Shortcuts', description: 'View all keyboard shortcuts', icon: '⌨️', action: () => onNavigate('shortcuts'), keywords: ['shortcuts', 'keyboard', 'keys', 'hotkeys'], shortcut: 'Ctrl+?', category: 'action' },
    
    // Layout
    { id: 'save-layout', title: 'Save Layout', description: 'Save current tab configuration', icon: '💾', action: () => onNavigate('save-layout'), keywords: ['save', 'layout', 'workspace'], shortcut: 'Ctrl+S', category: 'layout' },
    { id: 'load-layout', title: 'Load Layout', description: 'Load a saved layout', icon: '📂', action: () => onNavigate('load-layout'), keywords: ['load', 'layout', 'open'], shortcut: 'Ctrl+L', category: 'layout' },
    { id: 'layout-manager', title: 'Layout Manager', description: 'Manage saved layouts', icon: '📋', action: () => onNavigate('layout-manager'), keywords: ['layout', 'manager', 'workspaces'], shortcut: 'Ctrl+Shift+L', category: 'layout' },
  ];

  // Filter commands based on query
  const filteredCommands = commands.filter(cmd => {
    const searchText = query.toLowerCase();
    return (
      cmd.title.toLowerCase().includes(searchText) ||
      cmd.description.toLowerCase().includes(searchText) ||
      cmd.keywords.some(keyword => keyword.includes(searchText)) ||
      cmd.id.includes(searchText)
    );
  });

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        e.preventDefault();
        executeCommand(filteredCommands[selectedIndex]);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, filteredCommands, onClose]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const executeCommand = (command: Command) => {
    if (command.category === 'function' && query.trim()) {
      // Extract ticker from query if present
      const parts = query.trim().toUpperCase().split(/\s+/);
      const ticker = parts[0];
      if (ticker && ticker.length <= 5) {
        onExecuteCommand(ticker, command.id.toUpperCase());
      }
    } else {
      command.action();
    }
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <Container onClick={(e) => e.stopPropagation()}>
        <SearchInput
          ref={inputRef}
          type="text"
          placeholder="Type a command or search... (e.g., 'AAPL DES', 'split view', 'shortcuts')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        
        <ResultsList>
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd, index) => (
              <ResultItem
                key={cmd.id}
                $isSelected={index === selectedIndex}
                onClick={() => executeCommand(cmd)}
              >
                <Icon>{cmd.icon}</Icon>
                <Details>
                  <Title>{cmd.title}</Title>
                  <Description>{cmd.description}</Description>
                </Details>
                {cmd.shortcut && <Shortcut>{cmd.shortcut}</Shortcut>}
              </ResultItem>
            ))
          ) : (
            <NoResults>
              No commands found matching "{query}"
            </NoResults>
          )}
        </ResultsList>
        
        <Hint>
          <span>↑↓ Navigate | Enter Execute | Esc Close</span>
          <span>Tip: Try "AAPL DES" or "split"</span>
        </Hint>
      </Container>
    </Overlay>
  );
};

export default CommandPalette;
