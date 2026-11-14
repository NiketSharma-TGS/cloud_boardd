import sharp from 'sharp';
import { mkdir, copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// One-time optimization of generated artwork; originals are never modified.
const source = process.argv[2];
if (!source) throw new Error('Pass the generated-image library directory.');
const assets = [
  ['exec-2dbd2b91-64af-469d-bf03-35e5e50fcba4.png', 'sky', 1920, 82],
  ['exec-b4ba0ea1-1692-4927-8e8a-c00872761f8d.png', 'desk', 1000, 82],
  ['exec-0488ce2d-a429-458a-a2ed-ebb0e0a861e1.png', 'book', 1000, 82],
  ['exec-d6c58d5d-4423-44d5-b419-6539fd89dc8a.png', 'cloud', 700, 90],
];
await mkdir('public/images', { recursive: true });
await mkdir('design', { recursive: true });
for (const [filename, name, width, quality] of assets) {
  const output = `public/images/${name}.webp`;
  const info = await sharp(resolve(source, filename)).resize({ width, withoutEnlargement: true }).webp({ quality }).toFile(output);
  console.log(`${output}: ${Math.round(info.size / 1024)} KB`);
}
await copyFile(resolve(source, 'exec-b2be92de-f0b5-4137-bc21-67228358f287.png'), 'design/approved-homepage.png');
