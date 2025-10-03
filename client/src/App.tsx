import styled from 'styled-components';
import Terminal from './components/Terminal';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: #000000;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const Header = styled.header`
  background-color: #0a0a0a;
  border-bottom: 2px solid #00ff00;
  padding: 8px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #00ff00;
  letter-spacing: 2px;
  text-shadow: 0 0 10px #00ff00;
`;

const SystemInfo = styled.div`
  font-size: 11px;
  color: #00ffff;
  display: flex;
  gap: 15px;
`;

const InfoItem = styled.span`
  &:not(:last-child)::after {
    content: '|';
    margin-left: 15px;
    color: #666666;
  }
`;

function App() {
  const currentTime = new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <AppContainer>
      <Header>
        <Logo>TERMINAL-A</Logo>
        <SystemInfo>
          <InfoItem>NYSE: {currentTime} EST</InfoItem>
          <InfoItem>User: TRADER_01</InfoItem>
          <InfoItem>Status: LIVE</InfoItem>
        </SystemInfo>
      </Header>
      <Terminal />
    </AppContainer>
  );
}

export default App;
