import { GoogleGenerativeAI } from '@google/generative-ai';
import { CreateDocumentRequest, AIModel } from '@/types';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// Available Gemini models in order of preference
const GEMINI_MODELS: AIModel[] = [
  { name: 'Gemini 2.5 Flash', model: 'gemini-2.5-flash', available: true },
  { name: 'Gemini 2.0 Flash Experimental', model: 'gemini-2.0-flash-exp', available: true },
  { name: 'Gemini 2.0 Flash', model: 'gemini-2.0-flash', available: true },
  { name: 'Gemini 2.0 Flash Lite', model: 'gemini-2.0-flash-lite', available: true },
  { name: 'Gemini 1.5 Flash', model: 'gemini-1.5-flash', available: true },
  { name: 'Gemini 1.5 Flash 8B', model: 'gemini-1.5-flash-8b', available: true },
];

class AIService {
  private genAI: GoogleGenerativeAI;
  private currentModelIndex = 0;

  constructor() {
    this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  }

  private getCurrentModel(): AIModel {
    return GEMINI_MODELS[this.currentModelIndex];
  }

  private async tryNextModel(): Promise<boolean> {
    this.currentModelIndex++;
    return this.currentModelIndex < GEMINI_MODELS.length;
  }

  private resetToFirstModel(): void {
    this.currentModelIndex = 0;
  }

  private generatePrompt(request: CreateDocumentRequest): string {
    const { title, type, prompt, category } = request;
    
    const typeInstructions = {
      document: 'Create a well-structured document with clear headings, paragraphs, and professional formatting.',
      slide: 'Create content suitable for a presentation with bullet points, clear sections, and engaging headlines.',
      spreadsheet: 'Create structured data with clear columns, rows, and organized information suitable for a spreadsheet.'
    };

    const categoryContext = {
      business: 'Focus on professional language, business terminology, and corporate standards.',
      personal: 'Use a friendly, personal tone while maintaining clarity and usefulness.',
      academic: 'Use formal academic language with proper citations and scholarly approach.'
    };

    return `
Create a ${type} titled "${title}" for ${category} use.

${typeInstructions[type]}
${categoryContext[category]}

User prompt: ${prompt}

Please generate comprehensive, high-quality content that is relevant, well-organized, up to date and professional.
The content should be substantial enough to be useful while being clear and concise.

CRITICAL INSTRUCTIONS:
- Do NOT include any specific dates, timestamps, or date signatures in the content
- Do NOT add date footers like "Date: [specific date]"
- Use relative terms like "recently", "this quarter", "current period", "latest analysis" instead
- Focus only on the main content without any date metadata
`;
  }

  private cleanGeneratedContent(content: string): string {
    // Remove common date patterns that might appear in AI-generated content
    let cleaned = content;

    // Remove date signatures like "Date: February 14, 2024" or "*Date: [date]*"
    cleaned = cleaned.replace(/\*?Date:\s*[A-Za-z]+\s+\d{1,2},?\s+\d{4}\*?/gi, '');

    // Remove standalone dates in various formats
    cleaned = cleaned.replace(/\b[A-Za-z]+\s+\d{1,2},?\s+\d{4}\b/g, '');
    cleaned = cleaned.replace(/\b\d{1,2}\/\d{1,2}\/\d{4}\b/g, '');
    cleaned = cleaned.replace(/\b\d{4}-\d{2}-\d{2}\b/g, '');

    // Remove extra whitespace and empty lines
    cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n');
    cleaned = cleaned.replace(/^\s+|\s+$/g, '');

    return cleaned;
  }

  async generateDocument(request: CreateDocumentRequest): Promise<string> {
    this.resetToFirstModel();
    
    while (this.currentModelIndex < GEMINI_MODELS.length) {
      try {
        const currentModel = this.getCurrentModel();
        console.log(`Trying model: ${currentModel.name} (${currentModel.model})`);
        
        const model = this.genAI.getGenerativeModel({ model: currentModel.model });
        const prompt = this.generatePrompt(request);
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        if (text && text.trim().length > 0) {
          console.log(`Successfully generated content with ${currentModel.name}`);

          // Clean the content to remove any unwanted dates
          const cleanedContent = this.cleanGeneratedContent(text.trim());
          return cleanedContent;
        }
        
        throw new Error('Empty response from AI model');
        
      } catch (error) {
        console.error(`Error with model ${this.getCurrentModel().name}:`, error);
        
        const hasNextModel = await this.tryNextModel();
        if (!hasNextModel) {
          throw new Error(`All AI models failed. Last error: ${error}`);
        }
      }
    }
    
    throw new Error('No available AI models');
  }

  getAvailableModels(): AIModel[] {
    return GEMINI_MODELS;
  }

  getCurrentModelInfo(): AIModel {
    return this.getCurrentModel();
  }
}

export const aiService = new AIService();
