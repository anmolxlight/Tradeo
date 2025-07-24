import os
import streamlit as st
from dotenv import load_dotenv

class Config:
    """Configuration class for managing API keys and app settings"""
    
    def __init__(self):
        load_dotenv()
        # Try Streamlit secrets first, then fall back to environment variables
        try:
            self.perplexity_api_key = st.secrets["PERPLEXITY_API_KEY"]
        except (KeyError, FileNotFoundError):
            self.perplexity_api_key = os.getenv("PERPLEXITY_API_KEY")
        
        # App settings
        self.app_title = "TRADEO"
        self.app_subtitle = "stonks made simple fr 📈"
        self.page_config = {
            "page_title": "TRADEO",
            "layout": "wide",
            "initial_sidebar_state": "collapsed"
        }
        
        # Search settings
        self.max_retries = 3
        self.search_depth = "advanced"
        self.max_results = 10
        
        # Supported currencies and formats
        self.currency_symbols = ['$', 'usd', 'dollar', '₹', 'rs.', 'inr']
        self.search_sites = [
            "site:moneycontrol.com",
            "site:finance.yahoo.com", 
            "site:x.com",
            "site:economictimes.indiatimes.com"
        ]
    
    def validate_api_keys(self):
        """Validate that required API keys are present"""
        missing_keys = []
        
        if not self.perplexity_api_key:
            missing_keys.append("PERPLEXITY_API_KEY")
            
        return len(missing_keys) == 0, missing_keys
    
    def get_search_query(self, ticker):
        """Generate optimized search query for stock data"""
        sites = " | ".join(self.search_sites)
        return f"{ticker} stock price current target PE ratio {sites}"
    
    def get_news_query(self, ticker):
        """Generate optimized search query for news data"""
        return f"{ticker} stock news financial analysis earnings recent developments" 