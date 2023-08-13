import { writeFile } from 'fs/promises';

export async function saveToOutput(filename: string, data: unknown) {
  await writeFile(filename, data as any);
}
