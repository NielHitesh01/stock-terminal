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
  min-width: 500px;
  max-width: 700px;
  max-height: 80vh;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 999;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #00ff00;
`;

const Title = styled.h2`
  color: #00ff00;
  font-size: 18px;
  margin: 0;
`;

const CloseButton = styled.button`
  background: transparent;
  border: 1px solid #ff0000;
  color: #ff0000;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background-color: #ff0000;
    color: #000000;
  }
`;

const Section = styled.div`
  margin-bottom: 25px;
`;

const SectionTitle = styled.h3`
  color: #00ffff;
  font-size: 14px;
  margin: 0 0 10px 0;
  text-transform: uppercase;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
`;

const Input = styled.input`
  flex: 1;
  background-color: #0a0a0a;
  border: 1px solid #00ff00;
  color: #00ff00;
  padding: 8px 12px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  
  &:focus {
    outline: none;
    border-color: #00ffff;
    box-shadow: 0 0 5px rgba(0, 255, 255, 0.3);
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
  padding: 8px 16px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  white-space: nowrap;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => 
      props.$variant === 'danger' ? '#ff0000' :
      props.$variant === 'secondary' ? '#00ffff' : '#00ff00'
    };
    color: #000000;
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const LayoutList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const LayoutItem = styled.div`
  background-color: #0a0a0a;
  border: 1px solid #333333;
  padding: 12px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #00ff00;
    background-color: #1a1a1a;
  }
`;

const LayoutInfo = styled.div`
  flex: 1;
`;

const LayoutName = styled.div`
  color: #00ff00;
  font-weight: bold;
  margin-bottom: 4px;
`;

const LayoutMeta = styled.div`
  color: #666666;
  font-size: 10px;
`;

const LayoutActions = styled.div`
  display: flex;
  gap: 8px;
`;

const EmptyState = styled.div`
  text-align: center;
  color: #666666;
  padding: 30px;
  font-size: 12px;
`;

const Message = styled.div<{ $type: 'success' | 'error' }>`
  background-color: ${props => props.$type === 'success' ? '#00330022' : '#33000022'};
  border: 1px solid ${props => props.$type === 'success' ? '#00ff00' : '#ff0000'};
  color: ${props => props.$type === 'success' ? '#00ff00' : '#ff0000'};
  padding: 10px;
  margin-bottom: 15px;
  font-size: 12px;
  border-radius: 3px;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

interface LayoutManagerProps {
  currentPanels: PanelState[];
  onClose: () => void;
  onLoadLayout: (panels: PanelState[]) => void;
  onSaveSuccess: (name: string) => void;
}

const LayoutManager = ({ currentPanels, onClose, onLoadLayout, onSaveSuccess }: LayoutManagerProps) => {
  const [layouts, setLayouts] = useState<SavedLayout[]>(listLayouts());
  const [newLayoutName, setNewLayoutName] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
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
      showMessage('success', `Layout "${newLayoutName}" saved successfully`);
      setLayouts(listLayouts());
      setNewLayoutName('');
      onSaveSuccess(newLayoutName.trim());
    } else {
      showMessage('error', 'Failed to save layout');
    }
  };

  const handleLoad = (name: string) => {
    const panels = loadLayout(name);
    if (panels) {
      onLoadLayout(panels);
      showMessage('success', `Layout "${name}" loaded`);
      setTimeout(onClose, 1000);
    } else {
      showMessage('error', 'Failed to load layout');
    }
  };

  const handleDelete = (name: string) => {
    if (confirm(`Delete layout "${name}"?`)) {
      const success = deleteLayout(name);
      if (success) {
        showMessage('success', `Layout "${name}" deleted`);
        setLayouts(listLayouts());
      } else {
        showMessage('error', 'Failed to delete layout');
      }
    }
  };

  const handleExport = () => {
    exportLayouts();
    showMessage('success', 'Layouts exported to file');
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const success = await importLayouts(file);
      if (success) {
        showMessage('success', 'Layouts imported successfully');
        setLayouts(listLayouts());
      } else {
        showMessage('error', 'Failed to import layouts');
      }
    }
    e.target.value = ''; // Reset file input
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Overlay onClick={onClose} />
      <ManagerContainer>
        <Header>
          <Title>⚙️ Layout Manager</Title>
          <CloseButton onClick={onClose}>✕ Close</CloseButton>
        </Header>

        {message && (
          <Message $type={message.type}>{message.text}</Message>
        )}

        <Section>
          <SectionTitle>💾 Save Current Layout</SectionTitle>
          <InputGroup>
            <Input
              type="text"
              placeholder="Enter layout name..."
              value={newLayoutName}
              onChange={(e) => setNewLayoutName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSave()}
            />
            <Button onClick={handleSave} disabled={!newLayoutName.trim()}>
              Save
            </Button>
          </InputGroup>
        </Section>

        <Section>
          <SectionTitle>📂 Saved Layouts ({layouts.length})</SectionTitle>
          <LayoutList>
            {layouts.length === 0 ? (
              <EmptyState>
                No saved layouts yet.<br />
                Save your current panel configuration to get started!
              </EmptyState>
            ) : (
              layouts.map(layout => (
                <LayoutItem key={layout.name}>
                  <LayoutInfo onClick={() => handleLoad(layout.name)}>
                    <LayoutName>{layout.name}</LayoutName>
                    <LayoutMeta>
                      {layout.panels.filter(p => p.ticker).length} active panels • 
                      Updated: {formatDate(layout.updatedAt)}
                    </LayoutMeta>
                  </LayoutInfo>
                  <LayoutActions>
                    <Button 
                      $variant="secondary" 
                      onClick={() => handleLoad(layout.name)}
                    >
                      Load
                    </Button>
                    <Button 
                      $variant="danger" 
                      onClick={() => handleDelete(layout.name)}
                    >
                      Delete
                    </Button>
                  </LayoutActions>
                </LayoutItem>
              ))
            )}
          </LayoutList>
        </Section>

        <Section>
          <SectionTitle>📤 Import / Export</SectionTitle>
          <InputGroup>
            <Button $variant="secondary" onClick={handleExport} disabled={layouts.length === 0}>
              Export All Layouts
            </Button>
            <Button $variant="secondary" onClick={() => document.getElementById('layout-import')?.click()}>
              Import Layouts
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

export default LayoutManager;
