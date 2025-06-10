import streamlit as st
from analyzer import StockSentimentAnalyzer
from ui_components import UIComponents
from config import Config

def main():
    # Initialize configuration
    config = Config()
    
    # Set page configuration
    st.set_page_config(
        page_title="tradeo",
        layout="centered",
        initial_sidebar_state="collapsed"
    )
    
    # Apply custom CSS
    UIComponents.apply_custom_css()
    
    # Render header
    UIComponents.render_header()
    
    # Render search section
    ticker, analyze_button = UIComponents.render_search_section()
    
    # Main analysis logic
    if analyze_button and ticker:
        # Validate API keys
        keys_valid, missing_keys = config.validate_api_keys()
        if not keys_valid:
            UIComponents.render_error("Configuration", f"Missing API keys: {', '.join(missing_keys)}")
            return
        
        try:
            # Initialize analyzer
            analyzer = StockSentimentAnalyzer(config.gemini_api_key, config.tavily_api_key)
            
            # Show loading spinner and perform analysis
            with UIComponents.render_loading_spinner("Analyzing..."):
                analysis, stock_data = analyzer.analyze_sentiment(ticker)
            
            # Render metrics if available
            UIComponents.render_metrics(stock_data)
            
            # Render analysis report
            UIComponents.render_analysis(analysis)
            
        except Exception as e:
            UIComponents.render_error(ticker, str(e))
    
    # Render footer
    UIComponents.render_footer()

if __name__ == "__main__":
    main()