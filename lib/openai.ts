import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
});

// Document text extraction
export async function extractTextFromDocument(
  content: string,
  documentType: string
): Promise<{ text: string; metadata: any }> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are a document processing assistant. Extract and structure the text from the following ${documentType} document. Return the extracted text and any relevant metadata (dates, amounts, entities, etc.) in JSON format.`,
        },
        {
          role: 'user',
          content,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      text: result.text || content,
      metadata: result.metadata || {},
    };
  } catch (error) {
    console.error('Error extracting text:', error);
    throw new Error('Failed to extract text from document');
  }
}

// Document categorization
export async function categorizeDocument(
  content: string
): Promise<{ category: string; confidence: number; tags: string[] }> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are a document categorization assistant. Analyze the document and return its category, confidence score (0-1), and relevant tags in JSON format. Categories can be: invoice, contract, report, email, receipt, legal, financial, or other.',
        },
        {
          role: 'user',
          content,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      category: result.category || 'other',
      confidence: result.confidence || 0.5,
      tags: result.tags || [],
    };
  } catch (error) {
    console.error('Error categorizing document:', error);
    throw new Error('Failed to categorize document');
  }
}

// Workflow suggestions based on user input
export async function suggestWorkflow(
  description: string
): Promise<{ name: string; steps: any[]; triggers: any }> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are a workflow automation assistant. Based on the user description, suggest a complete workflow with name, steps, and triggers. Return in JSON format with structure: { name: string, steps: array, triggers: object }',
        },
        {
          role: 'user',
          content: description,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      name: result.name || 'Untitled Workflow',
      steps: result.steps || [],
      triggers: result.triggers || {},
    };
  } catch (error) {
    console.error('Error suggesting workflow:', error);
    throw new Error('Failed to generate workflow suggestion');
  }
}

// Natural language to workflow step conversion
export async function parseNaturalLanguageStep(
  input: string
): Promise<{ type: string; action: string; config: any }> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are a workflow step parser. Convert natural language into a workflow step with type (trigger, action, condition, delay), action name, and configuration. Return in JSON format.',
        },
        {
          role: 'user',
          content: input,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.5,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      type: result.type || 'action',
      action: result.action || input,
      config: result.config || {},
    };
  } catch (error) {
    console.error('Error parsing step:', error);
    throw new Error('Failed to parse workflow step');
  }
}

// Error message interpretation
export async function interpretError(
  errorMessage: string,
  context?: string
): Promise<{ summary: string; suggestions: string[] }> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that interprets error messages and provides user-friendly explanations and suggestions. Return in JSON format with summary and suggestions array.',
        },
        {
          role: 'user',
          content: `Error: ${errorMessage}\n${context ? `Context: ${context}` : ''}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.5,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      summary: result.summary || 'An error occurred',
      suggestions: result.suggestions || ['Please try again or contact support'],
    };
  } catch (error) {
    console.error('Error interpreting error:', error);
    return {
      summary: errorMessage,
      suggestions: ['Please contact support if this issue persists'],
    };
  }
}

// Smart data extraction from documents
export async function extractStructuredData(
  content: string,
  schema: any
): Promise<any> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `Extract structured data from the document according to this schema: ${JSON.stringify(schema)}. Return data in JSON format matching the schema.`,
        },
        {
          role: 'user',
          content,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Error extracting structured data:', error);
    throw new Error('Failed to extract structured data');
  }
}

// Check usage and rate limiting
export async function checkOpenAIUsage() {
  // Note: OpenAI doesn't have a direct usage API endpoint
  // You'll need to track this in your database
  return {
    used: 0,
    limit: 1000000, // Set based on your plan
    remaining: 1000000,
  };
}


