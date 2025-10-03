import styled from 'styled-components';

const HeaderContainer = styled.div`
  background-color: #0a0a0a;
  padding: 5px 10px;
  border-bottom: 1px solid #00ff00;
  font-size: 11px;
  color: #00ffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PanelTitle = styled.div`
  font-weight: bold;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const IconButton = styled.button`
  background: transparent;
  border: 1px solid #00ff00;
  color: #00ff00;
  width: 20px;
  height: 20px;
  padding: 0;
  cursor: pointer;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover {
    background-color: #00ff00;
    color: #000000;
    box-shadow: 0 0 3px #00ff00;
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const FunctionMenu = styled.div`
  position: relative;
  display: inline-block;
`;

const FunctionMenuButton = styled(IconButton)`
  width: auto;
  padding: 0 6px;
  font-size: 10px;
  font-family: 'Courier New', monospace;
`;

const FunctionDropdown = styled.div<{ $show: boolean }>`
  display: ${props => props.$show ? 'block' : 'none'};
  position: absolute;
  right: 0;
  top: 100%;
  background-color: #000000;
  border: 1px solid #00ff00;
  min-width: 150px;
  z-index: 100;
  margin-top: 2px;
`;

const FunctionMenuItem = styled.div`
  padding: 6px 10px;
  color: #00ff00;
  cursor: pointer;
  font-size: 11px;
  border-bottom: 1px solid #1a1a1a;
  
  &:hover {
    background-color: #00ff00;
    color: #000000;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const FunctionCode = styled.span`
  font-weight: bold;
  margin-right: 6px;
`;

interface PanelHeaderProps {
  panelId: number;
  ticker: string;
  functionCode: string;
  isActive: boolean;
  onClear: () => void;
  onFunctionSelect: (func: string) => void;
  showFunctionMenu: boolean;
  onToggleFunctionMenu: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

const availableFunctions = [
  { code: 'DES', name: 'Description', enabled: true },
  { code: 'GIP', name: 'Chart', enabled: true },
  { code: 'NEWS', name: 'News', enabled: false },
  { code: 'FA', name: 'Fundamentals', enabled: false },
  { code: 'RISK', name: 'Risk Metrics', enabled: false },
];

const PanelHeader = ({
  panelId,
  ticker,
  functionCode,
  onClear,
  onFunctionSelect,
  showFunctionMenu,
  onToggleFunctionMenu,
  isFullscreen,
  onToggleFullscreen
}: PanelHeaderProps) => {
  return (
    <HeaderContainer>
      <LeftSection>
        <PanelTitle>
          PANEL {panelId}
          {ticker && functionCode && ` | ${ticker} ${functionCode}`}
          {isFullscreen && <span style={{ color: '#ffff00', marginLeft: '8px' }}>⛶ FULLSCREEN</span>}
        </PanelTitle>
      </LeftSection>
      
      <RightSection>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onToggleFullscreen();
          }}
          title={isFullscreen ? "Exit Fullscreen (Ctrl+F or ESC)" : "Fullscreen (Ctrl+F)"}
        >
          {isFullscreen ? '⛶' : '⛶'}
        </IconButton>
        
        <FunctionMenu>
          <FunctionMenuButton
            onClick={onToggleFunctionMenu}
            title="Select Function"
          >
            FN ▼
          </FunctionMenuButton>
          <FunctionDropdown $show={showFunctionMenu}>
            {availableFunctions.map(func => (
              <FunctionMenuItem
                key={func.code}
                onClick={() => {
                  if (func.enabled) {
                    onFunctionSelect(func.code);
                    onToggleFunctionMenu();
                  }
                }}
                style={{
                  opacity: func.enabled ? 1 : 0.5,
                  cursor: func.enabled ? 'pointer' : 'not-allowed'
                }}
              >
                <FunctionCode>{func.code}</FunctionCode>
                {func.name}
                {!func.enabled && ' (Soon)'}
              </FunctionMenuItem>
            ))}
          </FunctionDropdown>
        </FunctionMenu>
        
        <IconButton
          onClick={onClear}
          title="Clear Panel"
          disabled={!ticker && !functionCode}
        >
          ✕
        </IconButton>
      </RightSection>
    </HeaderContainer>
  );
};

export default PanelHeader;
