import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file: File | null = formData.get("image") as unknown as File;

  if (!file) {
    return NextResponse.json({ error: "画像がありません" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${uuidv4()}-${file.name}`;
  const filepath = path.join(process.cwd(), 'public', 'uploads', filename);

  await writeFile(filepath, buffer);
  const imageUrl = `/uploads/${filename}`;

  return NextResponse.json({ imageUrl });
}
