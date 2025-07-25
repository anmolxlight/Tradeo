import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { StockAnalyzer } from '@/lib/stock-analyzer'
import { supabase } from '@/lib/supabase'
import { validateTicker } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { ticker } = await request.json()
    
    if (!ticker) {
      return NextResponse.json({ error: 'Ticker is required' }, { status: 400 })
    }

    const validation = validateTicker(ticker)
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.message }, { status: 400 })
    }

    const perplexityApiKey = process.env.PERPLEXITY_API_KEY
    if (!perplexityApiKey) {
      return NextResponse.json({ error: 'Perplexity API key not configured' }, { status: 500 })
    }

    // Initialize analyzer and perform analysis
    const analyzer = new StockAnalyzer(perplexityApiKey)
    const { stockData, analysis } = await analyzer.analyzeStock(validation.cleanTicker)

    // Save to database
    const { data, error } = await supabase
      .from('stock_analyses')
      .insert({
        user_id: userId,
        ticker: validation.cleanTicker,
        stock_data: stockData,
        analysis: analysis,
        is_favorite: false,
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      // Continue even if database save fails
    }

    return NextResponse.json({ 
      stockData, 
      analysis,
      analysisId: data?.id 
    })

  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze stock. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50)
    const offset = parseInt(searchParams.get('offset') || '0')

    const { data, error } = await supabase
      .from('stock_analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw error
    }

    return NextResponse.json({ analyses: data || [] })

  } catch (error) {
    console.error('Get analyses error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analyses' },
      { status: 500 }
    )
  }
}