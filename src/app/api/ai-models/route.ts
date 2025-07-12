import { NextResponse } from 'next/server';
import { aiService } from '@/lib/ai-service';

export async function GET() {
  // Return available AI models
  try {
    const models = aiService.getAvailableModels();
    const currentModel = aiService.getCurrentModelInfo();
    
    return NextResponse.json({
      success: true,
      models,
      currentModel
    });
  } catch (error) {
    console.error('Error getting AI models:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to get AI models',
        success: false 
      },
      { status: 500 }
    );
  }
}
