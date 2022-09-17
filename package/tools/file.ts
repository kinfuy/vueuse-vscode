import { readFile, writeFile } from 'fs/promises';
import { errorTip } from '../vscode/tips';
import type * as vscode from 'vscode';

export interface FunctionInfo {
  name: string;
  collapsibleState?: vscode.TreeItemCollapsibleState;
  category?: string;
  exportSize?: string;
  lastChnage?: string;
  related?: boolean;
  description?: string;
}
export const getConfigJson = async (rootPath: string) => {
  try {
    const fileBuffer = await readFile(rootPath, 'utf-8');
    const snipptesList = fileBuffer
      ? (JSON.parse(fileBuffer.toString()) as FunctionInfo)
      : null;
    return snipptesList;
  } catch (error) {
    errorTip(error as string);
  }
};

export const writeSnipptes = (dir: string, data: FunctionInfo) => {
  writeFile(dir, JSON.stringify(data, null, 4)).catch((error) => {
    errorTip(error as string);
  });
};
