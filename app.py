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
            prompt = f"""
            Analyze the investment potential for {ticker} stock as of {current_date}.
            [Previous else block content remains the same]
            """
        
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
    st.set_page_config(page_title="Stock Analysis Dashboard", layout="wide")
    
    # Custom CSS
    st.markdown("""
        <style>
        .stApp {
            background-color: #0e1117;
            color: #ffffff;
        }
        .stMetric {
            background-color: #1f2937;
            padding: 10px;
            border-radius: 5px;
        }
        .analysis-container {
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            background-color: #1E1E1E;
            border-radius: 10px;
            line-height: 1.6;
        }
        .analysis-container h2 {
            color: #00ff88;
            margin-top: 20px;
            margin-bottom: 10px;
            font-size: 1.5em;
        }
        .analysis-container h3 {
            color: #00bbff;
            margin-top: 15px;
            margin-bottom: 8px;
        }
        .analysis-container ul {
            margin-left: 20px;
            margin-bottom: 15px;
        }
        .analysis-container li {
            margin-bottom: 5px;
        }
        .recommendation {
            background-color: #2d2d2d;
            padding: 15px;
            border-radius: 5px;
            margin: 10px 0;
        }
        </style>
    """, unsafe_allow_html=True)
    
    # Main content
    st.title("🚀 Stock Analysis Dashboard")
    
    # Input section
    col1, col2 = st.columns([2, 1])
    with col1:
        ticker = st.text_input("Enter Stock Ticker:", "").upper()
    with col2:
        analyze_button = st.button("Analyze 📊", type="primary")
    
    if analyze_button or ticker:
        if ticker:
            try:
                api_key = st.secrets["api_keys"]["perplexity"]
                analyzer = StockSentimentAnalyzer(api_key)
                
                with st.spinner('Analyzing stock data... 🔄'):
                    analysis, stock_data = analyzer.analyze_sentiment(ticker)
                    
                    if stock_data:
                        # Display metrics
                        st.markdown("<h2 style='text-align: center;'>📈 Key Metrics</h2>", unsafe_allow_html=True)
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
                        st.markdown("<h2 style='text-align: center;'>📊 Price Chart</h2>", unsafe_allow_html=True)
                        st.plotly_chart(create_price_chart(stock_data['historical_data']), use_container_width=True)
                    
                    # Display analysis
                    st.markdown("<h2 style='text-align: center;'>📝 Analysis Report</h2>", unsafe_allow_html=True)
                    st.markdown(f"<div class='analysis-container'>{analysis}</div>", unsafe_allow_html=True)
                    
            except Exception as e:
                st.error(f"Error analyzing {ticker}: {str(e)}")
        else:
            st.warning("⚠️ Please enter a stock ticker")

if __name__ == "__main__":
    main()