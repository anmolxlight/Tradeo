
import datetime
import os
import time
import re
import streamlit as st
import requests
from utils import DataProcessor, CacheManager
from config import Config

class StockSentimentAnalyzer:
    def __init__(self, perplexity_api_key):
        self.api_key = perplexity_api_key
        self.base_url = "https://api.perplexity.ai/chat/completions"
        self.config = Config()
        self.cache = CacheManager()
        self.data_processor = DataProcessor()
    
    def fetch_stock_metrics(self, ticker):
        """Dedicated function to fetch stock metrics using Perplexity API only"""
        try:
            # Determine if this is an Indian stock
            is_indian_stock = self._is_indian_stock(ticker)
            currency_symbol = "₹" if is_indian_stock else "$"
            currency_name = "INR" if is_indian_stock else "USD"
            
            # Detailed query for stock metrics with appropriate currency
            metrics_query = f"""
            Get the exact current stock price, target price, PE ratio, and recent price change percentage for {ticker}.
            
            Please provide the information in this exact format:
            Current Price: {currency_symbol}X.XX
            Target Price: {currency_symbol}X.XX (or N/A if not available)
            PE Ratio: X.XX (or N/A if not available)
            Price Change: +/-X.XX%
            
            IMPORTANT: 
            - If this is an Indian stock (like RELIANCE, TCS, INFY, HDFCBANK, etc.), show prices in Indian Rupees (₹)
            - If this is a US/international stock, show prices in US Dollars ($)
            - Source data from reliable financial sources like Yahoo Finance, Bloomberg, MarketWatch, Google Finance, or Moneycontrol for Indian stocks
            - Be precise with the numbers and include the correct currency symbol
            """
            
            payload = {
                "model": "sonar",
                "messages": [
                    {
                        "role": "system",
                        "content": f"You are a precise financial data assistant. Extract exact stock metrics from reliable financial sources. For Indian stocks, use ₹ (INR), for US/international stocks use $ (USD). Always format percentages with % symbol. Be accurate and concise. This stock is from {'India' if is_indian_stock else 'US/International'} market."
                    },
                    {
                        "role": "user",
                        "content": metrics_query
                    }
                ]
            }
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            response = requests.post(self.base_url, json=payload, headers=headers)
            
            if response.status_code != 200:
                st.warning(f"Failed to fetch stock metrics: {response.status_code}")
                return self._get_empty_stock_data()
            
            response_data = response.json()
            metrics_text = response_data['choices'][0]['message']['content']
            
            # Parse the structured response
            return self._parse_metrics_response(metrics_text, is_indian_stock)
            
        except Exception as e:
            st.warning(f"Error fetching stock metrics: {str(e)}")
            return self._get_empty_stock_data()
    
    def _parse_metrics_response(self, text, is_indian_stock=False):
        """Parse the structured metrics response from Perplexity"""
        stock_data = self._get_empty_stock_data()
        stock_data['is_indian'] = is_indian_stock
        
        try:
            # Extract current price (support both $ and ₹)
            currency_pattern = r'₹' if is_indian_stock else r'\$'
            current_price_match = re.search(rf'Current Price:\s*[{currency_pattern}$₹]\s*(\d+\.?\d*)', text, re.IGNORECASE)
            if current_price_match:
                stock_data['current_price'] = float(current_price_match.group(1))
            
            # Extract target price
            target_price_match = re.search(rf'Target Price:\s*[{currency_pattern}$₹]\s*(\d+\.?\d*)', text, re.IGNORECASE)
            if target_price_match:
                stock_data['target_price'] = float(target_price_match.group(1))
            
            # Extract PE ratio
            pe_ratio_match = re.search(r'PE Ratio:\s*(\d+\.?\d*)', text, re.IGNORECASE)
            if pe_ratio_match:
                stock_data['pe_ratio'] = float(pe_ratio_match.group(1))
            
            # Extract price change
            change_match = re.search(r'Price Change:\s*([+-]?\d+\.?\d*)%', text, re.IGNORECASE)
            if change_match:
                stock_data['price_change'] = float(change_match.group(1))
                
        except Exception as e:
            st.warning(f"Error parsing metrics: {str(e)}")
        
        return stock_data
    
    def _get_empty_stock_data(self):
        """Return empty stock data structure"""
        return {
            'current_price': 0,
            'target_price': 0,
            'pe_ratio': 0,
            'price_change': 0,
            'is_indian': False
        }
    
    def _is_indian_stock(self, ticker):
        """Determine if a stock ticker is from Indian market"""
        # Common Indian stock tickers
        indian_stocks = {
            # Major Indian companies
            'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'HINDUNILVR', 'ICICIBANK', 'ITC', 
            'SBIN', 'BHARTIARTL', 'KOTAKBANK', 'LT', 'ASIANPAINT', 'AXISBANK', 'MARUTI',
            'BAJFINANCE', 'HCLTECH', 'WIPRO', 'ULTRACEMCO', 'DMART', 'BAJAJFINSV',
            'TITAN', 'NESTLEIND', 'POWERGRID', 'TATAMOTORS', 'TECHM', 'SUNPHARMA',
            'JSWSTEEL', 'TATASTEEL', 'INDUSINDBK', 'ADANIENT', 'BPCL', 'GRASIM',
            'COALINDIA', 'ONGC', 'NTPC', 'DRREDDY', 'APOLLOHOSP', 'BAJAJ-AUTO',
            'CIPLA', 'EICHERMOT', 'DIVISLAB', 'HEROMOTOCO', 'BRITANNIA', 'SHREECEM',
            'PIDILITIND', 'GODREJCP', 'BERGEPAINT', 'DABUR', 'AMBUJACEM', 'BANDHANBNK',
            'MCDOWELL-N', 'TATACONSUM', 'CHOLAFIN', 'GAIL', 'SIEMENS', 'DLF',
            'ZEEL', 'VEDL', 'CADILAHC', 'LUPIN', 'MARICO', 'BIOCON', 'MUTHOOTFIN',
            'PAGEIND', 'AUROPHARMA', 'TORNTPHARM', 'COLPAL', 'HDFCLIFE', 'SBILIFE',
            'ICICIPRULI', 'BAJAJHLDNG', 'MINDTREE', 'MPHASIS', 'PERSISTENT'
        }
        
        # Check if ticker matches Indian stock patterns
        ticker_upper = ticker.upper()
        
        # Direct match with known Indian stocks
        if ticker_upper in indian_stocks:
            return True
            
        # Check for .NS or .BO suffixes (NSE/BSE)
        if ticker_upper.endswith('.NS') or ticker_upper.endswith('.BO'):
            return True
            
        # Check for Indian sector ETFs or mutual funds
        if any(suffix in ticker_upper for suffix in ['.NSE', '.BSE', 'NIFTY', 'SENSEX']):
            return True
            
        return False
    
    def fetch_comprehensive_analysis(self, ticker):
        """Fetch comprehensive stock analysis using Perplexity API only"""
        try:
            analysis_query = f"""
            Provide a comprehensive stock analysis for {ticker} including:
            
            1. Recent news and developments (last 7 days)
            2. Earnings and financial performance
            3. Technical analysis and price trends
            4. Risk factors and market sentiment
            5. Investment recommendation with reasoning
            
            Include specific data points, percentages, and cite reliable financial sources.
            Format your response with clear headers and bullet points for readability.
            """
            
            payload = {
                "model": "sonar",
                "messages": [
                    {
                        "role": "system",
                        "content": self._get_enhanced_system_instruction()
                    },
                    {
                        "role": "user",
                        "content": analysis_query
                    }
                ]
            }
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            response = requests.post(self.base_url, json=payload, headers=headers)
            
            if response.status_code != 200:
                return f"Error fetching analysis: API request failed with status {response.status_code}"
            
            response_data = response.json()
            return response_data['choices'][0]['message']['content']
            
        except Exception as e:
            return f"Error fetching comprehensive analysis: {str(e)}"
    
    def get_stock_data(self, ticker, max_retries=None):
        """Get stock data using Perplexity API only - improved version"""
        if max_retries is None:
            max_retries = self.config.max_retries
        
        # Check cache first
        cache_key = f"stock_data_{ticker}_{datetime.datetime.now().strftime('%Y-%m-%d-%H')}"
        cached_data = self.cache.get(cache_key)
        if cached_data:
            return cached_data
        
        # Validate ticker
        is_valid, result = self.data_processor.validate_ticker(ticker)
        if not is_valid:
            st.warning(f"Invalid ticker format: {result}")
            return None, []
        
        ticker = result  # Use cleaned ticker
        
        # Use the dedicated function to fetch stock metrics
        stock_data = self.fetch_stock_metrics(ticker)
        
        # Create a simple result structure for compatibility
        results = [{"content": f"Stock data for {ticker}", "url": "perplexity_api"}]
        
        # Cache the results
        result_tuple = (stock_data, results)
        self.cache.set(cache_key, result_tuple)
        
        return result_tuple
    
    def _extract_stock_metrics(self, results, stock_data):
        """Extract stock metrics using improved data processing"""
        for result in results:
            content = result.get('content', '').lower()
            
            # Extract current price
            if not stock_data['current_price']:
                price = self.data_processor.extract_price_from_text(content, self.config.currency_symbols)
                if price:
                    stock_data['current_price'] = price
            
            # Extract target price
            if 'target' in content and not stock_data['target_price']:
                target_price = self.data_processor.extract_price_from_text(content, self.config.currency_symbols)
                if target_price and target_price != stock_data['current_price']:
                    stock_data['target_price'] = target_price
            
            # Extract PE ratio
            if not stock_data['pe_ratio']:
                pe_ratio = self.data_processor.extract_pe_ratio_from_text(content)
                if pe_ratio:
                    stock_data['pe_ratio'] = pe_ratio
            
            # Extract price change
            if not stock_data['price_change']:
                price_change = self.data_processor.extract_percentage_from_text(content)
                if price_change is not None:
                    stock_data['price_change'] = price_change
        
        return stock_data

    def analyze_sentiment(self, ticker):
        """Comprehensive sentiment analysis using Perplexity API only"""
        current_date = datetime.datetime.now().strftime("%Y-%m-%d")
        
        # Get stock metrics using dedicated function
        stock_data, _ = self.get_stock_data(ticker)
        
        # Get comprehensive analysis
        analysis = self.fetch_comprehensive_analysis(ticker)
        
        return analysis, stock_data

    def _create_detailed_prompt(self, ticker, current_date, stock_data, news_summary, price_potential):
        """Create detailed analysis prompt with formatted data"""
        current_price_formatted = self.data_processor.format_currency(stock_data['current_price'])
        target_price_formatted = self.data_processor.format_currency(stock_data['target_price'])
        
        return f"""
        Provide a comprehensive investment analysis for {ticker} stock as of {current_date}.

        **Market Data Available:**
        • Current Price: {current_price_formatted}
        • Target Price: {target_price_formatted}
        • PE Ratio: {stock_data['pe_ratio']:.2f}
        • Recent Price Change: {stock_data['price_change']:.2f}%
        • Potential Upside: {price_potential:.2f}%

        **Recent News Summary:**
        {news_summary}

        Please format your response using proper markdown with the following structure:

        ## 📊 Market Sentiment Analysis
        **Sentiment:** [Bullish/Bearish/Neutral]  
        **Investor Confidence:** [High/Medium/Low]  
        **Key Insight:** [Brief explanation with any relevant citation]

        ## 📈 Recent Developments  
        - **Earnings & Financial Results:** [Latest earnings info with citation]
        - **Major Announcements:** [Key company developments with citation]  
        - **Industry Trends:** [Relevant sector trends with citation]

        ## 🔍 Technical Analysis
        - **Price Trend:** [Current trend analysis with citation]
        - **Support/Resistance:** [Key price levels with citation]
        - **Technical Indicators:** [Key signals with citation]

        ## ⚠️ Risk Assessment
        **Market Risks:** [Key market-wide risks]  
        **Company Risks:** [Specific company risks]  
        **Industry Risks:** [Sector-specific risks]

        ## 🎯 Investment Recommendation
        **🏷️ Rating:** **[BUY/SELL/HOLD]**  
        **📊 Confidence:** [High/Medium/Low]  
        **💰 Entry Range:** [{current_price_formatted} ± 5%]  
        **🛑 Stop Loss:** [Specific price]  
        **🎯 Target Price:** [Specific price]  
        **⏰ Timeframe:** [Short/Medium/Long-term]

        ## 💡 Key Investment Thesis
        1. **[Primary reason with citation]**
        2. **[Secondary reason with citation]** 
        3. **[Third reason with citation]**

        Use citations like [¹], [²], [³] for references and ensure all key points are **bold** for easy scanning.
        """

    def _create_fallback_prompt(self, ticker, current_date, news_summary):
        """Create fallback prompt for news-only analysis"""
        return f"""
        Provide an investment analysis for {ticker} as of {current_date}.

        **⚠️ Note:** Market data unavailable. Analysis based on news and developments only.

        **Available Information:**
        {news_summary}

        Please format your response using proper markdown:

        ## 📊 Market Sentiment Analysis
        **Sentiment:** [Bullish/Bearish/Neutral]  
        **Investor Confidence:** [High/Medium/Low]  
        **Key Insight:** [Brief explanation with citation]

        ## 📈 Recent Developments
        - **Major News:** [Key developments with citation]
        - **Industry Trends:** [Relevant trends with citation]
        - **Market Factors:** [Affecting factors with citation]

        ## 🔍 Investment Considerations  
        **Key Factors:** [Important considerations with citation]  
        **Market Conditions:** [Current conditions with citation]  
        **Risk Factors:** [Potential risks with citation]

        ## 🎯 General Outlook
        **📊 Overall Sentiment:** **[Positive/Negative/Neutral]**  
        **💡 Key Considerations:** [Main points with citation]  
        **📋 Suggested Approach:** [Recommended strategy with citation]

        **⚠️ Disclaimer:** Analysis based on limited data. Verify current market prices before investing.

        Use citations like [¹], [²], [³] for references and ensure all key points are **bold** for easy scanning.
        """

    def _get_enhanced_system_instruction(self):
        """Get enhanced system instruction for comprehensive analysis"""
        return """
        You are an expert financial analyst specializing in comprehensive stock analysis. Your task is to provide detailed, accurate, and actionable investment analysis using real-time financial data.

        **Your Capabilities:**
        - Access to real-time stock data from major financial sources
        - Deep analysis of market trends, news, and financial metrics
        - Professional investment recommendations with clear reasoning

        **Analysis Requirements:**

        1. **Data Accuracy**: Always use precise, up-to-date financial data from reliable sources like Yahoo Finance, Bloomberg, MarketWatch, or Google Finance.

        2. **Structure Your Response Using These Headers:**

        ## 📊 Market Sentiment Analysis
        **Sentiment:** [Bullish/Bearish/Neutral]  
        **Investor Confidence:** [High/Medium/Low]  
        **Key Insight:** [Brief explanation with data points]

        ## 📈 Recent Developments  
        - **Earnings & Financial Results:** [Latest earnings with specific numbers]
        - **Major Announcements:** [Recent company news and developments]  
        - **Industry Trends:** [Sector-specific trends affecting the stock]

        ## 🔍 Technical Analysis
        - **Price Trend:** [Current technical indicators and chart patterns]
        - **Support/Resistance:** [Key price levels with specific values]
        - **Volume Analysis:** [Trading volume trends and significance]

        ## ⚠️ Risk Assessment
        **Market Risks:** [Broad market factors affecting the stock]  
        **Company Risks:** [Company-specific risks and challenges]  
        **Industry Risks:** [Sector-wide risks and regulatory concerns]

        ## 🎯 Investment Recommendation
        **🏷️ Rating:** **[BUY/SELL/HOLD]**  
        **📊 Confidence:** [High/Medium/Low]  
        **💰 Entry Range:** [Specific price range]  
        **🛑 Stop Loss:** [Specific price with reasoning]  
        **🎯 Target Price:** [12-month target with basis]  
        **⏰ Timeframe:** [Short/Medium/Long-term investment horizon]

        ## 💡 Key Investment Thesis
        1. **[Primary reason with specific data/metrics]**
        2. **[Secondary reason with supporting evidence]** 
        3. **[Third reason with quantitative backing]**

        **Formatting Guidelines:**
        - Use emojis for headers as shown above
        - Make key metrics and ratings **bold**
        - Include specific numbers, percentages, and price targets
        - Cite recent data points (within last 30 days when possible)
        - Use professional, objective language
        - Avoid speculation - base recommendations on concrete data

        **Quality Standards:**
        - Ensure all price targets and metrics are realistic and data-driven
        - Include specific timeframes for predictions
        - Reference recent financial reports, earnings calls, or major news
        - Provide actionable insights suitable for investment decisions

        Remember: Investors rely on your analysis for financial decisions. Be accurate, thorough, and professional.
        """ 