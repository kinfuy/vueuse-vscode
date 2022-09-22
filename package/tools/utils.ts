import { readdir } from 'fs/promises';
import { lstatSync } from 'fs';
/**
 * 返回路径下的目录
 * @param path
 * @returns
 */
export const readDirs = async (path: string) => {
  const dirs = await readdir(path);
  return dirs.filter((x) => lstatSync(`${path}/${x}`).isDirectory());
};
