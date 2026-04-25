# Groww Weekly Review Pulse

A premium React application for analyzing app store reviews and generating AI-powered weekly pulse reports with actionable insights.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment
echo "VITE_GROQ_API_KEY=your_groq_key_here" > .env

# Start development server
npm run dev
```

## 📋 Project Overview

- **Technology Stack**: React 19.2.5 + Vite 5.4.0
- **UI Framework**: Premium design system with CSS custom properties
- **API Integration**: Groq API with llama-3.3-70b-versatile model
- **Data Source**: 1,499 Groww app store reviews across 5 themes
- **Analytics**: AI-powered sentiment analysis and theme categorization

### Data Source Information

Data source: Google Play Store + Apple App Store public APIs via google-play-scraper and app-store-scraper npm packages. 1,499 reviews collected covering Apr 11–23, 2026. Note: Public store APIs only return recent reviews for high-volume apps — historical data beyond 2 weeks is not accessible via public APIs.

## 🎨 Features

### Multi-Screen Application
- **Home Screen**: Stats dashboard with theme breakdown
- **Analyzing Screen**: Real-time progress animation during API calls
- **Pulse Screen**: AI-generated insights with sentiment analysis
- **Email Screen**: Professional email drafts with export functionality

### Premium UI Design
- **Color System**: Warm off-white (#F4F1ED) with pure white cards
- **Typography**: DM Sans primary, JetBrains Mono for code elements
- **Components**: Modern card layouts with subtle shadows and premium spacing
- **Responsive Design**: Grid-based layouts with mobile-first approach

## 📊 Data Structure

### Review Data (45 reviews)
- **Time Period**: 8 weeks (Feb 24 - Apr 20, 2025)
- **Themes**: 5 categories (KYC, Payments, Withdrawals, Statements, App UX)
- **Rating Distribution**: 1-5 stars
- **Platform Coverage**: Android & iOS

### Theme Configuration
```javascript
const THEMES = [
  {
    id: 'kyc-onboarding',
    label: 'KYC & Onboarding',
    color: '#FF6B6B',
    icon: '🆔',
    keywords: ['kyc', 'verification', 'document', 'onboarding', 'upload', 'pan', 'aadhaar', 'face', 'identity', 'verify']
  },
  // ... 4 more themes
];
```

## 🔧 Core Components

### Data Processing
- **Review Analysis**: Automatic theme assignment and sentiment categorization
- **Statistics Engine**: Real-time calculation of averages and distributions
- **Export Functionality**: CSV and Markdown export capabilities

### API Integration
- **Groq Service**: Robust error handling with JSON parsing
- **Environment Variables**: Secure API key management
- **Rate Limiting**: Built-in retry mechanisms
### Theme processing
  - Of 1,499 scraped reviews, 1,000 contained written 
  - text and were used for analysis. The remaining 499 
  - were rating-only submissions (no text) and excluded 
  - as they provide no thematic signal.
## 📱 Setup Instructions

### Environment Configuration
1. Create `.env` file with your Groq API key:
   ```
   VITE_GROQ_API_KEY=your_groq_key_here
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## 🎯 Usage Workflow

### Weekly Analysis Process
1. **Data Loading**: Reviews automatically processed and categorized
2. **Generate Pulse**: Click "✨ Generate Weekly Pulse Note" 
3. **Review Insights**: AI analyzes themes and generates actionable recommendations
4. **Export Results**: Download as CSV or export as Markdown

### Update Process for New Week
1. **Update Reviews**: Add new reviews to `REVIEWS` array in `src/data/reviews.js`
2. **Update Week Label**: Modify `WEEK_LABEL` constant for new date range
3. **Restart Server**: Changes automatically reflected in next analysis

## 📋 Deliverables

### Analytics Dashboard
- **Total Reviews**: Automatic count with theme distribution
- **Average Rating**: Real-time calculation with 1 decimal precision
- **Negative Reviews**: Count of 1-2 star ratings requiring attention

### AI-Powered Insights
- **Theme Analysis**: Automatic categorization with sentiment scoring
- **User Feedback**: Direct quotes with theme attribution
- **Actionable Recommendations**: Prioritized improvement suggestions with team assignments

## 🚨 Constraints & Compliance

### Data Privacy
- **No PII**: No personally identifiable information in reviews
- **Public Data Only**: Uses only publicly available app store reviews
- **Anonymized**: All user data is aggregated and anonymized

### Content Guidelines
- **Max Themes**: Limited to 5 themes for consistent analysis
- **Review Limit**: 45 reviews per week for optimal processing
- **Professional Tone**: Business-focused insights without investment advice

## 📈 File Structure

```
src/
├── data/
│   ├── reviews.js          # Review data and themes
│   └── ...
├── services/
│   └── groq.js           # Groq API integration
├── components/
│   ├── StatsBar.jsx       # Statistics dashboard
│   ├── ThemeBreakdown.jsx  # Theme analysis with legend
│   ├── PulseView.jsx       # AI insights display
│   └── EmailView.jsx       # Email draft generation
├── App.jsx               # Main application router
├── main.jsx              # React entry point
└── index.css             # Global styling

public/
├── reviews_sample.csv   # Sample data export
└── index.html           # Application HTML
```

## 🔑 Development Notes

### Styling Architecture
- **CSS Custom Properties**: Defined in `:root` for consistent theming
- **Component-Based Styling**: Inline styles with design system variables
- **Responsive Grid**: CSS Grid for mobile-first layouts

### Performance Optimizations
- **Lazy Loading**: Components load data only when needed
- **Memoization**: Expensive calculations cached where possible
- **Debounced API Calls**: Prevents duplicate requests during user interactions

---

*Built with ❤️ for the Groww product team*
