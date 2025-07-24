import streamlit as st
from utils import DataProcessor

class UIComponents:
    @staticmethod
    def apply_custom_css():
        st.markdown("""
            <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            
            .stApp {
                background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
                color: #ffffff;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                overflow-x: hidden;
            }
            
            /* Hide Streamlit elements */
            #MainMenu {visibility: hidden;}
            footer {visibility: hidden;}
            header {visibility: hidden;}
            .stDeployButton {display: none;}
            
            /* Custom scrollbar */
            ::-webkit-scrollbar {
                width: 6px;
            }
            
            ::-webkit-scrollbar-track {
                background: transparent;
            }
            
            ::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 3px;
            }
            
            ::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.3);
            }
            
            /* Center everything on the page */
            .block-container {
                padding-top: 1rem !important;
                padding-bottom: 2rem !important;
                max-width: 100% !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: flex-start !important;
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
            
            /* Title styling - minimal and elegant */
            .app-title {
                font-size: 4rem;
                font-weight: 200;
                color: #ffffff;
                text-align: center;
                margin-bottom: 0.5rem;
                letter-spacing: -0.03em;
                font-family: 'Inter', sans-serif;
                width: 100%;
                background: linear-gradient(135deg, #ffffff 0%, #cccccc 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            
            .app-subtitle {
                font-size: 1rem;
                font-weight: 400;
                color: #666666;
                text-align: center;
                margin-bottom: 3rem;
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
                background: linear-gradient(135deg, #141414 0%, #1a1a1a 100%) !important;
                border: 1px solid #2a2a2a !important;
                border-radius: 16px !important;
                padding: 1.3rem 2rem !important;
                font-size: 1.1rem !important;
                color: #ffffff !important;
                height: 64px !important;
                font-family: 'Inter', sans-serif !important;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4) !important;
                width: 100% !important;
                text-align: center !important;
                font-weight: 400 !important;
                backdrop-filter: blur(10px) !important;
                text-indent: 0 !important;
                box-sizing: border-box !important;
            }
            
            .stTextInput > div > div > input::placeholder {
                color: #6a6a6a !important;
                font-family: 'Inter', sans-serif !important;
                text-align: center !important;
                font-weight: 400 !important;
                padding-left: 0 !important;
            }
            
            .stTextInput > div > div > input:focus {
                border-color: #505050 !important;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 2px rgba(80, 80, 80, 0.3) !important;
                outline: none !important;
                text-align: center !important;
                background: linear-gradient(135deg, #161616 0%, #1e1e1e 100%) !important;
                transform: translateY(-2px) !important;
            }
            
            /* Button styling - centered and minimal */
            .stButton {
                width: 100% !important;
                display: flex !important;
                justify-content: center !important;
            }
            
            .stButton > button {
                background: linear-gradient(135deg, #1a1a1a 0%, #252525 100%) !important;
                color: #ffffff !important;
                border: 1px solid #333333 !important;
                border-radius: 12px !important;
                padding: 0.9rem 2rem !important;
                font-size: 1rem !important;
                font-weight: 500 !important;
                font-family: 'Inter', sans-serif !important;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
                height: 48px !important;
                margin-top: 1.5rem !important;
                min-width: 140px !important;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3) !important;
                backdrop-filter: blur(10px) !important;
            }
            
            .stButton > button:hover {
                background: linear-gradient(135deg, #252525 0%, #303030 100%) !important;
                border-color: #505050 !important;
                transform: translateY(-2px) !important;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4) !important;
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
            
            /* Analysis container - beautiful and structured */
            .analysis-content {
                background: linear-gradient(135deg, #141414 0%, #1a1a1a 100%);
                border: 1px solid #2a2a2a;
                border-radius: 16px;
                padding: 3rem;
                margin: 2rem auto;
                line-height: 1.8;
                width: 100%;
                max-width: 900px;
                text-align: left;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(10px);
                overflow-y: visible;
                max-height: none;
            }
            
            .analysis-content h2 {
                color: #ffffff;
                margin-top: 2.5rem;
                margin-bottom: 1.2rem;
                font-weight: 600;
                font-size: 1.4rem;
                border-bottom: 2px solid #333333;
                padding-bottom: 0.5rem;
            }
            
            .analysis-content h2:first-child {
                margin-top: 0;
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
                margin-bottom: 0.8rem;
                font-size: 1rem;
            }
            
            .analysis-content strong {
                color: #ffffff;
                font-weight: 600;
            }
            
            .analysis-content ul, .analysis-content ol {
                margin-left: 1.5rem;
                margin-bottom: 1rem;
            }
            
            .analysis-content li {
                margin-bottom: 0.5rem;
                padding-left: 0.5rem;
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
                justify-content: flex-start;
                min-height: 100vh;
                padding-top: 2rem;
            }
            
            /* Fix scrolling */
            .main {
                overflow-y: auto !important;
                height: auto !important;
            }
            </style>
        """, unsafe_allow_html=True)

    @staticmethod
    def render_header():
        """Render the minimal and beautiful header"""
        st.markdown("""
        <div style="width: 100%; display: flex; flex-direction: column; align-items: center; margin-bottom: 2rem;">
            <h1 class="app-title">tradeo</h1>
            <p class="app-subtitle">intelligent stock analysis, simplified</p>
        </div>
        """, unsafe_allow_html=True)

    @staticmethod
    def render_search_section():
        """Render the beautiful and minimal search section"""
        st.markdown('<div class="search-wrapper">', unsafe_allow_html=True)
        
        ticker = st.text_input(
            "Stock Ticker", 
            placeholder="Enter any stock ticker (e.g., AAPL, TSLA, NVDA)...", 
            key="ticker_input",
            label_visibility="collapsed"
        ).upper()
        
        # Only show analyze button if there's input
        if ticker.strip():
            col1, col2, col3 = st.columns([2, 1, 2])
            with col2:
                analyze_button = st.button("✨ Analyze", use_container_width=True)
        else:
            analyze_button = False
            # Show some example suggestions when empty
            st.markdown("""
            <div style="text-align: center; margin-top: 2rem; color: #666666; font-size: 0.9rem;">
                <p>Try searching for: <strong>AAPL</strong>, <strong>TSLA</strong>, <strong>NVDA</strong>, <strong>GOOGL</strong></p>
            </div>
            """, unsafe_allow_html=True)
        
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
        """Render analysis with beautiful formatting"""
        # Apply custom CSS for the next markdown element
        st.markdown("""
        <style>
                 .element-container:has(.analysis-markdown) {
             background: linear-gradient(135deg, #141414 0%, #1a1a1a 100%) !important;
             border: 1px solid #2a2a2a !important;
             border-radius: 16px !important;
             padding: 3rem !important;
             margin: 2rem auto !important;
             box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
             backdrop-filter: blur(10px) !important;
             max-width: 900px !important;
             overflow-x: hidden !important;
             word-wrap: break-word !important;
         }
        .analysis-markdown h2 {
            color: #ffffff !important;
            margin-top: 2.5rem !important;
            margin-bottom: 1.2rem !important;
            font-weight: 600 !important;
            font-size: 1.4rem !important;
            border-bottom: 2px solid #333333 !important;
            padding-bottom: 0.5rem !important;
        }
        .analysis-markdown h2:first-child {
            margin-top: 0 !important;
        }
                    .analysis-markdown p, .analysis-markdown li {
             color: #cccccc !important;
             margin-bottom: 0.8rem !important;
             font-size: 1rem !important;
             line-height: 1.8 !important;
             word-wrap: break-word !important;
             overflow-wrap: break-word !important;
             hyphens: auto !important;
             max-width: 100% !important;
         }
        .analysis-markdown strong {
            color: #ffffff !important;
            font-weight: 600 !important;
        }
        .analysis-markdown ul, .analysis-markdown ol {
            margin-left: 1.5rem !important;
            margin-bottom: 1rem !important;
        }
        </style>
                 """, unsafe_allow_html=True)
         
         # Render the markdown with a custom class and proper word wrapping
         st.markdown(f'<div class="analysis-markdown" style="word-wrap: break-word; overflow-wrap: break-word; max-width: 100%; overflow-x: hidden;">\n\n{analysis}\n\n</div>', unsafe_allow_html=True)

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