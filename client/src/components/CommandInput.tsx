import { useState, useRef, KeyboardEvent } from 'react';
import styled from 'styled-components';
import { executeCommand } from '../services/api';

const InputContainer = styled.div<{ $isActive: boolean }>`
  background-color: #0f0f0f;
  padding: 8px 10px;
  border-bottom: 1px solid ${props => props.$isActive ? '#00ff00' : '#333333'};
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
`;

const Prompt = styled.span`
  color: #00ff00;
  font-weight: bold;
`;

const Input = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: #00ffff;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  outline: none;
  caret-color: #00ff00;

  &::placeholder {
    color: #666666;
  }

  &:disabled {
    opacity: 0.5;
  }
`;

const GoButton = styled.span<{ $visible: boolean }>`
  color: #ffff00;
  font-weight: bold;
  visibility: ${props => props.$visible ? 'visible' : 'hidden'};
`;

interface CommandInputProps {
  panelId: number;
  isActive: boolean;
  updatePanel: (panelId: number, updates: any) => void;
  setStatusMessage: (message: string) => void;
}

const CommandInput = ({ panelId, isActive, updatePanel, setStatusMessage }: CommandInputProps) => {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const parseCommand = (cmd: string): { ticker: string; func: string } | null => {
    const parts = cmd.trim().toUpperCase().split(/\s+/);
    
    // Special case for system commands (no ticker needed)
    const systemCommands = ['HELP', 'W', 'EQS'];
    if (parts.length === 1 && systemCommands.includes(parts[0])) {
      return {
        ticker: 'SYSTEM',
        func: parts[0]
      };
    }
    
    if (parts.length < 2) return null;

    return {
      ticker: parts[0],
      func: parts[1]
    };
  };

  const handleExecute = async () => {
    if (!command.trim()) return;

    const parsed = parseCommand(command);
    if (!parsed) {
      setStatusMessage(`Invalid command format. Use: TICKER FUNCTION or W/EQS/HELP`);
      return;
    }

    // Add to history
    setHistory(prev => [...prev, command]);
    setHistoryIndex(-1);

    // Update panel state
    updatePanel(panelId, {
      ticker: parsed.ticker,
      function: parsed.func,
      loading: true,
      error: null,
      data: null
    });

    const systemCommands = ['HELP', 'W', 'EQS'];
    const isSystemCommand = systemCommands.includes(parsed.func);
    setStatusMessage(`Executing: ${isSystemCommand ? parsed.func : `${parsed.ticker} ${parsed.func}`}...`);

    try {
      console.log('Executing command:', parsed.ticker, parsed.func);
      const data = await executeCommand(parsed.ticker, parsed.func);
      console.log('Command success, data:', data);
      updatePanel(panelId, {
        loading: false,
        data: data
      });
      const isSystemCommand = systemCommands.includes(parsed.func);
      setStatusMessage(`Success: ${isSystemCommand ? parsed.func : `${parsed.ticker} ${parsed.func}`} loaded`);
    } catch (error: any) {
      console.error('Command error:', error.message);
      console.log('Updating panel with error:', error.message);
      updatePanel(panelId, {
        loading: false,
        error: error.message || 'Failed to fetch data'
      });
      setStatusMessage(`Error: ${error.message || 'Unknown error'}`);
    }

    setCommand('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleExecute();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setCommand(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(history[history.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommand('');
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setCommand('');
    }
  };

  return (
    <InputContainer $isActive={isActive}>
      <Prompt>&gt;</Prompt>
      <Input
        ref={inputRef}
        type="text"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="TICKER FUNCTION <GO>"
        disabled={!isActive}
      />
      <GoButton $visible={command.length > 0}>&lt;GO&gt;</GoButton>
    </InputContainer>
  );
};

export default CommandInput;
