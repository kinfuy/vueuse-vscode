import { WebViewProvider } from '../../vscode/webview';
import { getExtensionFileVscodeResource } from '../../vscode/common';
import type { SilderView } from '../silder-view';
import type * as vscode from 'vscode';
import type { HandleMap } from '../../vscode/webview';

export class SearchView extends WebViewProvider {
  constructor(
    ctx: vscode.ExtensionContext,
    handleMap: HandleMap,
    viewType: string
  ) {
    super(ctx, handleMap, {
      viewType,
      stylePath: [getExtensionFileVscodeResource(ctx, 'style/search-view.css')],
      scriptPath: [getExtensionFileVscodeResource(ctx, 'views/search-view.js')]
    });
  }
}

export const searchViewHandleMap = (silderView?: SilderView): HandleMap => {
  return {
    search: async (msg) => {
      silderView?.search(msg);
    }
  };
};
