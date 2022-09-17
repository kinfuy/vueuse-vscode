import { WebViewProvider } from '../../vscode/webview';
import { getExtensionFileVscodeResource } from '../../vscode/common';
import type * as vscode from 'vscode';
export class SearchView extends WebViewProvider {
  constructor(ctx: vscode.ExtensionContext, viewType: string) {
    super(
      ctx.extensionUri,
      viewType,
      [getExtensionFileVscodeResource(ctx, 'style/search-view.css')],
      [getExtensionFileVscodeResource(ctx, 'views/search-view.js')]
    );
  }
}
