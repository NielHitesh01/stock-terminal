// Supply Chain Data Provider
// Provides comprehensive company analysis with supply chain relationships

interface SupplyChainEntity {
  name: string;
  ticker?: string;
  category: string;
  description: string;
}

interface CompanyOverview {
  fullName: string;
  founded: number;
  founders: string[];
  headquarters: string;
  industrySector: string;
  keyProducts: string[];
  revenue: string;
  employees: string;
  marketCap: string;
}

interface BusinessModel {
  revenueStreams: string[];
  marketPosition: 'Market Leader' | 'Strong Challenger' | 'Niche Player' | 'Emerging';
  competitiveAdvantages: string[];
  businessType: string;
}

interface RecentDevelopment {
  date: string;
  type: 'Acquisition' | 'Product Launch' | 'Expansion' | 'Partnership' | 'Challenge' | 'News';
  title: string;
  description: string;
}

interface FutureOutlook {
  trends: string[];
  opportunities: string[];
  risks: string[];
  outlook: string;
}

interface CompanySupplyChain {
  company: string;
  ticker: string;
  industry: string;
  
  // Enhanced analysis (optional for backward compatibility)
  overview?: CompanyOverview;
  businessModel?: BusinessModel;
  recentDevelopments?: RecentDevelopment[];
  futureOutlook?: FutureOutlook;
  
  // Supply chain
  suppliers: SupplyChainEntity[];
  customers: SupplyChainEntity[];
}

// Supply chain database for major companies
const supplyChainDatabase: Record<string, CompanySupplyChain> = {
  'AAPL': {
    company: 'Apple Inc.',
    ticker: 'AAPL',
    industry: 'Consumer Electronics & Technology',
    
    overview: {
      fullName: 'Apple Inc.',
      founded: 1976,
      founders: ['Steve Jobs', 'Steve Wozniak', 'Ronald Wayne'],
      headquarters: 'Cupertino, California, USA',
      industrySector: 'Consumer Electronics, Software, Online Services',
      keyProducts: [
        'iPhone (smartphones)',
        'Mac (computers)',
        'iPad (tablets)',
        'Apple Watch (wearables)',
        'AirPods (audio)',
        'Apple Services (iCloud, Apple Music, Apple TV+, App Store)'
      ],
      revenue: '$383.3 billion (FY 2023)',
      employees: '164,000+ (2023)',
      marketCap: '$2.8+ trillion (2024)'
    },
    
    businessModel: {
      revenueStreams: [
        'Hardware Sales (iPhone 52%, Mac 10%, iPad 8%, Wearables 10%)',
        'Services (20% - App Store, iCloud, Apple Music, Apple TV+)',
        'Recurring Subscriptions (Growing segment)',
        'Ecosystem Lock-in (High switching costs)'
      ],
      marketPosition: 'Market Leader',
      competitiveAdvantages: [
        'Brand loyalty and premium positioning',
        'Vertical integration (hardware + software + services)',
        'Ecosystem lock-in (seamless device integration)',
        'Custom silicon (Apple M-series, A-series chips)',
        'Privacy and security focus',
        'Retail presence (500+ Apple Stores)',
        'Strong cash position ($162B+ in cash)'
      ],
      businessType: 'Integrated Hardware-Software-Services Model'
    },
    
    recentDevelopments: [
      {
        date: '2024 Q4',
        type: 'Product Launch',
        title: 'iPhone 16 Launch with Apple Intelligence',
        description: 'New flagship iPhone with advanced AI features, improved cameras, and A18 chip'
      },
      {
        date: '2024 Q3',
        type: 'Product Launch',
        title: 'Vision Pro Global Expansion',
        description: 'Apple Vision Pro mixed reality headset expanded to international markets'
      },
      {
        date: '2024 Q2',
        type: 'Partnership',
        title: 'OpenAI Integration',
        description: 'Partnership with OpenAI to integrate ChatGPT features into iOS, iPadOS, and macOS'
      },
      {
        date: '2024 Q1',
        type: 'Expansion',
        title: 'India Manufacturing Expansion',
        description: 'Increased iPhone production in India to reduce China dependency'
      },
      {
        date: '2023 Q4',
        type: 'Challenge',
        title: 'China Sales Pressure',
        description: 'Facing competition from local brands and regulatory pressures in China'
      }
    ],
    
    futureOutlook: {
      trends: [
        'AI Integration: Apple Intelligence across all products',
        'Services Growth: Expanding recurring revenue streams',
        'Wearables: Apple Watch and AirPods evolution',
        'AR/VR: Vision Pro platform development',
        'Health Tech: Advanced health monitoring features',
        'Automotive: Project Titan (autonomous vehicle) ongoing'
      ],
      opportunities: [
        'India Market: Growing middle class and manufacturing hub',
        'Services Expansion: Higher margins than hardware',
        'AI Differentiation: On-device AI with privacy focus',
        'Subscription Bundling: Apple One growth',
        'Financial Services: Apple Pay, Apple Card expansion',
        'Healthcare: FDA-approved health features'
      ],
      risks: [
        'China Dependency: 17% of revenue, geopolitical tensions',
        'Regulatory Scrutiny: App Store antitrust issues',
        'Market Saturation: Smartphone upgrade cycles lengthening',
        'Competition: Samsung, Google, Huawei in premium segment',
        'Supply Chain: TSMC dependency for chips',
        'Economic Slowdown: Premium products vulnerable in recession'
      ],
      outlook: 'Strong. Apple maintains market leadership with diversifying revenue streams. Services growth offsets hardware saturation. AI integration and Vision Pro represent next growth vectors. Strong balance sheet enables R&D investment and shareholder returns.'
    },
    
    suppliers: [
      {
        name: 'Taiwan Semiconductor (TSMC)',
        ticker: 'TSM',
        category: 'Chip Manufacturing',
        description: 'Primary manufacturer of Apple Silicon chips (A-series, M-series processors)'
      },
      {
        name: 'Samsung Electronics',
        ticker: '005930.KS',
        category: 'Display & Memory',
        description: 'OLED displays, NAND flash memory, DRAM chips'
      },
      {
        name: 'Foxconn (Hon Hai)',
        ticker: '2317.TW',
        category: 'Assembly & Manufacturing',
        description: 'Primary assembly partner for iPhones, iPads, and Macs'
      },
      {
        name: 'Qualcomm',
        ticker: 'QCOM',
        category: 'Wireless Components',
        description: '5G modem chips and RF components'
      },
      {
        name: 'Broadcom',
        ticker: 'AVGO',
        category: 'Semiconductor Components',
        description: 'Wireless connectivity chips, RF filters'
      },
      {
        name: 'Sony',
        ticker: '6758.T',
        category: 'Camera Sensors',
        description: 'Image sensors for iPhone cameras'
      }
    ],
    customers: [
      {
        name: 'Direct Consumers',
        category: 'Retail Customers',
        description: 'Individual buyers through Apple Stores, online, and retail partners worldwide'
      },
      {
        name: 'Enterprise Customers',
        category: 'Business Segment',
        description: 'Corporate deployments, educational institutions, government agencies'
      },
      {
        name: 'Best Buy',
        ticker: 'BBY',
        category: 'Retail Distribution',
        description: 'Major retail partner for Apple products in North America'
      },
      {
        name: 'Carrier Partners',
        category: 'Telecom Distribution',
        description: 'AT&T, Verizon, T-Mobile - iPhone distribution through carrier channels'
      },
      {
        name: 'Amazon',
        ticker: 'AMZN',
        category: 'Online Distribution',
        description: 'Authorized reseller of Apple products'
      }
    ]
  },

  'TSLA': {
    company: 'Tesla Inc.',
    ticker: 'TSLA',
    industry: 'Electric Vehicles & Energy',
    suppliers: [
      {
        name: 'Panasonic',
        ticker: '6752.T',
        category: 'Battery Cells',
        description: 'Primary battery cell supplier for Gigafactories'
      },
      {
        name: 'CATL',
        ticker: '300750.SZ',
        category: 'Battery Technology',
        description: 'LFP battery cells for standard range vehicles'
      },
      {
        name: 'LG Energy Solution',
        category: 'Battery Components',
        description: 'Battery cells and energy storage solutions'
      },
      {
        name: 'NVIDIA',
        ticker: 'NVDA',
        category: 'AI Computing',
        description: 'GPUs for Full Self-Driving (FSD) computer systems'
      },
      {
        name: 'Glencore',
        ticker: 'GLEN.L',
        category: 'Raw Materials',
        description: 'Cobalt and other battery minerals'
      },
      {
        name: 'Albemarle',
        ticker: 'ALB',
        category: 'Lithium Supply',
        description: 'Lithium compounds for battery production'
      }
    ],
    customers: [
      {
        name: 'Direct Consumers',
        category: 'Retail Customers',
        description: 'Individual EV buyers through Tesla showrooms and online configurator'
      },
      {
        name: 'Fleet Customers',
        category: 'Commercial Segment',
        description: 'Rental companies (Hertz), ride-sharing services (Uber), corporate fleets'
      },
      {
        name: 'Hertz',
        ticker: 'HTZ',
        category: 'Rental Fleet',
        description: 'Large-scale EV fleet purchases for rental services'
      },
      {
        name: 'Utility Companies',
        category: 'Energy Storage',
        description: 'Power companies purchasing Megapack and Powerwall systems'
      },
      {
        name: 'International Markets',
        category: 'Geographic Distribution',
        description: 'European, Asian, and other international consumer markets'
      }
    ]
  },

  'MSFT': {
    company: 'Microsoft Corporation',
    ticker: 'MSFT',
    industry: 'Software & Cloud Services',
    suppliers: [
      {
        name: 'Intel',
        ticker: 'INTC',
        category: 'Processors',
        description: 'CPUs for Surface devices and Azure data centers'
      },
      {
        name: 'AMD',
        ticker: 'AMD',
        category: 'Processors & GPUs',
        description: 'Server processors and graphics chips for Xbox and Azure'
      },
      {
        name: 'NVIDIA',
        ticker: 'NVDA',
        category: 'AI Infrastructure',
        description: 'GPUs for Azure AI and cloud computing services'
      },
      {
        name: 'Dell Technologies',
        ticker: 'DELL',
        category: 'Hardware Manufacturing',
        description: 'Server hardware and infrastructure for Azure'
      },
      {
        name: 'OpenAI',
        category: 'AI Technology',
        description: 'GPT models and AI capabilities for Copilot and Azure AI'
      },
      {
        name: 'Samsung',
        ticker: '005930.KS',
        category: 'Storage & Memory',
        description: 'SSDs, memory modules for devices and data centers'
      }
    ],
    customers: [
      {
        name: 'Enterprise Customers',
        category: 'Business Segment',
        description: 'Fortune 500 companies using Office 365, Azure, and enterprise solutions'
      },
      {
        name: 'Individual Consumers',
        category: 'Consumer Segment',
        description: 'Windows licenses, Office subscriptions, Xbox, Surface devices'
      },
      {
        name: 'Game Developers',
        category: 'Gaming Ecosystem',
        description: 'Studios developing for Xbox platform and Game Pass service'
      },
      {
        name: 'Cloud Customers',
        category: 'Azure Platform',
        description: 'Startups, enterprises, and developers using Azure cloud services'
      },
      {
        name: 'Educational Institutions',
        category: 'Education Segment',
        description: 'Schools and universities using Microsoft 365 Education'
      }
    ]
  },

  'AMZN': {
    company: 'Amazon.com Inc.',
    ticker: 'AMZN',
    industry: 'E-Commerce & Cloud Services',
    suppliers: [
      {
        name: 'Third-Party Sellers',
        category: 'Marketplace Vendors',
        description: 'Millions of sellers providing products on Amazon marketplace'
      },
      {
        name: 'Intel',
        ticker: 'INTC',
        category: 'Data Center Chips',
        description: 'Processors for AWS cloud infrastructure'
      },
      {
        name: 'AMD',
        ticker: 'AMD',
        category: 'Custom Processors',
        description: 'Custom EPYC processors for AWS data centers'
      },
      {
        name: 'UPS',
        ticker: 'UPS',
        category: 'Logistics Partner',
        description: 'Package delivery and logistics services'
      },
      {
        name: 'FedEx',
        ticker: 'FDX',
        category: 'Shipping Services',
        description: 'Air and ground shipping partner'
      },
      {
        name: 'Procter & Gamble',
        ticker: 'PG',
        category: 'Consumer Goods',
        description: 'Major supplier of consumer packaged goods'
      }
    ],
    customers: [
      {
        name: 'Online Shoppers',
        category: 'Retail Consumers',
        description: 'Individual buyers purchasing through Amazon.com marketplace'
      },
      {
        name: 'Prime Members',
        category: 'Subscription Base',
        description: '200+ million Prime subscribers globally'
      },
      {
        name: 'AWS Customers',
        category: 'Cloud Services',
        description: 'Startups, enterprises, and government using Amazon Web Services'
      },
      {
        name: 'Netflix',
        ticker: 'NFLX',
        category: 'Major AWS Client',
        description: 'Streaming infrastructure hosted on AWS'
      },
      {
        name: 'Small Businesses',
        category: 'Seller Community',
        description: 'Third-party sellers using Fulfillment by Amazon (FBA)'
      }
    ]
  },

  'GOOGL': {
    company: 'Alphabet Inc. (Google)',
    ticker: 'GOOGL',
    industry: 'Technology & Internet Services',
    suppliers: [
      {
        name: 'Broadcom',
        ticker: 'AVGO',
        category: 'Custom Chips',
        description: 'Tensor Processing Units (TPU) and networking chips'
      },
      {
        name: 'Intel',
        ticker: 'INTC',
        category: 'Data Center CPUs',
        description: 'Server processors for Google Cloud and services'
      },
      {
        name: 'NVIDIA',
        ticker: 'NVDA',
        category: 'AI Training',
        description: 'GPUs for AI research and development'
      },
      {
        name: 'Samsung',
        ticker: '005930.KS',
        category: 'Pixel Components',
        description: 'OLED displays and memory for Pixel phones'
      },
      {
        name: 'LG Display',
        ticker: '034220.KS',
        category: 'Display Technology',
        description: 'OLED panels for various devices'
      },
      {
        name: 'Equinix',
        ticker: 'EQIX',
        category: 'Data Center Services',
        description: 'Colocation and interconnection services'
      }
    ],
    customers: [
      {
        name: 'Advertisers',
        category: 'Primary Revenue',
        description: 'Businesses advertising through Google Ads, YouTube, and Display Network'
      },
      {
        name: 'Internet Users',
        category: 'Consumer Services',
        description: 'Billions of users of Search, Gmail, YouTube, Maps, and Android'
      },
      {
        name: 'Google Cloud Customers',
        category: 'Enterprise Cloud',
        description: 'Companies using Google Cloud Platform (GCP) services'
      },
      {
        name: 'App Developers',
        category: 'Android Ecosystem',
        description: 'Developers publishing apps on Google Play Store'
      },
      {
        name: 'Hardware Buyers',
        category: 'Consumer Electronics',
        description: 'Pixel phones, Nest devices, Chromebook users'
      }
    ]
  },

  'NVDA': {
    company: 'NVIDIA Corporation',
    ticker: 'NVDA',
    industry: 'Semiconductor & AI Technology',
    suppliers: [
      {
        name: 'TSMC',
        ticker: 'TSM',
        category: 'Chip Fabrication',
        description: 'Exclusive manufacturer of NVIDIA GPUs (advanced nodes)'
      },
      {
        name: 'Samsung',
        ticker: '005930.KS',
        category: 'Memory Products',
        description: 'HBM (High Bandwidth Memory) for data center GPUs'
      },
      {
        name: 'SK Hynix',
        ticker: '000660.KS',
        category: 'Advanced Memory',
        description: 'HBM3 memory for H100 and next-gen AI chips'
      },
      {
        name: 'ASML',
        ticker: 'ASML',
        category: 'Manufacturing Equipment',
        description: 'EUV lithography equipment used by TSMC'
      },
      {
        name: 'Synopsys',
        ticker: 'SNPS',
        category: 'Design Software',
        description: 'Electronic design automation (EDA) tools'
      }
    ],
    customers: [
      {
        name: 'Microsoft',
        ticker: 'MSFT',
        category: 'Cloud & AI',
        description: 'Major buyer of H100 GPUs for Azure AI infrastructure'
      },
      {
        name: 'Meta Platforms',
        ticker: 'META',
        category: 'AI Research',
        description: 'GPUs for AI model training and metaverse development'
      },
      {
        name: 'Amazon Web Services',
        ticker: 'AMZN',
        category: 'Cloud Computing',
        description: 'GPUs for AWS AI and machine learning services'
      },
      {
        name: 'Google Cloud',
        ticker: 'GOOGL',
        category: 'AI Infrastructure',
        description: 'Data center GPUs for cloud AI workloads'
      },
      {
        name: 'Tesla',
        ticker: 'TSLA',
        category: 'Autonomous Vehicles',
        description: 'GPUs for Dojo supercomputer and AI training'
      },
      {
        name: 'Gaming Community',
        category: 'Consumer Graphics',
        description: 'PC gamers and content creators buying GeForce GPUs'
      }
    ]
  }
};

// Fallback/generic supply chain template
function getGenericSupplyChain(ticker: string, companyName: string): CompanySupplyChain {
  return {
    company: companyName,
    ticker: ticker,
    industry: 'General Industry',
    suppliers: [
      {
        name: 'Raw Material Suppliers',
        category: 'Materials',
        description: 'Companies providing base materials and components'
      },
      {
        name: 'Manufacturing Partners',
        category: 'Production',
        description: 'Contract manufacturers and production facilities'
      },
      {
        name: 'Technology Providers',
        category: 'Technology',
        description: 'Software, hardware, and technology service providers'
      },
      {
        name: 'Logistics Partners',
        category: 'Supply Chain',
        description: 'Shipping, warehousing, and distribution services'
      }
    ],
    customers: [
      {
        name: 'Direct Consumers',
        category: 'Retail',
        description: 'End consumers purchasing products/services directly'
      },
      {
        name: 'Business Customers',
        category: 'B2B',
        description: 'Corporate clients and business partnerships'
      },
      {
        name: 'Distribution Channels',
        category: 'Distribution',
        description: 'Retail partners, wholesalers, and resellers'
      },
      {
        name: 'International Markets',
        category: 'Geographic',
        description: 'Customers in various geographic regions'
      }
    ]
  };
}

export async function getSupplyChainData(ticker: string): Promise<CompanySupplyChain> {
  const normalizedTicker = ticker.toUpperCase();
  
  // Check if we have specific data for this company
  if (supplyChainDatabase[normalizedTicker]) {
    return supplyChainDatabase[normalizedTicker];
  }
  
  // Return generic template if no specific data
  return getGenericSupplyChain(normalizedTicker, `${normalizedTicker} Company`);
}

export { CompanySupplyChain, SupplyChainEntity };
