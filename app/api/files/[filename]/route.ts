import { getFileFromR2 } from '@/lib/actions';
import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session) {
      return new NextResponse('Unauthorized - Please log in', { 
        status: 401,
        headers: {
          'WWW-Authenticate': 'Bearer'
        }
      });
    }

    const { filename } = await params;
    
    if (!filename) {
      return new NextResponse('Filename is required', { status: 400 });
    }

    const { buffer, contentType } = await getFileFromR2(filename);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'private, max-age=3600', // Changed to private since authenticated
        'Content-Length': buffer.length.toString(),
        'Accept-Ranges': 'bytes',
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    
    // Don't reveal too much info in error messages for security
    if (error instanceof Error && error.message.includes('not found')) {
      return new NextResponse('File not found', { status: 404 });
    }
    
    return new NextResponse('Internal server error', { status: 500 });
  }
}
