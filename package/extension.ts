import {
  registerCommands,
  registerTreeDataProvider,
  registerWebviewViewProvider
} from './vscode/register';
import { SilderView } from './views/silder-view';
import { SearchView, searchViewHandleMap } from './views/search-view';
import { commandOptions } from './command';
import type * as vscode from 'vscode';

export async function activate(context: vscode.ExtensionContext) {
  registerCommands(context, commandOptions);
  const silderView = new SilderView();
  registerTreeDataProvider(context, [
    {
      viewID: 'docslibs',
      treeDataProvider: silderView
    }
  ]);
  registerWebviewViewProvider(
    context,
    'docssearch',
    new SearchView(context, searchViewHandleMap(silderView), 'docssearch')
  );
}

export function deactivate() {}
