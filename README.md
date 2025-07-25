# tradeo ✨

**intelligent stock analysis, simplified**

A modern, full-stack Next.js application for AI-powered stock analysis with beautiful UI and real-time insights for both Indian and international stocks.

![tradeo Dashboard](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-green?style=for-the-badge&logo=supabase)
![Clerk](https://img.shields.io/badge/Clerk-purple?style=for-the-badge&logo=clerk)

## 🚀 Features

### Core Features
- **🤖 AI-Powered Analysis**: Real-time stock analysis using Perplexity AI
- **🌍 Global Market Support**: Both Indian (NSE/BSE) and international stocks
- **📊 Comprehensive Metrics**: Current price, target price, PE ratio, price changes
- **💹 Smart Recommendations**: Buy/sell/hold with risk assessment
- **📈 Sentiment Analysis**: Bullish/bearish/neutral market sentiment
- **⚡ Real-time Data**: Live stock prices and market information

### Technical Features
- **🔐 Secure Authentication**: Clerk-powered user management
- **💾 Data Persistence**: Supabase PostgreSQL database
- **📱 Mobile Responsive**: Beautiful UI optimized for all devices
- **🎨 Modern Design**: Glass morphism effects, dark theme, smooth animations
- **⚡ Performance**: Next.js 14 with App Router, optimized builds
- **🛡️ Security**: RLS policies, environment protection, CSP headers

### User Experience
- **📋 Analysis History**: Save and review past stock analyses
- **⭐ Favorites**: Mark important analyses for quick access
- **🔍 Smart Search**: Intelligent ticker validation and suggestions
- **📊 Dashboard**: Personalized overview with statistics
- **🌙 Dark Theme**: Beautiful Perplexity-inspired design

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons

### Backend & Services
- **Perplexity AI** - Stock analysis and market data
- **Supabase** - PostgreSQL database with real-time features
- **Clerk** - Authentication and user management
- **Next.js API Routes** - Server-side logic

### Deployment
- **Netlify** - Hosting and deployment
- **Edge Functions** - Serverless API endpoints

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Clerk account
- Perplexity AI API key

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/tradeo-next.git
cd tradeo-next
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Perplexity AI
PERPLEXITY_API_KEY=your_perplexity_api_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Setup

1. Create a new Supabase project
2. Run the SQL commands from `database-setup.sql` in your Supabase SQL editor
3. Verify the tables and policies are created correctly

### 5. Authentication Setup

1. Create a Clerk application
2. Configure OAuth providers (optional)
3. Set up redirects in Clerk dashboard
4. Copy your publishable and secret keys

### 6. API Key Setup

1. Get your Perplexity AI API key from [perplexity.ai](https://www.perplexity.ai/settings/api)
2. Add it to your `.env.local` file

### 7. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## 🚀 Deployment

### Netlify Deployment

1. **Build Configuration**
   ```bash
   npm run build
   ```

2. **Environment Variables**
   Set all environment variables in Netlify dashboard under Site settings > Environment variables

3. **Deploy**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `.next`
   - Deploy

### Manual Deployment Steps

1. Fork this repository
2. Connect to Netlify
3. Configure environment variables
4. Deploy automatically on push

## 📊 Database Schema

### Profiles Table
```sql
- id (UUID, Primary Key)
- user_id (TEXT, Unique)
- email (TEXT)
- first_name (TEXT)
- last_name (TEXT)
- avatar_url (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Stock Analyses Table
```sql
- id (UUID, Primary Key)
- user_id (TEXT)
- ticker (TEXT)
- stock_data (JSONB)
- analysis (JSONB)
- is_favorite (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## 🔧 Configuration

### API Rate Limits
- Perplexity AI: Check your plan limits
- Supabase: 500MB database, 500MB bandwidth (free tier)
- Clerk: 10,000 MAU (free tier)

### Security Features
- Row Level Security (RLS) on all tables
- Environment variable protection
- CSP headers for XSS protection
- Secure cookie settings

## 🎨 Customization

### Theme Colors
Edit `tailwind.config.ts` to customize the color scheme:

```typescript
colors: {
  primary: "hsl(var(--primary))",
  // Add your custom colors
}
```

### Component Styling
All components use Tailwind CSS with custom utility classes defined in `globals.css`.

## 📝 API Reference

### Stock Analysis Endpoint
```typescript
POST /api/analyze
{
  "ticker": "AAPL"
}

Response:
{
  "stockData": StockData,
  "analysis": StockAnalysis,
  "analysisId": string
}
```

### Get Analysis History
```typescript
GET /api/analyze?limit=10&offset=0

Response:
{
  "analyses": DatabaseAnalysis[]
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify Supabase URL and keys
   - Check RLS policies are enabled

2. **Authentication Issues**
   - Verify Clerk keys and domain settings
   - Check redirect URLs match

3. **API Errors**
   - Verify Perplexity API key
   - Check rate limits

### Debug Mode
```bash
NODE_ENV=development npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This application is for informational purposes only and should not be considered as financial advice. Always do your own research and consult with a qualified financial advisor before making investment decisions.

## 🙋‍♂️ Support

For support, email support@tradeo.app or join our Discord community.

---

**Built with ❤️ by the tradeo team**