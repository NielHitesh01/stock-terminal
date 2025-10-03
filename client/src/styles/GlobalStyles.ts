import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Courier New', monospace;
    background-color: #000000;
    color: #00ff00;
    overflow: hidden;
    height: 100vh;
    width: 100vw;
  }

  #root {
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #1a1a1a;
  }

  ::-webkit-scrollbar-thumb {
    background: #00ff00;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #00cc00;
  }

  /* Selection */
  ::selection {
    background-color: #00ff00;
    color: #000000;
  }

  /* Focus outline */
  *:focus {
    outline: 2px solid #00ff00;
    outline-offset: 2px;
  }

  /* Disable text selection for UI elements */
  button, .no-select {
    user-select: none;
  }

  /* High contrast text colors */
  .text-primary {
    color: #00ff00;
  }

  .text-secondary {
    color: #00ffff;
  }

  .text-warning {
    color: #ffff00;
  }

  .text-error {
    color: #ff0000;
  }

  .text-info {
    color: #00ccff;
  }

  .text-muted {
    color: #666666;
  }
`;
