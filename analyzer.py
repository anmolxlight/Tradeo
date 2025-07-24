
import datetime
import os
import time
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
    
    def get_stock_data(self, ticker, max_retries=None):
        """Get stock data with improved extraction and caching"""
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
        
        for attempt in range(max_retries):
            try:
                if attempt > 0:
                    time.sleep(2 ** attempt)
                
                # Use Perplexity to search for stock information
                search_query = f"Current stock price, target price, PE ratio, and recent price change for {ticker} stock. Include recent news and financial data from reliable sources like Moneycontrol, Yahoo Finance, or financial news sites."
                
                payload = {
                    "model": "sonar",
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are a financial data retrieval assistant. Extract and return structured financial data for the requested stock ticker. Return data in JSON format with current_price, target_price, pe_ratio, price_change, and news_summary fields."
                        },
                        {
                            "role": "user",
                            "content": search_query
                        }
                    ]
                }
                headers = {
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                }
                
                response = requests.post(self.base_url, json=payload, headers=headers)
                
                # Check if request was successful
                if response.status_code != 200:
                    st.warning(f"API request failed with status {response.status_code}: {response.text}")
                    return None, []
                
                # Parse the response and extract structured data
                try:
                    response_data = response.json()
                    search_result = response_data['choices'][0]['message']['content']
                    results = [{"content": search_result, "url": "perplexity_search"}]
                except (KeyError, IndexError) as e:
                    st.warning(f"Unexpected API response format: {response.text[:200]}")
                    return None, []
                
                # Initialize stock data structure
                stock_data = {
                    'current_price': 0,
                    'target_price': 0,
                    'pe_ratio': 0,
                    'price_change': 0
                }
                
                # Extract data using improved methods
                stock_data = self._extract_stock_metrics(results, stock_data)
                
                # Cache the results
                result_tuple = (stock_data, results)
                self.cache.set(cache_key, result_tuple)
                
                return result_tuple
                
            except Exception as e:
                if attempt < max_retries - 1:
                    continue
                st.warning(f"Could not fetch stock data for {ticker}: {str(e)}. Using news data only.")
                return None, []
        
        return None, []
    
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
        """Analyze sentiment with improved data processing"""
        current_date = datetime.datetime.now().strftime("%Y-%m-%d")
        stock_data, news = self.get_stock_data(ticker)
        
        # Create news summary using utility function
        news_summary, references = self.data_processor.create_news_summary(news)
        
        if stock_data and stock_data['current_price'] > 0:
            price_potential = 0
            if stock_data['target_price'] > 0:
                price_potential = ((stock_data['target_price'] - stock_data['current_price']) / stock_data['current_price']) * 100
            
            prompt = self._create_detailed_prompt(ticker, current_date, stock_data, news_summary, price_potential)
        else:
            prompt = self._create_fallback_prompt(ticker, current_date, news_summary)
        
        try:
            payload = {
                "model": "sonar",
                "messages": [
                    {
                        "role": "system",
                        "content": self._get_system_instruction()
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            }
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            response = requests.post(self.base_url, json=payload, headers=headers)
            
            # Check if request was successful
            if response.status_code != 200:
                return f"API request failed with status {response.status_code}: {response.text}", stock_data
            
            # Parse the response
            try:
                response_data = response.json()
                return response_data['choices'][0]['message']['content'], stock_data
            except (KeyError, IndexError, ValueError) as e:
                return f"Error parsing API response: {str(e)}. Response: {response.text[:200]}", stock_data
        except Exception as e:
            return f"Error analyzing sentiment: {str(e)}", stock_data

    def _create_detailed_prompt(self, ticker, current_date, stock_data, news_summary, price_potential):
        """Create detailed analysis prompt with formatted data"""
        current_price_formatted = self.data_processor.format_currency(stock_data['current_price'])
        target_price_formatted = self.data_processor.format_currency(stock_data['target_price'])
        
        return f"""
        **Investment Analysis for {ticker} Stock as of {current_date}**

        **Market Data:**
        • Current Price: {current_price_formatted}
        • Target Price: {target_price_formatted}
        • PE Ratio: {stock_data['pe_ratio']:.2f}
        • Recent Price Change: {stock_data['price_change']:.2f}%
        • Potential Upside: {price_potential:.2f}%

        **Recent News (with References)**:
        {news_summary}

        Analyze the provided data and news to generate a detailed investment analysis. Include reference links from the news for each point using [Ref: #]. Format the response as follows:

        **1. Current Market Sentiment Analysis**
        • Sentiment: (Bullish/Bearish/Neutral)
        • Investor Confidence: (High/Medium/Low)
        • Explanation: [Ref: #]

        **2. Key Recent Developments and News**
        • Recent earnings or financial results: [Ref: #]
        • Major announcements or developments: [Ref: #]
        • Industry trends affecting the stock: [Ref: #]

        **3. Technical Analysis**
        • Price Trend Analysis: [Ref: #]
        • Support and Resistance Levels: [Ref: #]
        • Key Technical Indicators: [Ref: #]

        **4. Risk Assessment**
        • Market Risks: [Ref: #]
        • Company-Specific Risks: [Ref: #]
        • Industry Risks: [Ref: #]

        **5. Investment Recommendation**
        • Rating: (BUY/SELL/HOLD)
        • Confidence Level: (High/Medium/Low)
        • Entry Price Range: (within 5% of {current_price_formatted})
        • Stop Loss: (specify price)
        • Target Price: (specify price)
        • Investment Timeframe: (Short/Medium/Long-term)

        **6. Key Reasons for Recommendation**
        1. [Reason with reference, e.g., [Ref: 1]]
        2. [Reason with reference, e.g., [Ref: 2]]
        3. [Reason with reference, e.g., [Ref: 3]]

        Ensure the response is concise, professional, and includes specific reference links where applicable.
        """

    def _create_fallback_prompt(self, ticker, current_date, news_summary):
        """Create fallback prompt for news-only analysis"""
        return f"""
        **Investment Analysis for {ticker} as of {current_date}**

        Note: Market data unavailable due to API limitations.

        **Available Information (with References)**:
        {news_summary}

        Based on the provided news, analyze the investment potential. Include reference links from the news for each point using [Ref: #]. Format the response as follows:

        **1. Current Market Sentiment Analysis**
        • Sentiment: (Bullish/Bearish/Neutral)
        • Investor Confidence: (High/Medium/Low)
        • Explanation: [Ref: #]

        **2. Key Recent Developments and News**
        • Major recent developments: [Ref: #]
        • Industry trends: [Ref: #]
        • Market factors: [Ref: #]

        **3. General Investment Considerations**
        • Key factors to consider: [Ref: #]
        • Market conditions: [Ref: #]
        • Risk factors: [Ref: #]

        **4. Recommendation**
        • General outlook: (Positive/Negative/Neutral)
        • Key considerations: [Ref: #]
        • Suggested approach: [Ref: #]

        Note: Analysis based on limited data. Verify current market prices before investing.
        Ensure the response is concise, professional, and includes specific reference links.
        """

    def _get_system_instruction(self):
        """Get comprehensive system instruction for the AI model"""
        return """
        You are an expert stock market analyst tasked with providing a detailed investment analysis based on real-time data scraped from financial websites (e.g., Moneycontrol, Yahoo Finance, X) by Tavily Search API. Your role is to analyze the provided data, including stock price, financial metrics, and recent news, and generate a concise, professional, and actionable investment analysis. Follow these guidelines:

        1. **Data Processing**:
           - Extract current stock price, target price, PE ratio, and recent price change (e.g., 1-month or available period) from the provided Tavily search results.
           - If specific metrics are missing, infer reasonable estimates from context or note their absence.
           - Summarize news items, prioritizing relevance to financial performance, contracts, earnings, or industry trends.

        2. **Output Structure**:
           - Format the response in markdown with clear headers and bullet points.
           - Include reference links for each point, citing the Tavily result number (e.g., [Ref: 1]) from the provided news summary.
           - Ensure the analysis is concise, professional, and avoids speculative claims.

        3. **Analysis Format**:
           **1. Current Market Sentiment Analysis**
           - Sentiment: (Bullish/Bearish/Neutral)
           - Investor Confidence: (High/Medium/Low)
           - Explanation: [Provide reasoning based on price trends and news, with references, e.g., [Ref: 1]]

           **2. Key Recent Developments and News**
           - Recent earnings or financial results: [Ref: #]
           - Major announcements or developments: [Ref: #]
           - Industry trends affecting the stock: [Ref: #]

           **3. Technical Analysis**
           - Price Trend Analysis: [Ref: #]
           - Support and Resistance Levels: [Ref: #]
           - Key Technical Indicators: [Ref: #]

           **4. Risk Assessment**
           - Market Risks: [Ref: #]
           - Company-Specific Risks: [Ref: #]
           - Industry Risks: [Ref: #]

           **5. Investment Recommendation**
           - Rating: (BUY/SELL/HOLD)
           - Confidence Level: (High/Medium/Low)
           - Entry Price Range: (within 5% of current price)
           - Stop Loss: (specify price)
           - Target Price: (specify price)
           - Investment Timeframe: (Short/Medium/Long-term)

           **6. Key Reasons for Recommendation**
           - [Reason with reference, e.g., [Ref: 1]]
           - [Reason with reference, e.g., [Ref: 2]]
           - [Reason with reference, e.g., [Ref: 3]]

        4. **Fallback for Limited Data**:
           - If price or financial metrics are unavailable, provide a news-based analysis with the following format:
             **1. Current Market Sentiment Analysis**
             - Sentiment: (Bullish/Bearish/Neutral)
             - Investor Confidence: (High/Medium/Low)
             - Explanation: [Ref: #]

             **2. Key Recent Developments and News**
             - Major recent developments: [Ref: #]
             - Industry trends: [Ref: #]
             - Market factors: [Ref: #]

             **3. General Investment Considerations**
             - Key factors to consider: [Ref: #]
             - Market conditions: [Ref: #]
             - Risk factors: [Ref: #]

             **4. Recommendation**
             - General outlook: (Positive/Negative/Neutral)
             - Key considerations: [Ref: #]
             - Suggested approach: [Ref: #]
             - Note: Analysis based on limited data. Verify current market prices before investing.

        5. **Error Handling**:
           - If no relevant data is available, return a brief explanation of the issue and suggest verifying the ticker or trying again later.
           - Avoid fabricating data or metrics not explicitly provided.

        6. **Tone and Style**:
           - Maintain a professional, objective tone.
           - Use precise numbers where available and cite sources accurately.
           - Warn users to verify data independently before making investment decisions.
        """ 