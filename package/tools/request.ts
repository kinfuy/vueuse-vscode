import { mkdir, writeFile } from 'fs/promises';
import { resolve } from 'path';
import fetch from 'node-fetch';
import { docsPath } from '../config/path';
import { errorTip } from '../vscode/tips';

// https://raw.githubusercontent.com/vueuse/vueuse/main/packages/export-size.json
export const fetchFile = async (path: string) => {
  try {
    const data = await fetch(path);
    const text = await data.text();
    await mkdir(resolve(docsPath, 'createUnrefFn')).catch(() => {});
    writeFile(resolve(docsPath, '/createUnrefFn/index.md'), text);
  } catch (error) {
    errorTip('网络请求失败！');
  }
};
