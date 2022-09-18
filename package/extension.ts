import {
  registerCommands,
  registerWebviewViewProvider
} from './vscode/register';
import { SearchView } from './views/search-view';
import { commandOptions } from './command';
import type * as vscode from 'vscode';

export async function activate(context: vscode.ExtensionContext) {
  registerCommands(context, commandOptions);

  registerWebviewViewProvider(
    context,
    'docslibs',
    new SearchView(context, 'docslibs')
  );
}

export function deactivate() {}
