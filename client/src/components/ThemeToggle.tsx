import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

const ToggleButton = styled.button<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? '#1a1a1a' : '#e0e0e0'};
  border: 1px solid ${props => props.$isDark ? '#00ff00' : '#0066cc'};
  border-radius: 20px;
  padding: 6px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.$isDark ? '#00ff00' : '#0066cc'};
  font-size: 12px;
  font-weight: bold;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.$isDark ? '#2a2a2a' : '#d0d0d0'};
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const Icon = styled.span`
  font-size: 16px;
  display: flex;
  align-items: center;
`;

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme.mode === 'dark';

  return (
    <ToggleButton $isDark={isDark} onClick={toggleTheme} title="Toggle theme">
      <Icon>{isDark ? '🌙' : '☀️'}</Icon>
      <span>{isDark ? 'Dark' : 'Light'}</span>
    </ToggleButton>
  );
};

export default ThemeToggle;
