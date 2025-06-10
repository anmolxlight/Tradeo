import streamlit as st
from utils import DataProcessor

class UIComponents:
    @staticmethod
    def apply_custom_css():
        st.markdown("""
            <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            
            .stApp {
                background-color: #0A0A0A;
                color: #ffffff;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            /* Hide Streamlit elements */
            #MainMenu {visibility: hidden;}
            footer {visibility: hidden;}
            header {visibility: hidden;}
            .stDeployButton {display: none;}
            
            /* Center everything on the page */
            .block-container {
                padding-top: 0 !important;
                padding-bottom: 2rem !important;
                max-width: 100% !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                min-height: 100vh !important;
            }
            
            /* Main container */
            .main-container {
                width: 100%;
                max-width: 800px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                margin: 0 auto;
                padding: 0 2rem;
            }
            
            /* Title styling - closer to search box */
            .app-title {
                font-size: 3.5rem;
                font-weight: 300;
                color: #ffffff;
                text-align: center;
                margin-bottom: 1.5rem;
                letter-spacing: -0.02em;
                font-family: 'Inter', sans-serif;
                width: 100%;
            }
            
            /* Search container - closer to title */
            .search-wrapper {
                width: 100%;
                max-width: 650px;
                position: relative;
                margin-bottom: 2rem;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            
            /* Input styling - clean and minimal */
            .stTextInput {
                width: 100% !important;
            }
            
            .stTextInput > div {
                width: 100% !important;
            }
            
            .stTextInput > div > div {
                width: 100% !important;
            }
            
            .stTextInput > div > div > input {
                background-color: #141414 !important;
                border: 1px solid #2a2a2a !important;
                border-radius: 14px !important;
                padding: 1.2rem 1.8rem !important;
                font-size: 1rem !important;
                color: #ffffff !important;
                height: 60px !important;
                font-family: 'Inter', sans-serif !important;
                transition: all 0.3s ease !important;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
                width: 100% !important;
                text-align: left !important;
                font-weight: 400 !important;
            }
            
            .stTextInput > div > div > input::placeholder {
                color: #6a6a6a !important;
                font-family: 'Inter', sans-serif !important;
                text-align: left !important;
                font-weight: 400 !important;
            }
            
            .stTextInput > div > div > input:focus {
                border-color: #404040 !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(64, 64, 64, 0.5) !important;
                outline: none !important;
                text-align: left !important;
                background-color: #161616 !important;
            }
            
            /* Button styling - centered and minimal */
            .stButton {
                width: 100% !important;
                display: flex !important;
                justify-content: center !important;
            }
            
            .stButton > button {
                background-color: #1a1a1a !important;
                color: #ffffff !important;
                border: 1px solid #2a2a2a !important;
                border-radius: 10px !important;
                padding: 0.8rem 1.8rem !important;
                font-size: 0.9rem !important;
                font-weight: 500 !important;
                font-family: 'Inter', sans-serif !important;
                transition: all 0.3s ease !important;
                height: 42px !important;
                margin-top: 1.2rem !important;
                min-width: 130px !important;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2) !important;
            }
            
            .stButton > button:hover {
                background-color: #242424 !important;
                border-color: #404040 !important;
                transform: translateY(-1px) !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
            }
            
            /* Results container - centered */
            .results-container {
                width: 100%;
                max-width: 800px;
                margin: 2rem auto 0 auto;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            
            /* Metrics styling - centered */
            .metrics-row {
                display: flex;
                gap: 1rem;
                margin: 2rem 0;
                flex-wrap: wrap;
                justify-content: center;
                width: 100%;
                max-width: 800px;
            }
            
            .metric-item {
                background-color: #141414;
                border: 1px solid #2a2a2a;
                border-radius: 12px;
                padding: 1.2rem;
                flex: 1;
                min-width: 160px;
                text-align: center;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                transition: all 0.3s ease;
            }
            
            .metric-item:hover {
                border-color: #404040;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }
            
            .metric-label {
                color: #999999;
                font-size: 0.875rem;
                margin-bottom: 0.6rem;
                font-weight: 500;
            }
            
            .metric-value {
                color: #ffffff;
                font-size: 1.3rem;
                font-weight: 600;
            }
            
            /* Analysis container - centered */
            .analysis-content {
                background-color: #141414;
                border: 1px solid #2a2a2a;
                border-radius: 14px;
                padding: 2.5rem;
                margin: 2rem auto;
                line-height: 1.7;
                width: 100%;
                max-width: 800px;
                text-align: left;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
            }
            
            .analysis-content h3 {
                color: #ffffff;
                margin-top: 1.8rem;
                margin-bottom: 0.8rem;
                font-weight: 600;
                font-size: 1.1rem;
            }
            
            .analysis-content p, .analysis-content li {
                color: #cccccc;
                margin-bottom: 0.6rem;
                font-size: 0.95rem;
            }
            
            /* Messages - centered */
            .info-message {
                background-color: #141414;
                border: 1px solid #2a2a2a;
                border-radius: 12px;
                padding: 1.2rem;
                color: #cccccc;
                text-align: center;
                margin: 1rem auto;
                width: 100%;
                max-width: 600px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            }
            
            .error-message {
                background-color: #1a0f0f;
                border: 1px solid #3a1a1a;
                border-radius: 12px;
                padding: 1.2rem;
                color: #ff9999;
                margin: 1rem auto;
                width: 100%;
                max-width: 600px;
                text-align: center;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            }
            
            /* Loading spinner */
            .stSpinner > div {
                border-color: #4a5568 transparent transparent transparent !important;
            }
            
            /* Hide labels */
            .stTextInput > label {
                display: none !important;
            }
            
            /* Ensure columns are centered */
            .stColumns {
                width: 100% !important;
                display: flex !important;
                justify-content: center !important;
            }
            
            /* Center the entire app content */
            .main .block-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
            }
            </style>
        """, unsafe_allow_html=True)

    @staticmethod
    def render_header():
        """Render the minimal header"""
        st.markdown("""
        <div style="width: 100%; display: flex; justify-content: center; margin-bottom: 1.5rem;">
            <h1 class="app-title">tradeo</h1>
        </div>
        """, unsafe_allow_html=True)

    @staticmethod
    def render_search_section():
        """Render the minimal search section"""
        st.markdown('<div class="search-wrapper">', unsafe_allow_html=True)
        
        ticker = st.text_input(
            "", 
            placeholder="Ask anything about stocks...", 
            key="ticker_input",
            label_visibility="collapsed"
        ).upper()
        
        # Only show analyze button if there's input
        if ticker.strip():
            col1, col2, col3 = st.columns([1, 1, 1])
            with col2:
                analyze_button = st.button("Analyze", use_container_width=True)
        else:
            analyze_button = False
        
        st.markdown('</div>', unsafe_allow_html=True)
        return ticker, analyze_button

    @staticmethod
    def render_metrics(stock_data):
        """Render metrics in a minimal style"""
        if stock_data and stock_data['current_price'] > 0:
            # Format values
            current_price = DataProcessor.format_currency(stock_data['current_price'])
            target_price = DataProcessor.format_currency(stock_data['target_price']) if stock_data['target_price'] > 0 else "N/A"
            pe_ratio = f"{stock_data['pe_ratio']:.2f}" if stock_data['pe_ratio'] > 0 else "N/A"
            price_change = stock_data['price_change']
            change_color = "#4ade80" if price_change >= 0 else "#f87171"
            change_text = f"{price_change:+.2f}%"
            
            st.markdown(f"""
            <div class="metrics-row">
                <div class="metric-item">
                    <div class="metric-label">Current Price</div>
                    <div class="metric-value">{current_price}</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">Target Price</div>
                    <div class="metric-value">{target_price}</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">PE Ratio</div>
                    <div class="metric-value">{pe_ratio}</div>
                </div>
                <div class="metric-item">
                    <div class="metric-label">Change</div>
                    <div class="metric-value" style="color: {change_color};">{change_text}</div>
                </div>
            </div>
            """, unsafe_allow_html=True)
            return True
        else:
            st.markdown('<div class="info-message">Market data unavailable. Analysis based on available information.</div>', unsafe_allow_html=True)
            return False

    @staticmethod
    def render_analysis(analysis):
        """Render analysis in minimal style"""
        st.markdown(f'<div class="analysis-content">{analysis}</div>', unsafe_allow_html=True)

    @staticmethod
    def render_error(ticker, error_message):
        """Render minimal error message"""
        st.markdown(f"""
        <div class="error-message">
            <strong>Error analyzing {ticker}:</strong> {error_message}<br>
            <small>Please try again or check your connection.</small>
        </div>
        """, unsafe_allow_html=True)

    @staticmethod
    def render_warning(message):
        """Render minimal warning"""
        st.markdown(f'<div class="info-message">{message}</div>', unsafe_allow_html=True)

    @staticmethod
    def render_success(message):
        """Render success message"""
        st.markdown(f'<div class="info-message" style="border-color: #4ade80; color: #4ade80;">{message}</div>', unsafe_allow_html=True)

    @staticmethod
    def render_loading_spinner(message="Analyzing..."):
        """Render minimal loading spinner"""
        return st.spinner(message)

    @staticmethod
    def render_footer():
        """Render minimal footer"""
        st.markdown("""
        <div style="text-align: center; padding: 2rem; margin-top: 3rem; color: #666666; font-size: 0.875rem; width: 100%;">
            <p>This analysis is for informational purposes only. Always do your own research.</p>
        </div>
        """, unsafe_allow_html=True) 