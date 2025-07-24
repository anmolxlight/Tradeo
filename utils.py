import re
from typing import List, Dict, Optional, Tuple

class DataProcessor:
    """Utility class for processing stock data and news content"""
    
    @staticmethod
    def extract_price_from_text(text: str, currency_symbols: List[str]) -> Optional[float]:
        """Extract price value from text content with improved accuracy"""
        text = text.lower()
        
        # Look for common price patterns
        price_patterns = [
            r'(?:price|stock|trading|closed?)\s*(?:at|for|:)?\s*[\$₹]?\s*(\d{1,6}\.?\d{0,2})',
            r'[\$₹]\s*(\d{1,6}\.?\d{0,2})',
            r'(\d{1,6}\.?\d{0,2})\s*[\$₹]',
            r'(?:priced?|valued?|worth)\s*[\$₹]?\s*(\d{1,6}\.?\d{0,2})',
        ]
        
        potential_prices = []
        
        for pattern in price_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                try:
                    price = float(match)
                    # Stock prices are typically between $1 and $10,000
                    if 1.0 <= price <= 10000:
                        potential_prices.append(price)
                except ValueError:
                    continue
        
        # Return the most reasonable price (typically the highest credible price)
        if potential_prices:
            # For stocks, usually the actual price is higher than small decimals
            potential_prices = sorted(set(potential_prices), reverse=True)
            return potential_prices[0]
        
        return None
    
    @staticmethod
    def extract_percentage_from_text(text: str) -> Optional[float]:
        """Extract percentage change from text content"""
        # Look for patterns like "+5.2%", "-3.1%", "5.2%"
        percentage_pattern = r'[+-]?\d+\.?\d*%'
        matches = re.findall(percentage_pattern, text)
        
        for match in matches:
            try:
                # Remove % and convert to float
                value = float(match.replace('%', ''))
                if -100 <= value <= 1000:  # Reasonable range for stock changes
                    return value
            except ValueError:
                continue
        return None
    
    @staticmethod
    def extract_pe_ratio_from_text(text: str) -> Optional[float]:
        """Extract PE ratio from text content"""
        text = text.lower()
        pe_patterns = [
            r'p/e\s*ratio?\s*:?\s*(\d+\.?\d*)',
            r'pe\s*ratio?\s*:?\s*(\d+\.?\d*)',
            r'price\s*to\s*earnings?\s*:?\s*(\d+\.?\d*)'
        ]
        
        for pattern in pe_patterns:
            matches = re.findall(pattern, text)
            for match in matches:
                try:
                    pe_ratio = float(match)
                    if 0 < pe_ratio < 1000:  # Reasonable PE ratio range
                        return pe_ratio
                except ValueError:
                    continue
        return None
    
    @staticmethod
    def clean_and_truncate_text(text: str, max_length: int = 500) -> str:
        """Clean and truncate text content"""
        if not text:
            return ""
        
        # Remove extra whitespace and newlines
        cleaned = re.sub(r'\s+', ' ', text.strip())
        
        # Truncate if too long
        if len(cleaned) > max_length:
            cleaned = cleaned[:max_length] + "..."
        
        return cleaned
    
    @staticmethod
    def validate_ticker(ticker: str) -> Tuple[bool, str]:
        """Validate stock ticker format"""
        if not ticker:
            return False, "Ticker cannot be empty"
        
        # Remove whitespace and convert to uppercase
        ticker = ticker.strip().upper()
        
        # Basic validation - alphanumeric with optional dots and hyphens
        if not re.match(r'^[A-Z0-9.-]+$', ticker):
            return False, "Ticker contains invalid characters"
        
        if len(ticker) < 1 or len(ticker) > 10:
            return False, "Ticker length should be between 1-10 characters"
        
        return True, ticker
    
    @staticmethod
    def format_currency(amount: float, currency: str = "$") -> str:
        """Format currency amount with proper formatting"""
        if amount == 0:
            return "N/A"
        
        # Use $ as default for US stocks
        if amount >= 1000000:  # 1 million
            return f"{currency}{amount/1000000:.2f}M"
        elif amount >= 1000:  # 1 thousand
            return f"{currency}{amount/1000:.2f}K"
        else:
            return f"{currency}{amount:.2f}"
    
    @staticmethod
    def create_news_summary(news_items: List[Dict], max_items: int = 5) -> Tuple[str, List[Dict]]:
        """Create formatted news summary with references"""
        if not news_items:
            return "No recent news found.", []
        
        news_summary = ""
        references = []
        
        for idx, item in enumerate(news_items[:max_items], 1):
            title = DataProcessor.clean_and_truncate_text(item.get('title', 'No title'), 100)
            content = DataProcessor.clean_and_truncate_text(item.get('content', 'No content'), 300)
            url = item.get('url', '#')
            
            news_summary += f"{idx}. {title}: {content} [Ref: {url}]\n"
            references.append({
                'index': idx, 
                'url': url, 
                'title': title
            })
        
        return news_summary, references

class CacheManager:
    """Simple cache manager for API responses"""
    
    def __init__(self, max_size: int = 100):
        self.cache = {}
        self.max_size = max_size
    
    def get(self, key: str) -> Optional[any]:
        """Get cached value"""
        return self.cache.get(key)
    
    def set(self, key: str, value: any) -> None:
        """Set cached value"""
        if len(self.cache) >= self.max_size:
            # Remove oldest entry
            oldest_key = next(iter(self.cache))
            del self.cache[oldest_key]
        
        self.cache[key] = value
    
    def clear(self) -> None:
        """Clear all cached values"""
        self.cache.clear() 