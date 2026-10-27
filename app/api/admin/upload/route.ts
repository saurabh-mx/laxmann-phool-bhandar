import { NextResponse } from 'next/server';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { getSupabaseServerClient, isSupabaseConfigured } from '@/lib/supabase-services';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate mime type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files (JPEG, PNG, WebP, AVIF, SVG) are accepted.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name) || '.jpg';
    const baseName = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    const safeFilename = `${Date.now()}-${baseName}${ext}`;

    // PRIORITY 1: Upload to Supabase Storage bucket 'photos' if Supabase is connected
    if (isSupabaseConfigured()) {
      try {
        const client = getSupabaseServerClient();
        if (client) {
          const bucketName = 'photos';

          // Attempt upload
          let { error: uploadError } = await client.storage
            .from(bucketName)
            .upload(safeFilename, buffer, {
              contentType: file.type || 'image/jpeg',
              upsert: true,
            });

          // If bucket does not exist, try creating it and re-uploading
          if (uploadError && uploadError.message?.toLowerCase().includes('bucket not found')) {
            try {
              await client.storage.createBucket(bucketName, {
                public: true,
                fileSizeLimit: 10485760, // 10MB
              });
              const retry = await client.storage
                .from(bucketName)
                .upload(safeFilename, buffer, {
                  contentType: file.type || 'image/jpeg',
                  upsert: true,
                });
              uploadError = retry.error;
            } catch {
              // Ignore bucket creation error
            }
          }

          if (!uploadError) {
            const { data: publicUrlData } = client.storage
              .from(bucketName)
              .getPublicUrl(safeFilename);

            if (publicUrlData?.publicUrl) {
              return NextResponse.json({
                success: true,
                url: publicUrlData.publicUrl,
                filename: safeFilename,
                storage: 'supabase',
                size: file.size,
              });
            }
          } else {
            console.warn('Supabase storage upload failed, using fallback:', uploadError.message);
          }
        }
      } catch (sbStorageErr) {
        console.warn('Supabase storage error, using fallback:', sbStorageErr);
      }
    }

    // PRIORITY 2: Local filesystem upload (works in development)
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const destination = path.join(uploadsDir, safeFilename);
      fs.writeFileSync(destination, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/${safeFilename}`,
        filename: safeFilename,
        storage: 'local',
        size: file.size,
      });
    } catch (fsErr) {
      console.warn('Filesystem is read-only (e.g. Vercel serverless). Using base64 Data URL fallback:', fsErr);
    }

    // PRIORITY 3: High-reliability base64 Data URL (guaranteed to work in serverless/Vercel without storage setup)
    const mimeType = file.type || 'image/jpeg';
    const base64Data = buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64Data}`;

    return NextResponse.json({
      success: true,
      url: dataUrl,
      filename: safeFilename,
      storage: 'inline',
      size: file.size,
    });
  } catch (err: any) {
    console.error('File upload error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to upload image. Please try again.' },
      { status: 500 }
    );
  }
}
