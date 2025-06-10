# 🚀 TRADEO - AI-Powered Stock Analysis Platform

**stonks made simple fr 📈**

TRADEO is a modern, AI-powered stock analysis platform that provides real-time investment insights using advanced web scraping and AI analysis. Built with a modular architecture for optimal performance and maintainability.

## ✨ Features

- **Real-time Data**: Fetches live stock data from multiple financial sources
- **AI Analysis**: Powered by Google's Gemini AI for comprehensive investment analysis
- **Modern UI**: Beautiful, responsive interface with gradient designs and animations
- **Smart Caching**: Optimized performance with intelligent data caching
- **Multi-source News**: Aggregates news from MoneyControl, Yahoo Finance, and more
- **Professional Reports**: Detailed analysis with risk assessment and recommendations

## 🏗️ Architecture

The application follows a clean, modular architecture:

```
Tradeo/
├── app.py              # Main application entry point
├── analyzer.py         # Stock analysis logic and AI integration
├── ui_components.py    # Frontend components and styling
├── config.py          # Configuration management
├── utils.py           # Utility functions and data processing
├── requirements.txt   # Python dependencies
├── .env              # Environment variables (API keys)
└── README.md         # Documentation
```

### 📁 File Structure

- **`app.py`**: Clean main application with minimal logic, focuses on orchestration
- **`analyzer.py`**: Core analysis engine with improved data extraction and caching
- **`ui_components.py`**: Reusable UI components with modern styling and animations
- **`config.py`**: Centralized configuration management for API keys and settings
- **`utils.py`**: Helper functions for data processing, validation, and formatting

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- API Keys for:
  - Google Gemini AI
  - Tavily Search API

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Tradeo
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   Create a `.env` file with your API keys:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   TAVILY_API_KEY=your_tavily_api_key_here
   ```

4. **Run the application**
   ```bash
   streamlit run app.py
   ```

5. **Access the app**
   Open your browser and navigate to `http://localhost:8501`

## 🔧 Configuration

### API Keys Setup

1. **Google Gemini AI**: Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Tavily Search**: Sign up at [Tavily](https://tavily.com) for search API access

### Customization

The application is highly configurable through `config.py`:

- **Search Settings**: Modify search depth, max results, retry logic
- **Data Sources**: Add or remove financial data sources
- **UI Themes**: Customize colors and styling in `ui_components.py`
- **Currency Support**: Add support for different currencies

## 🎨 UI Features

### Modern Design Elements

- **Gradient Backgrounds**: Beautiful color transitions and glass-morphism effects
- **Responsive Layout**: Optimized for desktop and mobile devices
- **Interactive Elements**: Hover effects and smooth animations
- **Smart Formatting**: Automatic currency formatting (₹1.2Cr, ₹5.6L, etc.)
- **Color-coded Metrics**: Green/red indicators for price changes

### Component Library

- **Header**: Animated title with gradient text
- **Search Bar**: Enhanced input with validation and suggestions
- **Metrics Cards**: Professional-looking data display
- **Analysis Container**: Formatted report with proper typography
- **Loading Spinners**: Custom loading animations
- **Error Handling**: User-friendly error messages

## 🔍 How It Works

1. **Data Fetching**: Uses Tavily API to scrape real-time data from multiple financial websites
2. **Data Processing**: Advanced regex and NLP techniques to extract stock metrics
3. **AI Analysis**: Google Gemini AI analyzes the data and generates investment insights
4. **Caching**: Smart caching system reduces API calls and improves performance
5. **Presentation**: Modern UI presents the analysis in an easy-to-understand format

## 📊 Supported Data

### Stock Metrics
- Current stock price
- Target price (analyst estimates)
- PE ratio
- Recent price changes
- Market sentiment

### News Sources
- MoneyControl
- Yahoo Finance
- Economic Times
- Twitter/X financial discussions

### Analysis Sections
- Market sentiment analysis
- Recent developments and news
- Technical analysis
- Risk assessment
- Investment recommendations
- Key reasons for recommendations

## 🛠️ Development

### Code Quality Features

- **Type Hints**: Full type annotation for better code clarity
- **Error Handling**: Comprehensive error handling and user feedback
- **Modular Design**: Separation of concerns for easy maintenance
- **Documentation**: Well-documented functions and classes
- **Performance**: Optimized data processing and caching

### Adding New Features

1. **New Data Sources**: Add to `config.py` search sites
2. **UI Components**: Create new components in `ui_components.py`
3. **Data Processing**: Add utility functions to `utils.py`
4. **Analysis Logic**: Extend `analyzer.py` for new analysis types

## 🔒 Security

- API keys stored in environment variables
- Input validation and sanitization
- Rate limiting and retry logic
- Error handling without exposing sensitive information

## 📈 Performance Optimizations

- **Caching System**: Reduces redundant API calls
- **Lazy Loading**: Components load only when needed
- **Optimized Queries**: Smart search query construction
- **Data Processing**: Efficient regex and text processing
- **UI Rendering**: Minimal re-renders with proper state management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This application is for informational purposes only. The analysis provided should not be considered as financial advice. Always conduct your own research and consult with financial professionals before making investment decisions.

## 🙏 Acknowledgments

- Google Gemini AI for powerful language processing
- Tavily for real-time web search capabilities
- Streamlit for the amazing web framework
- The open-source community for various libraries and tools

---

**Built with ❤️ for the trading community**