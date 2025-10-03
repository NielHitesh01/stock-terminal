# Financial Terminal - Installation Script
# Run this script in PowerShell from the financial-terminal directory

Write-Host "========================================" -ForegroundColor Green
Write-Host "  Financial Terminal Setup" -ForegroundColor Green
Write-Host "  Bloomberg-Style Trading Terminal" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Check Node.js installation
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js 18+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check npm installation
try {
    $npmVersion = npm --version
    Write-Host "✓ npm installed: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm not found." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Gray
Write-Host ""

try {
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Dependencies installed successfully" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✗ Error during installation: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Setup environment file
Write-Host "Setting up environment..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
} else {
    Copy-Item ".env.example" ".env"
    Write-Host "✓ Created .env file from template" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠ IMPORTANT: Edit .env file and add your API keys" -ForegroundColor Yellow
    Write-Host "  Get free API key: https://www.alphavantage.co/support/#api-key" -ForegroundColor Gray
    Write-Host "  Or run in demo mode with mock data" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Installation Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  1. Configure API keys (optional):" -ForegroundColor White
Write-Host "     notepad .env" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. Start the terminal:" -ForegroundColor White
Write-Host "     npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "  3. Open in browser:" -ForegroundColor White
Write-Host "     http://localhost:5173" -ForegroundColor Gray
Write-Host ""
Write-Host "  4. Try a command:" -ForegroundColor White
Write-Host "     AAPL DES" -ForegroundColor Gray
Write-Host ""
Write-Host "Documentation:" -ForegroundColor Cyan
Write-Host "  - QUICKSTART.md  - 5-minute getting started guide" -ForegroundColor Gray
Write-Host "  - COMMANDS.md    - Complete command reference" -ForegroundColor Gray
Write-Host "  - SETUP.md       - Detailed setup instructions" -ForegroundColor Gray
Write-Host ""
Write-Host "Ready to start trading!" -ForegroundColor Green
Write-Host ""
