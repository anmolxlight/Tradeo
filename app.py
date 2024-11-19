# streamlit_app.py
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
            Current Trading Price for {ticker}: ${stock_data['current_price']:.2f}

            Analyze the investment potential for {ticker} stock as of {current_date}. 
            
            Current Stock Data:
            - Current Price: ${stock_data['current_price']:.2f}
            - Target Price: ${stock_data['target_price']:.2f}
            - PE Ratio: {stock_data['pe_ratio']:.2f}
            - 1-Month Price Change: {stock_data['price_change']:.2f}%
            - Potential Upside: {price_potential:.2f}%
            
            Based on this data and current market conditions:
            1. Analyze the current market sentiment and price trends
            2. Evaluate key recent developments and news
            3. Assess technical indicators and price patterns
            4. Identify major risk factors
            5. Provide a clear BUY/SELL recommendation with:
               - Confidence level (High/Medium/Low)
               - Entry price range (must be within 5% of current price ${stock_data['current_price']:.2f})
               - Stop loss suggestion (realistic, based on current price)
               - Target price
               - Investment timeframe
            6. List 3 key reasons for your recommendation
            
            Note: Ensure the entry price recommendation is realistic and close to the current trading price.
            Format the response in a clear, structured manner, starting with the current trading price.
            """
        else:
            prompt = f"""
            Analyze the investment potential for {ticker} stock as of {current_date}.
            
            Please provide:
            1. Current market sentiment analysis
            2. Key recent developments and news
            3. Major risk factors
            4. Clear BUY/SELL recommendation with:
               - Confidence level (High/Medium/Low)
               - Suggested entry price range
               - Investment timeframe
            5. Three key reasons for your recommendation
            
            Format the response in a clear, structured manner.
            """
        
        messages = [
            {
                "role": "system",
                "content": """You are an expert stock market analyst with deep expertise in technical analysis, 
                fundamental analysis, and market sentiment. Provide detailed, actionable investment advice with 
                specific price targets and clear reasoning. Always be direct and decisive in your recommendations."""
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
        template="plotly_dark"
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
        .analysis-text {
            text-align: center;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .stButton>button {
            width: 100%;
        }
        </style>
    """, unsafe_allow_html=True)
    
    # Center the main title
    col1, col2, col3 = st.columns([1,2,1])
    with col2:
        st.title("🚀 Stock Analysis Dashboard")
    
    # Input section with Enter key functionality
    col1, col2 = st.columns([2, 1])
    with col1:
        ticker = st.text_input("Enter Stock Ticker:", "").upper()
    with col2:
        analyze_button = st.button("Analyze 📊", type="primary")
    
    # Trigger analysis on either button click or Enter key
    if analyze_button or ticker:
        if ticker:
            try:
                # Use API key from Streamlit secrets
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
                    st.markdown(f"<div class='analysis-text'>{analysis}</div>", unsafe_allow_html=True)
                    
            except Exception as e:
                st.error(f"Error analyzing {ticker}: {str(e)}")
        else:
            st.warning("⚠️ Please enter a stock ticker")

   

if __name__ == "__main__":
    main()