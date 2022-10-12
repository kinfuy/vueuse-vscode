import { resolve } from 'path';
import * as vscode from 'vscode';
import { docsPath } from '../config/path';
import type { FunctionInfo } from '../tools/file';

export const previewMdFile = async (options: FunctionInfo) => {
  const path = vscode.Uri.file(resolve(docsPath, `${options.name}/index.md`));
  await vscode.commands.executeCommand('markdown.showPreview', path);
};
