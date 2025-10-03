import { useState } from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(4px);
`;

const Modal = styled.div`
  background: #0a0a0a;
  border: 2px solid #00ff00;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 0 30px rgba(0, 255, 0, 0.3);
`;

const Header = styled.div`
  padding: 20px;
  border-bottom: 1px solid #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: #0a0a0a;
  z-index: 1;
`;

const Title = styled.h2`
  color: #00ffff;
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
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: #ff0000;
    color: #000;
  }
`;

const Content = styled.div`
  padding: 20px;
`;

const SearchBox = styled.input`
  width: 100%;
  padding: 12px;
  background: #1a1a1a;
  border: 1px solid #333;
  color: #00ff00;
  font-size: 14px;
  border-radius: 4px;
  margin-bottom: 20px;
  
  &:focus {
    outline: none;
    border-color: #00ff00;
  }
  
  &::placeholder {
    color: #666;
  }
`;

const Category = styled.div`
  margin-bottom: 30px;
`;

const CategoryTitle = styled.h3`
  color: #ffff00;
  font-size: 16px;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid #333;
`;

const ShortcutRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #1a1a1a;
  margin-bottom: 8px;
  border-radius: 4px;
  transition: all 0.2s;
  
  &:hover {
    background: #2a2a2a;
    border-left: 3px solid #00ff00;
  }
`;

const Description = styled.div`
  color: #00ff00;
  font-size: 13px;
  flex: 1;
`;

const Keys = styled.div`
  display: flex;
  gap: 5px;
`;

const Key = styled.kbd`
  background: #000;
  border: 1px solid #00ff00;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  color: #00ff00;
  font-family: 'Courier New', monospace;
  box-shadow: 0 2px 0 #00ff00;
  min-width: 30px;
  text-align: center;
`;

const Separator = styled.span`
  color: #666;
  margin: 0 4px;
`;

interface Shortcut {
  keys: string[];
  description: string;
  category: string;
}

const shortcuts: Shortcut[] = [
  // Navigation
  { keys: ['Ctrl', 'T'], description: 'New Tab', category: 'Navigation' },
  { keys: ['Ctrl', 'W'], description: 'Close Current Tab', category: 'Navigation' },
  { keys: ['Ctrl', 'Tab'], description: 'Next Tab', category: 'Navigation' },
  { keys: ['Ctrl', 'Shift', 'Tab'], description: 'Previous Tab', category: 'Navigation' },
  { keys: ['Ctrl', '1-9'], description: 'Jump to Tab 1-9', category: 'Navigation' },
  
  // View Modes
  { keys: ['Ctrl', '4'], description: 'Toggle 4-Terminal Split View', category: 'View Modes' },
  { keys: ['Ctrl', 'Shift', 'H'], description: 'Hide/Show Header', category: 'View Modes' },
  { keys: ['F11'], description: 'Toggle Fullscreen', category: 'View Modes' },
  
  // Functions
  { keys: ['Ctrl', 'H'], description: 'Toggle Command Line', category: 'Functions' },
  { keys: ['Ctrl', 'P'], description: 'Command Palette', category: 'Functions' },
  { keys: ['Ctrl', '?'], description: 'Show Keyboard Shortcuts', category: 'Functions' },
  { keys: ['Ctrl', 'A'], description: 'Show Alerts Panel', category: 'Functions' },
  
  // Layout Management
  { keys: ['Ctrl', 'S'], description: 'Save Current Layout', category: 'Layout' },
  { keys: ['Ctrl', 'L'], description: 'Load Layout', category: 'Layout' },
  { keys: ['Ctrl', 'Shift', 'L'], description: 'Layout Manager', category: 'Layout' },
  
  // Command Input
  { keys: ['↑'], description: 'Previous Command (History)', category: 'Command Input' },
  { keys: ['↓'], description: 'Next Command (History)', category: 'Command Input' },
  { keys: ['Enter'], description: 'Execute Command', category: 'Command Input' },
  { keys: ['Esc'], description: 'Clear Input / Close Modal', category: 'Command Input' },
  
  // Data Actions
  { keys: ['Ctrl', 'E'], description: 'Export Data to CSV', category: 'Data Actions' },
  { keys: ['Ctrl', 'R'], description: 'Refresh Data', category: 'Data Actions' },
  { keys: ['Ctrl', 'F'], description: 'Find in Data', category: 'Data Actions' },
  
  // Quick Access
  { keys: ['Alt', 'D'], description: 'Quick DES Function', category: 'Quick Access' },
  { keys: ['Alt', 'G'], description: 'Quick GIP Function', category: 'Quick Access' },
  { keys: ['Alt', 'F'], description: 'Quick FA Function', category: 'Quick Access' },
  { keys: ['Alt', 'N'], description: 'Quick News Function', category: 'Quick Access' },
  { keys: ['Alt', 'W'], description: 'Quick Watchlist', category: 'Quick Access' },
];

interface KeyboardShortcutsPanelProps {
  onClose: () => void;
}

const KeyboardShortcutsPanel = ({ onClose }: KeyboardShortcutsPanelProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredShortcuts = shortcuts.filter(shortcut =>
    shortcut.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shortcut.keys.some(key => key.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const categories = Array.from(new Set(filteredShortcuts.map(s => s.category)));

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>
            <span>⌨️</span>
            Keyboard Shortcuts
          </Title>
          <CloseButton onClick={onClose}>Close</CloseButton>
        </Header>
        <Content>
          <SearchBox
            type="text"
            placeholder="Search shortcuts... (e.g., 'tab', 'Ctrl', 'split')"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          
          {categories.map(category => {
            const categoryShortcuts = filteredShortcuts.filter(s => s.category === category);
            if (categoryShortcuts.length === 0) return null;
            
            return (
              <Category key={category}>
                <CategoryTitle>{category}</CategoryTitle>
                {categoryShortcuts.map((shortcut, index) => (
                  <ShortcutRow key={index}>
                    <Description>{shortcut.description}</Description>
                    <Keys>
                      {shortcut.keys.map((key, i) => (
                        <span key={i}>
                          <Key>{key}</Key>
                          {i < shortcut.keys.length - 1 && <Separator>+</Separator>}
                        </span>
                      ))}
                    </Keys>
                  </ShortcutRow>
                ))}
              </Category>
            );
          })}
          
          {filteredShortcuts.length === 0 && (
            <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
              No shortcuts found matching "{searchTerm}"
            </div>
          )}
        </Content>
      </Modal>
    </Overlay>
  );
};

export default KeyboardShortcutsPanel;
