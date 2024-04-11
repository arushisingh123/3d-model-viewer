import formidable from 'formidable-serverless';
import fs from 'fs';
import path from 'path';

const uploadDir = path.join(process.cwd(), 'public/uploads');
const tempDir = path.join(process.cwd(), 'public/temp');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

export const config = {
  api: {
    bodyParser: false,
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const form = new formidable.IncomingForm({
    uploadDir: tempDir,
    keepExtensions: true,
    maxFileSize: 20 * 1024 * 1024, // 20 MB
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Formidable Error:", err);
      return res.status(500).json({ error: err.message });
    }

    const file = files.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = file.path;
    const newFilename = `${Date.now()}-${file.name}`;
    const tempFilePath = path.join(tempDir, newFilename);

    try {
      if (path.extname(file.name).toLowerCase() === '.gltf') {
        const data = fs.readFileSync(filePath, 'utf-8');
        const processedData = processGLTF(JSON.parse(data));
        fs.writeFileSync(tempFilePath, JSON.stringify(processedData), 'utf-8');
      } else if (path.extname(file.name).toLowerCase() === '.obj') {
        fs.renameSync(filePath, tempFilePath); 
      } else {
        fs.unlinkSync(filePath); 
        return res.status(400).json({ error: "Unsupported file type" });
      }

      res.status(200).json({
        message: "File uploaded and processed successfully",
        path: `/temp/${newFilename}`
      });
    } catch (error) {
      console.error("File Processing Error:", error);
      res.status(500).json({ error: "Failed to process file" });
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath); 
      }
    }
  });
}

function processGLTF(data) {
  return data;
}