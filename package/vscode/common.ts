import { join } from 'path';
import * as vscode from 'vscode';

export const getExtensionFileVscodeResource = (
  context: vscode.ExtensionContext,
  relativePath: string
) => {
  const diskPath = vscode.Uri.file(join(context.extensionPath, relativePath));
  return diskPath.with({ scheme: 'vscode-resource' }).toString();
};
