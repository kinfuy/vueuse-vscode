import { readdir } from 'fs/promises';
import { lstatSync } from 'fs';
export const readDirs = async (path: string) => {
  const dirs = await readdir(path);
  return dirs.filter((x) => lstatSync(`${path}/${x}`).isDirectory());
};
