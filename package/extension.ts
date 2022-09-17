import {
  registerCommands,
  registerTreeDataProvider,
  registerWebviewViewProvider
} from './vscode/register';
import { SilderView } from './views/silder-view';
import { SearchView } from './views/search-view';
import { commandOptions } from './command';
import type * as vscode from 'vscode';

export async function activate(context: vscode.ExtensionContext) {
  registerCommands(context, commandOptions);
  registerTreeDataProvider(context, [
    {
      viewID: 'docslibs',
      treeDataProvider: new SilderView()
    }
  ]);
  registerWebviewViewProvider(
    context,
    'docssearch',
    new SearchView(context, 'docssearch')
  );
}

export function deactivate() {}
