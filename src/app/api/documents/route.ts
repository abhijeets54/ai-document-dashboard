import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai-service';
import { CreateDocumentRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: CreateDocumentRequest = await request.json();
    
    // Validate request body
    if (!body.title || !body.prompt || !body.type || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate document content using AI
    const content = await aiService.generateDocument(body);
    
    // Return the generated content
    return NextResponse.json({
      success: true,
      content,
      model: aiService.getCurrentModelInfo()
    });
    
  } catch (error) {
    console.error('Error generating document:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to generate document',
        success: false 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    // Mock documents data (in a real app, this would come from a database)
    const mockDocuments = [
      {
        id: '1',
        title: 'Marketing Strategy Q1 2025',
        type: 'document',
        category: 'business',
        content: 'This comprehensive marketing strategy outlines our approach for Q1 2025, focusing on digital transformation and customer engagement initiatives.',
        createdAt: '2025-01-15T10:30:00Z',
        aiGenerated: true,
        tags: ['marketing', 'strategy', 'Q1']
      },
      {
        id: '2',
        title: 'Product Launch Presentation',
        type: 'slide',
        category: 'business',
        content: 'Slide deck for the upcoming product launch event, including market analysis, product features, and go-to-market strategy.',
        createdAt: '2025-01-14T14:20:00Z',
        aiGenerated: true,
        tags: ['product', 'launch', 'presentation']
      },
      {
        id: '3',
        title: 'Budget Analysis 2025',
        type: 'spreadsheet',
        category: 'business',
        content: 'Detailed financial analysis and budget projections for the fiscal year 2025, including revenue forecasts and expense breakdowns.',
        createdAt: '2025-01-13T09:15:00Z',
        aiGenerated: false,
        tags: ['budget', 'finance', '2025']
      },
      {
        id: '4',
        title: 'Research Paper: AI in Education',
        type: 'document',
        category: 'academic',
        content: 'Academic research paper exploring the impact of artificial intelligence on modern education systems and learning methodologies.',
        createdAt: '2025-01-12T16:45:00Z',
        aiGenerated: true,
        tags: ['AI', 'education', 'research']
      },
      {
        id: '5',
        title: 'Personal Journal Entry',
        type: 'document',
        category: 'personal',
        content: 'Reflections on personal growth and goal setting for the new year, including strategies for maintaining work-life balance.',
        createdAt: '2025-01-11T20:30:00Z',
        aiGenerated: false,
        tags: ['journal', 'personal', 'goals']
      }
    ];

    // Apply filters
    let filteredDocuments = mockDocuments;

    if (type && type !== 'all') {
      filteredDocuments = filteredDocuments.filter(doc => doc.type === type);
    }

    if (category && category !== 'all') {
      filteredDocuments = filteredDocuments.filter(doc => doc.category === category);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredDocuments = filteredDocuments.filter(doc =>
        doc.title.toLowerCase().includes(searchLower) ||
        doc.content.toLowerCase().includes(searchLower) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      documents: paginatedDocuments,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredDocuments.length / limit),
        totalItems: filteredDocuments.length,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Error getting documents:', error);

    return NextResponse.json(
      {
        error: 'Failed to get documents',
        success: false
      },
      { status: 500 }
    );
  }
}
