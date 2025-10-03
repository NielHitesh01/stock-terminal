import styled from 'styled-components';
import Panel from './Panel';
import { PanelState } from './Terminal';

const GridContainer = styled.div<{ $fullscreenPanel: number | null }>`
  flex: 1;
  display: grid;
  grid-template-columns: ${props => props.$fullscreenPanel !== null ? '1fr' : '1fr 1fr'};
  grid-template-rows: ${props => props.$fullscreenPanel !== null ? '1fr' : '1fr 1fr'};
  gap: 2px;
  background-color: #00ff00;
  padding: 2px;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
`;

interface PanelGridProps {
  panels: PanelState[];
  activePanel: number;
  onPanelClick: (id: number) => void;
  updatePanel: (panelId: number, updates: Partial<PanelState>) => void;
  setStatusMessage: (message: string) => void;
  showCommandLine: boolean;
  fullscreenPanel: number | null;
  onToggleFullscreen: (panelId: number) => void;
}

const PanelGrid = ({ 
  panels, 
  activePanel, 
  onPanelClick, 
  updatePanel,
  setStatusMessage,
  showCommandLine,
  fullscreenPanel,
  onToggleFullscreen
}: PanelGridProps) => {
  const displayPanels = fullscreenPanel !== null 
    ? panels.filter(panel => panel.id === fullscreenPanel)
    : panels;

  return (
    <GridContainer $fullscreenPanel={fullscreenPanel}>
      {displayPanels.map(panel => (
        <Panel
          key={panel.id}
          panel={panel}
          isActive={panel.id === activePanel}
          onClick={() => onPanelClick(panel.id)}
          updatePanel={updatePanel}
          setStatusMessage={setStatusMessage}
          showCommandLine={showCommandLine}
          isFullscreen={fullscreenPanel === panel.id}
          onToggleFullscreen={() => onToggleFullscreen(panel.id)}
        />
      ))}
    </GridContainer>
  );
};

export default PanelGrid;
