import streamlit as st
from openai import OpenAI
import datetime
import yfinance as yf
import pandas as pd
import plotly.graph_objects as go

class StockSentimentAnalyzer:
    def __init__(self, api_key):
        self.client = OpenAI(
            api_key=api_key,
            base_url="https://api.perplexity.ai"
        )
    
    def get_stock_data(self, ticker):
        try:
            stock = yf.Ticker(ticker)
            info = stock.info
            current_price = info.get('currentPrice', 0)
            target_price = info.get('targetMeanPrice', 0)
            pe_ratio = info.get('forwardPE', 0)
            
            hist = stock.history(period="1mo")
            price_change = ((hist['Close'][-1] - hist['Close'][0]) / hist['Close'][0]) * 100
            
            return {
                'current_price': current_price,
                'target_price': target_price,
                'pe_ratio': pe_ratio,
                'price_change': price_change,
                'historical_data': hist
            }
        except Exception as e:
            return None

    def analyze_sentiment(self, ticker):
        current_date = datetime.datetime.now().strftime("%Y-%m-%d")
        stock_data = self.get_stock_data(ticker)
        
        if stock_data:
            price_potential = ((stock_data['target_price'] - stock_data['current_price']) / stock_data['current_price']) * 100
            
            prompt = f"""
            **Investment Analysis for {ticker} Stock as of {current_date}**

            Current Trading Price: ${stock_data['current_price']:.2f}

            **Market Data:**
            • Current Price: ${stock_data['current_price']:.2f}
            • Target Price: ${stock_data['target_price']:.2f}
            • PE Ratio: {stock_data['pe_ratio']:.2f}
            • 1-Month Price Change: {stock_data['price_change']:.2f}%
            • Potential Upside: {price_potential:.2f}%

            Please provide a detailed analysis in the following format:

            **1. Current Market Sentiment Analysis**
            • Sentiment: (Bullish/Bearish/Neutral)
            • Investor Confidence: (High/Medium/Low)
            • Brief explanation of current sentiment

            **2. Key Recent Developments and News**
            • Q2 Results: [Key metrics]
            • Recent Contracts/Developments
            • Industry Updates

            **3. Technical Analysis**
            • Price Trend Analysis
            • Support and Resistance Levels
            • Key Technical Indicators

            **4. Risk Assessment**
            • Market Risks
            • Company-Specific Risks
            • Industry Risks

            **5. Investment Recommendation**
            • Rating: (BUY/SELL/HOLD)
            • Confidence Level: (High/Medium/Low)
            • Entry Price Range: (within 5% of ${stock_data['current_price']:.2f})
            • Stop Loss: (specify price)
            • Target Price: (specify price)
            • Investment Timeframe: (Short/Medium/Long-term)

            **6. Key Reasons for Recommendation**
            1. [First key reason]
            2. [Second key reason]
            3. [Third key reason]

            Format the response with clear headers and bullet points.
            """
        else:
            prompt = f"Analyze the investment potential for {ticker} stock as of {current_date}."
        
        messages = [
            {
                "role": "system",
                "content": """You are an expert stock market analyst. Provide structured, clear, and actionable investment analysis.
                Use markdown formatting for headers and bullet points. Be specific with numbers and recommendations.
                Always maintain a professional, clear, and organized format."""
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
        
        response = self.client.chat.completions.create(
            model="llama-3.1-sonar-huge-128k-online",
            messages=messages,
            temperature=0.7,
            max_tokens=1500,
            stream=False
        )
        
        return response.choices[0].message.content, stock_data

def create_price_chart(historical_data):
    fig = go.Figure()
    fig.add_trace(go.Candlestick(
        x=historical_data.index,
        open=historical_data['Open'],
        high=historical_data['High'],
        low=historical_data['Low'],
        close=historical_data['Close']
    ))
    fig.update_layout(
        title="Stock Price - Last 30 Days",
        yaxis_title="Price",
        xaxis_title="Date",
        template="plotly_dark",
        height=500
    )
    return fig

def main():
    st.set_page_config(page_title="TRADEO", layout="wide")
    
    # Custom CSS
    st.markdown("""
        <style>
        .stApp {
            background-color: #0e1117;
            color: #ffffff;
        }
        
        .section-header {
            color: #4FD1C5;
            font-size: 1.8rem;
            font-weight: bold;
            margin: 2rem 0 1rem 0;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid #4FD1C5;
        }
        
        .stMetric {
            background-color: rgba(45, 55, 72, 0.7);
            padding: 1.5rem;
            border-radius: 8px;
            border-top: 4px solid #4FD1C5;
        }
        
        .title-container {
            text-align: center;
            padding: 2rem 0;
            margin-bottom: 2rem;
            background: linear-gradient(90deg, rgba(14,17,23,0) 0%, rgba(14,17,23,0.8) 50%, rgba(14,17,23,0) 100%);
        }
        
        .title-container h1 {
            color: #fff;
            font-size: 3rem;
            margin-bottom: 0.5rem;
        }
        
        .tagline {
            color: #FF6B6B;
            font-size: 1.2rem;
            margin-top: -0.5rem;
        }
        
        .markdown-text-container {
            line-height: 1.6;
            color: #E2E8F0;
            padding: 1rem;
            background: rgba(45, 55, 72, 0.3);
            border-radius: 8px;
        }
        
        .markdown-text-container h1, 
        .markdown-text-container h2, 
        .markdown-text-container h3 {
            color: #4FD1C5;
        }
        
        .markdown-text-container strong {
            color: #90CDF4;
        }
        
        .stButton>button {
            background-color: #4FD1C5 !important;
            color: #1A202C !important;
            font-weight: 600;
            height: 2.75rem;
        }
        
        .stTextInput input {
            height: 2.75rem;
            background-color: rgba(45, 55, 72, 0.7);
            border-color: #4FD1C5;
        }
        </style>
    """, unsafe_allow_html=True)
    
    # Title and tagline
    st.markdown("""
        <div class="title-container">
            <h1>🚀 TRADEO</h1>
            <p class="tagline">stonks made simple fr fr 📈</p>
        </div>
    """, unsafe_allow_html=True)
    
    # Search container
    col1, col2 = st.columns([5, 1])
    with col1:
        ticker = st.text_input("Enter Stock Ticker:", "", key="ticker_input", label_visibility="collapsed").upper()
    with col2:
        analyze_button = st.button("Analyze 📊", type="primary", use_container_width=True)

    if analyze_button or ticker:
        if ticker:
            try:
                api_key = st.secrets["api_keys"]["perplexity"]
                analyzer = StockSentimentAnalyzer(api_key)
                
                with st.spinner('Analyzing stock data... 🔄'):
                    analysis, stock_data = analyzer.analyze_sentiment(ticker)
                    
                    if stock_data:
                        # Display metrics
                        st.markdown('<h2 class="section-header">📈 Key Metrics</h2>', unsafe_allow_html=True)
                        col1, col2, col3, col4 = st.columns(4)
                        with col1:
                            st.metric("Current Price", f"${stock_data['current_price']:.2f}")
                        with col2:
                            st.metric("Target Price", f"${stock_data['target_price']:.2f}")
                        with col3:
                            st.metric("PE Ratio", f"{stock_data['pe_ratio']:.2f}")
                        with col4:
                            st.metric("1-Month Change", f"{stock_data['price_change']:.2f}%")
                        
                        # Display chart
                        st.markdown('<h2 class="section-header">📊 Price Chart</h2>', unsafe_allow_html=True)
                        st.plotly_chart(create_price_chart(stock_data['historical_data']), use_container_width=True)
                        
                        # Display analysis
                        st.markdown('<h2 class="section-header">📝 Analysis Report</h2>', unsafe_allow_html=True)
                        st.markdown(f'<div class="markdown-text-container">{analysis}</div>', unsafe_allow_html=True)
                    
            except Exception as e:
                st.error(f"Error analyzing {ticker}: {str(e)}")
        else:
            st.warning("⚠️ Please enter a stock ticker")

if __name__ == "__main__":
    main()