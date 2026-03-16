import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";

export async function extractTextAndWordCount(filePath) {
  const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve(filePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error("File not found");
  }
  const dataBuffer = fs.readFileSync(absolutePath);
  const data = await pdfParse(dataBuffer);
  const text = (data.text || "").trim();
  const wordCount = text ? text.split(/\s+/).filter(Boolean).length : 0;
  return { text, wordCount, pages: data.numpages };
}
