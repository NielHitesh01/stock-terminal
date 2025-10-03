import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import * as XLSX from 'xlsx';

ChartJS.register(ArcElement, Tooltip, Legend);

// ============================================================================
// INTERFACES
// ============================================================================

interface Holding {
  id: string;
  ticker: string;
  shares: number;
  costBasis: number;
  purchaseDate: string;
  currentPrice?: number;
  currentValue?: number;
  gainLoss?: number;
  gainLossPercent?: number;
  dayChange?: number;
  dayChangePercent?: number;
}

interface PortfolioSummary {
  totalValue: number;
  totalCost: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  dayChange: number;
  dayChangePercent: number;
}

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #000000;
  color: #00ff00;
  font-family: 'Courier New', monospace;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  border-bottom: 2px solid #00ff00;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #00ff00;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Controls = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button<{ $variant?: string }>`
  background: ${props => 
    props.$variant === 'primary' ? '#00ff00' :
    props.$variant === 'danger' ? '#ff0000' :
    'transparent'
  };
  color: ${props => 
    props.$variant === 'primary' || props.$variant === 'danger' ? '#000000' : '#00ff00'
  };
  border: 2px solid ${props => 
    props.$variant === 'primary' ? '#00ff00' :
    props.$variant === 'danger' ? '#ff0000' :
    '#00ff00'
  };
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  font-weight: bold;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => 
      props.$variant === 'primary' ? 'rgba(0, 255, 0, 0.3)' :
      props.$variant === 'danger' ? 'rgba(255, 0, 0, 0.3)' :
      'rgba(0, 255, 0, 0.3)'
    };
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SummarySection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 15px;
  padding: 20px;
  background: #0a0a0a;
  border-bottom: 1px solid #00ff00;
`;

const SummaryCard = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  border: 2px solid #00ff00;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SummaryLabel = styled.div`
  font-size: 11px;
  color: #00ff00;
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const SummaryValue = styled.div<{ $color?: string }>`
  font-size: 24px;
  font-weight: bold;
  color: ${props => props.$color || '#00ff00'};
`;

const SummarySubtext = styled.div<{ $color?: string }>`
  font-size: 12px;
  color: ${props => props.$color || '#00ff00'};
  opacity: 0.8;
`;

const ContentArea = styled.div`
  display: flex;
  flex: 1;
  gap: 15px;
  padding: 15px;
  overflow: hidden;
`;

const TableSection = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ChartSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #0a0a0a;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #00ff00;
    border-radius: 4px;
  }
`;

const ChartCard = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  border: 2px solid #00ff00;
  border-radius: 8px;
  padding: 15px;
`;

const ChartTitle = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #00ff00;
  margin-bottom: 15px;
  text-align: center;
`;

const Table = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 2px solid #00ff00;
  border-radius: 8px;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 100px 80px 100px 100px 100px 100px 120px 120px 80px;
  background: #1a1a1a;
  border-bottom: 2px solid #00ff00;
  padding: 10px;
  font-weight: bold;
  font-size: 11px;
  color: #00ff00;
  text-transform: uppercase;
`;

const TableBody = styled.div`
  flex: 1;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 12px;
  }
  
  &::-webkit-scrollbar-track {
    background: #0a0a0a;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #00ff00;
    border-radius: 6px;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 100px 80px 100px 100px 100px 100px 120px 120px 80px;
  padding: 12px 10px;
  border-bottom: 1px solid #333333;
  font-size: 12px;
  transition: background 0.2s;
  align-items: center;

  &:hover {
    background: #1a1a1a;
  }
`;

const TableCell = styled.div<{ $align?: string; $color?: string }>`
  text-align: ${props => props.$align || 'left'};
  color: ${props => props.$color || '#00ff00'};
`;

const TickerCell = styled(TableCell)`
  font-weight: bold;
  font-size: 14px;
  color: #00ffff;
`;

const ActionCell = styled.div`
  display: flex;
  gap: 5px;
  justify-content: center;
`;

const IconButton = styled.button`
  background: transparent;
  border: 1px solid #00ff00;
  color: #00ff00;
  padding: 4px 8px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 11px;
  transition: all 0.2s;

  &:hover {
    background: #00ff00;
    color: #000000;
  }
`;

const Modal = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  border: 2px solid #00ff00;
  border-radius: 8px;
  padding: 25px;
  min-width: 500px;
  max-width: 600px;
`;

const ModalHeader = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #00ff00;
  margin-bottom: 20px;
  text-align: center;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-size: 12px;
  color: #00ff00;
  text-transform: uppercase;
`;

const Input = styled.input`
  background: #000000;
  border: 2px solid #00ff00;
  color: #00ff00;
  padding: 10px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 14px;

  &:focus {
    outline: none;
    box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 10px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #00ff00;
  opacity: 0.5;
  gap: 15px;
`;

const EmptyIcon = styled.div`
  font-size: 64px;
`;

const EmptyText = styled.div`
  font-size: 16px;
  text-align: center;
`;

// ============================================================================
// COMPONENT
// ============================================================================

const PortfolioTracker: React.FC = () => {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHolding, setEditingHolding] = useState<Holding | null>(null);
  const [formData, setFormData] = useState({
    ticker: '',
    shares: '',
    costBasis: '',
    purchaseDate: new Date().toISOString().split('T')[0]
  });

  // Load holdings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('portfolio-holdings');
    if (saved) {
      setHoldings(JSON.parse(saved));
    }
  }, []);

  // Save holdings to localStorage
  useEffect(() => {
    if (holdings.length > 0) {
      localStorage.setItem('portfolio-holdings', JSON.stringify(holdings));
    }
  }, [holdings]);

  // Simulate real-time price updates
  useEffect(() => {
    const updatePrices = () => {
      setHoldings(prev => prev.map(holding => {
        // Simulate price movement (replace with real API)
        const mockPrice = holding.costBasis * (1 + (Math.random() - 0.4) * 0.3);
        const currentValue = mockPrice * holding.shares;
        const gainLoss = currentValue - (holding.costBasis * holding.shares);
        const gainLossPercent = (gainLoss / (holding.costBasis * holding.shares)) * 100;
        const dayChange = mockPrice * 0.01 * (Math.random() - 0.5);
        const dayChangePercent = (dayChange / mockPrice) * 100;

        return {
          ...holding,
          currentPrice: mockPrice,
          currentValue,
          gainLoss,
          gainLossPercent,
          dayChange,
          dayChangePercent
        };
      }));
    };

    updatePrices();
    const interval = setInterval(updatePrices, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [holdings.length]);

  const calculateSummary = (): PortfolioSummary => {
    const totalValue = holdings.reduce((sum, h) => sum + (h.currentValue || 0), 0);
    const totalCost = holdings.reduce((sum, h) => sum + (h.costBasis * h.shares), 0);
    const totalGainLoss = totalValue - totalCost;
    const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;
    const dayChange = holdings.reduce((sum, h) => sum + ((h.dayChange || 0) * h.shares), 0);
    const dayChangePercent = totalValue > 0 ? (dayChange / totalValue) * 100 : 0;

    return {
      totalValue,
      totalCost,
      totalGainLoss,
      totalGainLossPercent,
      dayChange,
      dayChangePercent
    };
  };

  const handleAddHolding = () => {
    if (!formData.ticker || !formData.shares || !formData.costBasis) {
      alert('Please fill in all fields');
      return;
    }

    const newHolding: Holding = {
      id: Date.now().toString(),
      ticker: formData.ticker.toUpperCase(),
      shares: parseFloat(formData.shares),
      costBasis: parseFloat(formData.costBasis),
      purchaseDate: formData.purchaseDate
    };

    setHoldings(prev => [...prev, newHolding]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditHolding = () => {
    if (!editingHolding || !formData.ticker || !formData.shares || !formData.costBasis) {
      alert('Please fill in all fields');
      return;
    }

    setHoldings(prev => prev.map(h => 
      h.id === editingHolding.id
        ? {
            ...h,
            ticker: formData.ticker.toUpperCase(),
            shares: parseFloat(formData.shares),
            costBasis: parseFloat(formData.costBasis),
            purchaseDate: formData.purchaseDate
          }
        : h
    ));

    setEditingHolding(null);
    resetForm();
  };

  const handleDeleteHolding = (id: string) => {
    if (confirm('Are you sure you want to delete this holding?')) {
      setHoldings(prev => prev.filter(h => h.id !== id));
    }
  };

  const openEditModal = (holding: Holding) => {
    setEditingHolding(holding);
    setFormData({
      ticker: holding.ticker,
      shares: holding.shares.toString(),
      costBasis: holding.costBasis.toString(),
      purchaseDate: holding.purchaseDate
    });
  };

  const resetForm = () => {
    setFormData({
      ticker: '',
      shares: '',
      costBasis: '',
      purchaseDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleExportCSV = () => {
    const csv = [
      ['Ticker', 'Shares', 'Cost Basis', 'Current Price', 'Current Value', 'Gain/Loss', 'G/L %', 'Purchase Date'],
      ...holdings.map(h => [
        h.ticker,
        h.shares,
        h.costBasis,
        h.currentPrice?.toFixed(2) || 'N/A',
        h.currentValue?.toFixed(2) || 'N/A',
        h.gainLoss?.toFixed(2) || 'N/A',
        h.gainLossPercent?.toFixed(2) || 'N/A',
        h.purchaseDate
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleExportExcel = () => {
    const summary = calculateSummary();

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Find best and worst performers
    const sortedByPerformance = [...holdings].sort((a, b) => (b.gainLossPercent || 0) - (a.gainLossPercent || 0));
    const bestPerformer = sortedByPerformance[0];
    const worstPerformer = sortedByPerformance[sortedByPerformance.length - 1];

    // Sheet 1: Summary
    const summaryData = [
      ['PORTFOLIO SUMMARY', '', ''],
      ['Date Generated', new Date().toLocaleString()],
      [''],
      ['Total Holdings', holdings.length],
      ['Total Value', `$${summary.totalValue.toFixed(2)}`],
      ['Total Cost', `$${summary.totalCost.toFixed(2)}`],
      ['Total Gain/Loss', `$${summary.totalGainLoss.toFixed(2)}`],
      ['Total Gain/Loss %', `${summary.totalGainLossPercent.toFixed(2)}%`],
      [''],
      ['Best Performer', bestPerformer?.ticker || 'N/A', bestPerformer ? `${bestPerformer.gainLossPercent?.toFixed(2)}%` : ''],
      ['Worst Performer', worstPerformer?.ticker || 'N/A', worstPerformer ? `${worstPerformer.gainLossPercent?.toFixed(2)}%` : '']
    ];
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    wsSummary['!cols'] = [{ width: 20 }, { width: 20 }, { width: 15 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

    // Sheet 2: Holdings
    const holdingsData = [
      ['Ticker', 'Shares', 'Cost Basis', 'Current Price', 'Current Value', 'Gain/Loss', 'G/L %', 'Day Change', 'Day Change %', 'Purchase Date'],
      ...holdings.map(h => [
        h.ticker,
        h.shares,
        h.costBasis,
        h.currentPrice || 0,
        h.currentValue || 0,
        h.gainLoss || 0,
        h.gainLossPercent || 0,
        h.dayChange || 0,
        h.dayChangePercent || 0,
        h.purchaseDate
      ])
    ];
    const wsHoldings = XLSX.utils.aoa_to_sheet(holdingsData);
    wsHoldings['!cols'] = [
      { width: 10 }, // Ticker
      { width: 10 }, // Shares
      { width: 12 }, // Cost Basis
      { width: 14 }, // Current Price
      { width: 14 }, // Current Value
      { width: 12 }, // Gain/Loss
      { width: 10 }, // G/L %
      { width: 12 }, // Day Change
      { width: 14 }, // Day Change %
      { width: 14 }  // Purchase Date
    ];
    XLSX.utils.book_append_sheet(wb, wsHoldings, 'Holdings');

    // Sheet 3: Allocation
    const allocationData = [
      ['Ticker', 'Allocation %', 'Value'],
      ...holdings.map(h => [
        h.ticker,
        summary.totalValue > 0 ? ((h.currentValue || 0) / summary.totalValue * 100).toFixed(2) : 0,
        h.currentValue || 0
      ])
    ];
    const wsAllocation = XLSX.utils.aoa_to_sheet(allocationData);
    wsAllocation['!cols'] = [{ width: 10 }, { width: 14 }, { width: 14 }];
    XLSX.utils.book_append_sheet(wb, wsAllocation, 'Allocation');

    // Export
    XLSX.writeFile(wb, `portfolio-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const summary = calculateSummary();

  // Prepare chart data
  const allocationData = {
    labels: holdings.map(h => h.ticker),
    datasets: [{
      data: holdings.map(h => h.currentValue || 0),
      backgroundColor: [
        '#00ff00',
        '#00ffff',
        '#ffff00',
        '#ff00ff',
        '#00ff80',
        '#ff8000',
        '#8000ff',
        '#ff0080'
      ],
      borderColor: '#000000',
      borderWidth: 2
    }]
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#00ff00',
          font: {
            family: "'Courier New', monospace",
            size: 11
          }
        }
      },
      tooltip: {
        backgroundColor: '#000000',
        titleColor: '#00ff00',
        bodyColor: '#00ff00',
        borderColor: '#00ff00',
        borderWidth: 1,
        titleFont: {
          family: "'Courier New', monospace"
        },
        bodyFont: {
          family: "'Courier New', monospace"
        },
        callbacks: {
          label: (context: any) => {
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: $${value.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <Container>
      <Header>
        <Title>
          💼 PORTFOLIO TRACKER
        </Title>
        <Controls>
          <Button onClick={handleExportCSV} disabled={holdings.length === 0}>
            CSV
          </Button>
          <Button onClick={handleExportExcel} disabled={holdings.length === 0}>
            EXCEL
          </Button>
          <Button $variant="primary" onClick={() => setShowAddModal(true)}>
            ADD HOLDING
          </Button>
        </Controls>
      </Header>

      <SummarySection>
        <SummaryCard>
          <SummaryLabel>Total Value</SummaryLabel>
          <SummaryValue>${summary.totalValue.toFixed(2)}</SummaryValue>
        </SummaryCard>
        
        <SummaryCard>
          <SummaryLabel>Total Cost</SummaryLabel>
          <SummaryValue>${summary.totalCost.toFixed(2)}</SummaryValue>
        </SummaryCard>
        
        <SummaryCard>
          <SummaryLabel>Total Gain/Loss</SummaryLabel>
          <SummaryValue $color={summary.totalGainLoss >= 0 ? '#00ff00' : '#ff0000'}>
            {summary.totalGainLoss >= 0 ? '+' : ''}${summary.totalGainLoss.toFixed(2)}
          </SummaryValue>
          <SummarySubtext $color={summary.totalGainLoss >= 0 ? '#00ff00' : '#ff0000'}>
            {summary.totalGainLossPercent >= 0 ? '+' : ''}{summary.totalGainLossPercent.toFixed(2)}%
          </SummarySubtext>
        </SummaryCard>
        
        <SummaryCard>
          <SummaryLabel>Day Change</SummaryLabel>
          <SummaryValue $color={summary.dayChange >= 0 ? '#00ff00' : '#ff0000'}>
            {summary.dayChange >= 0 ? '+' : ''}${summary.dayChange.toFixed(2)}
          </SummaryValue>
          <SummarySubtext $color={summary.dayChange >= 0 ? '#00ff00' : '#ff0000'}>
            {summary.dayChangePercent >= 0 ? '+' : ''}{summary.dayChangePercent.toFixed(2)}%
          </SummarySubtext>
        </SummaryCard>
      </SummarySection>

      <ContentArea>
        {holdings.length === 0 ? (
          <EmptyState>
            <EmptyIcon>💼</EmptyIcon>
            <EmptyText>
              No holdings in your portfolio yet.<br />
              Click "ADD HOLDING" to get started!
            </EmptyText>
          </EmptyState>
        ) : (
          <>
            <TableSection>
              <Table>
                <TableHeader>
                  <div>Ticker</div>
                  <div>Shares</div>
                  <div>Cost Basis</div>
                  <div>Current</div>
                  <div>Value</div>
                  <div>Day Chg</div>
                  <div>Gain/Loss</div>
                  <div>G/L %</div>
                  <div>Actions</div>
                </TableHeader>
                <TableBody>
                  {holdings.map(holding => (
                    <TableRow key={holding.id}>
                      <TickerCell>{holding.ticker}</TickerCell>
                      <TableCell $align="right">{holding.shares}</TableCell>
                      <TableCell $align="right">${holding.costBasis.toFixed(2)}</TableCell>
                      <TableCell $align="right">
                        ${holding.currentPrice?.toFixed(2) || '-'}
                      </TableCell>
                      <TableCell $align="right">
                        ${holding.currentValue?.toFixed(2) || '-'}
                      </TableCell>
                      <TableCell 
                        $align="right" 
                        $color={(holding.dayChange || 0) >= 0 ? '#00ff00' : '#ff0000'}
                      >
                        {(holding.dayChange || 0) >= 0 ? '+' : ''}
                        ${(holding.dayChange || 0).toFixed(2)}
                      </TableCell>
                      <TableCell 
                        $align="right" 
                        $color={(holding.gainLoss || 0) >= 0 ? '#00ff00' : '#ff0000'}
                      >
                        {(holding.gainLoss || 0) >= 0 ? '+' : ''}
                        ${(holding.gainLoss || 0).toFixed(2)}
                      </TableCell>
                      <TableCell 
                        $align="right" 
                        $color={(holding.gainLossPercent || 0) >= 0 ? '#00ff00' : '#ff0000'}
                      >
                        {(holding.gainLossPercent || 0) >= 0 ? '+' : ''}
                        {(holding.gainLossPercent || 0).toFixed(2)}%
                      </TableCell>
                      <ActionCell>
                        <IconButton onClick={() => openEditModal(holding)}>✏️</IconButton>
                        <IconButton onClick={() => handleDeleteHolding(holding.id)}>🗑️</IconButton>
                      </ActionCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableSection>

            <ChartSection>
              <ChartCard>
                <ChartTitle>Portfolio Allocation</ChartTitle>
                <Pie data={allocationData} options={chartOptions} />
              </ChartCard>
            </ChartSection>
          </>
        )}
      </ContentArea>

      {/* Add/Edit Modal */}
      {(showAddModal || editingHolding) && (
        <Modal onClick={() => {
          setShowAddModal(false);
          setEditingHolding(null);
          resetForm();
        }}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              {editingHolding ? '✏️ EDIT HOLDING' : '➕ ADD HOLDING'}
            </ModalHeader>
            <Form>
              <FormGroup>
                <Label>Ticker Symbol</Label>
                <Input
                  type="text"
                  placeholder="AAPL"
                  value={formData.ticker}
                  onChange={(e) => setFormData({ ...formData, ticker: e.target.value.toUpperCase() })}
                />
              </FormGroup>
              <FormGroup>
                <Label>Number of Shares</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="100"
                  value={formData.shares}
                  onChange={(e) => setFormData({ ...formData, shares: e.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <Label>Cost Basis (per share)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="150.00"
                  value={formData.costBasis}
                  onChange={(e) => setFormData({ ...formData, costBasis: e.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <Label>Purchase Date</Label>
                <Input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                />
              </FormGroup>
              <ButtonGroup>
                <Button onClick={() => {
                  setShowAddModal(false);
                  setEditingHolding(null);
                  resetForm();
                }}>
                  CANCEL
                </Button>
                <Button 
                  $variant="primary" 
                  onClick={editingHolding ? handleEditHolding : handleAddHolding}
                >
                  {editingHolding ? 'UPDATE' : 'ADD'}
                </Button>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default PortfolioTracker;
