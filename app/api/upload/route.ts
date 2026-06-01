import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file || typeof file.arrayBuffer !== "function") {
      return NextResponse.json({ error: "No file uploaded or invalid file format" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    try {
      // Ensure upload directory exists
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Generate unique file name
      const fileExtension = path.extname(file.name) || ".png";
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${fileExtension}`;
      const filePath = path.join(uploadDir, fileName);

      // Save file locally
      await fs.promises.writeFile(filePath, buffer);
      const fileUrl = `/uploads/${fileName}`;

      return NextResponse.json({ success: true, url: fileUrl });
    } catch (fsError) {
      console.warn("Local filesystem write failed (expected on serverless platforms like Netlify). Falling back to Base64 data URL encoding:", fsError);
      
      const fileType = file.type || "image/png";
      const base64String = buffer.toString("base64");
      const fileUrl = `data:${fileType};base64,${base64String}`;
      
      return NextResponse.json({ success: true, url: fileUrl });
    }
  } catch (error: any) {
    console.error("File Upload Error:", error);
    return NextResponse.json({ error: `File upload failed: ${error.message || "Unknown error"}` }, { status: 500 });
  }
}
