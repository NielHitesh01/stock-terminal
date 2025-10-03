import styled from 'styled-components';

const Container = styled.div`
  padding: 15px;
  color: #00ff00;
  height: 100%;
  overflow-y: auto;
`;

const Header = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #00ffff;
  margin-bottom: 10px;
  text-align: center;
  letter-spacing: 2px;
  text-shadow: 0 0 10px #00ffff;
`;

const Version = styled.div`
  text-align: center;
  color: #666666;
  font-size: 10px;
  margin-bottom: 20px;
`;

const Section = styled.div`
  margin-bottom: 25px;
`;

const SectionTitle = styled.div`
  font-size: 13px;
  font-weight: bold;
  color: #ffff00;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid #333333;
  padding-bottom: 5px;
`;

const CommandCard = styled.div`
  background-color: #0a0a0a;
  border: 1px solid #333333;
  padding: 12px;
  margin-bottom: 12px;
  
  &:hover {
    border-color: #00ff00;
  }
`;

const CommandHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const Mnemonic = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #00ff00;
  letter-spacing: 1px;
`;

const Category = styled.div`
  font-size: 9px;
  color: #666666;
  text-transform: uppercase;
  background-color: #1a1a1a;
  padding: 3px 8px;
  border-radius: 2px;
`;

const CommandName = styled.div`
  color: #00ffff;
  font-size: 12px;
  margin-bottom: 8px;
`;

const Description = styled.div`
  color: #00ff00;
  font-size: 11px;
  margin-bottom: 8px;
  line-height: 1.4;
`;

const Usage = styled.div`
  background-color: #000000;
  border-left: 2px solid #00ff00;
  padding: 6px 10px;
  font-size: 11px;
  color: #00ffff;
  margin-bottom: 8px;
  font-family: 'Courier New', monospace;
`;

const Examples = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 8px;
`;

const Example = styled.div`
  background-color: #000000;
  border: 1px solid #333333;
  padding: 4px 8px;
  font-size: 10px;
  color: #ffff00;
  cursor: pointer;
  
  &:hover {
    border-color: #ffff00;
    background-color: #1a1a1a;
  }
`;

const Features = styled.ul`
  list-style: none;
  padding: 0;
  margin: 8px 0 0 0;
`;

const Feature = styled.li`
  font-size: 10px;
  color: #666666;
  padding-left: 15px;
  position: relative;
  line-height: 1.6;
  
  &:before {
    content: '▸';
    position: absolute;
    left: 0;
    color: #00ff00;
  }
`;

const ShortcutsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 10px;
`;

const ShortcutItem = styled.div`
  background-color: #0a0a0a;
  border: 1px solid #333333;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ShortcutKeys = styled.div`
  font-weight: bold;
  color: #00ffff;
  font-size: 11px;
`;

const ShortcutDesc = styled.div`
  color: #00ff00;
  font-size: 10px;
`;

const TipsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Tip = styled.div`
  background-color: #0a0a0a;
  border-left: 3px solid #ffff00;
  padding: 8px 12px;
  font-size: 11px;
  color: #00ff00;
  line-height: 1.4;
`;

interface HELPFunctionProps {
  data: any;
}

const HELPFunction = ({ data }: HELPFunctionProps) => {
  if (!data) {
    return (
      <Container>
        <Header>HELP - Command Reference</Header>
        <Version>Loading...</Version>
      </Container>
    );
  }

  return (
    <Container>
      <Header>{data.title || 'TERMINAL-A Command Reference'}</Header>
      <Version>Version {data.version || '1.0.0'}</Version>

      {/* Commands Section */}
      {data.commands && data.commands.length > 0 && (
        <Section>
          <SectionTitle>Available Commands</SectionTitle>
          {data.commands.map((cmd: any, index: number) => (
            <CommandCard key={index}>
              <CommandHeader>
                <Mnemonic>{cmd.mnemonic}</Mnemonic>
                <Category>{cmd.category}</Category>
              </CommandHeader>
              <CommandName>{cmd.name}</CommandName>
              <Description>{cmd.description}</Description>
              <Usage>Usage: {cmd.usage}</Usage>
              {cmd.examples && cmd.examples.length > 0 && (
                <Examples>
                  {cmd.examples.map((example: string, i: number) => (
                    <Example key={i} title="Click to copy">
                      {example}
                    </Example>
                  ))}
                </Examples>
              )}
              {cmd.features && cmd.features.length > 0 && (
                <Features>
                  {cmd.features.map((feature: string, i: number) => (
                    <Feature key={i}>{feature}</Feature>
                  ))}
                </Features>
              )}
            </CommandCard>
          ))}
        </Section>
      )}

      {/* Keyboard Shortcuts */}
      {data.shortcuts && data.shortcuts.length > 0 && (
        <Section>
          <SectionTitle>Keyboard Shortcuts</SectionTitle>
          <ShortcutsGrid>
            {data.shortcuts.map((shortcut: any, index: number) => (
              <ShortcutItem key={index}>
                <ShortcutKeys>{shortcut.keys}</ShortcutKeys>
                <ShortcutDesc>{shortcut.description}</ShortcutDesc>
              </ShortcutItem>
            ))}
          </ShortcutsGrid>
        </Section>
      )}

      {/* Tips Section */}
      {data.tips && data.tips.length > 0 && (
        <Section>
          <SectionTitle>Tips & Best Practices</SectionTitle>
          <TipsList>
            {data.tips.map((tip: string, index: number) => (
              <Tip key={index}>💡 {tip}</Tip>
            ))}
          </TipsList>
        </Section>
      )}
    </Container>
  );
};

export default HELPFunction;
