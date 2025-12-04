import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma, trackUsage, createAuditLog } from '@/lib/prisma';
import { checkSubscriptionLimit } from '@/lib/rbac';
import { extractTextFromDocument, categorizeDocument } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    // Get user to check subscription limits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        documents: {
          select: { id: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check document limit
    const limitCheck = checkSubscriptionLimit(
      user.subscription_tier as any,
      'documents',
      user.documents.length
    );

    if (!limitCheck.allowed) {
      return NextResponse.json(
        { error: 'Document limit reached. Please upgrade your plan.' },
        { status: 403 }
      );
    }

    // Process each file
    const uploadedDocuments = [];

    for (const file of files) {
      // Read file content
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const content = buffer.toString('utf-8');

      // Get or create default workspace for user
      let workspace = await prisma.workspace.findFirst({
        where: { owner_id: session.user.id },
      });
      
      if (!workspace) {
        workspace = await prisma.workspace.create({
          data: {
            name: 'Default Workspace',
            owner_id: session.user.id,
          },
        });
      }

      // Create document record
      const document = await prisma.document.create({
        data: {
          user_id: session.user.id,
          workspace_id: workspace.id,
          name: file.name,
          type: file.type || 'application/octet-stream',
          content: content.substring(0, 10000), // Store first 10KB
          status: 'PENDING',
        },
      });

      // Process document with AI (async, don't wait)
      processDocumentAsync(document.id, content).catch((error) =>
        console.error('Failed to process document:', error)
      );

      // Track usage
      await trackUsage(session.user.id, 'documents_processed');

      uploadedDocuments.push(document);
    }

    // Audit log
    await createAuditLog({
      user_id: session.user.id,
      action: 'documents.uploaded',
      entity_type: 'document',
      metadata: { count: files.length },
      ip_address: request.headers.get('x-forwarded-for') || undefined,
      user_agent: request.headers.get('user-agent') || undefined,
    });

    return NextResponse.json(
      {
        success: true,
        documents: uploadedDocuments,
        message: `${files.length} document(s) uploaded successfully`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error uploading documents:', error);
    return NextResponse.json(
      { error: 'Failed to upload documents' },
      { status: 500 }
    );
  }
}

async function processDocumentAsync(documentId: string, content: string) {
  try {
    // Update status to processing
    await prisma.document.update({
      where: { id: documentId },
      data: { status: 'PROCESSING' },
    });

    // Extract text and metadata
    const { text, metadata } = await extractTextFromDocument(
      content,
      'document'
    );

    // Categorize document
    const { category, confidence, tags } = await categorizeDocument(content);

    // Update document with processed data
    await prisma.document.update({
      where: { id: documentId },
      data: {
        processed_data: {
          extracted_text: text,
          metadata,
          category,
          confidence,
          tags,
        },
        status: 'COMPLETED',
      },
    });
  } catch (error) {
    console.error('Error processing document:', error);
    await prisma.document.update({
      where: { id: documentId },
      data: { status: 'FAILED' },
    });
  }
}


