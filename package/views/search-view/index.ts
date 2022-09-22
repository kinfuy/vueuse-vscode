import * as vscode from 'vscode';
import { WebViewProvider } from '../../vscode/webview';
import { getExtensionFileVscodeResource } from '../../vscode/common';
import { readDirs } from '../../tools/utils';
import { getDocsUrl } from '../../config/vueuse';
import { fetchJson } from '../../tools/request';

import { docsPath } from '../../config/path';
import { getConfigJson } from '../../tools/file';
import type { HandleMap } from '../../vscode/webview';
import type { FunctionInfo } from '../../tools/file';

export class SearchView extends WebViewProvider {
  listFunctions: FunctionInfo[] = [];
  constructor(ctx: vscode.ExtensionContext, viewType: string) {
    super(ctx, {
      viewType,
      stylePath: [
        getExtensionFileVscodeResource(ctx, 'style/search-view.css'),
        getExtensionFileVscodeResource(ctx, 'style/bundle.css')
      ],
      scriptPath: [getExtensionFileVscodeResource(ctx, 'views/search-view.js')]
    });
  }
  init(): void {
    if (this.view)
      new MessageServer(
        this.view,
        this._ctx.subscriptions,
        searchViewHandleMap(this)
      );
    this.getFunctions();
  }
  async getFunctions() {
    this.listFunctions = [];
    const path = getDocsUrl('core', 'createUnrefFn');
    await fetchJson(`${path}/index.md`);
    const functionFile = await readDirs(docsPath);
    functionFile.forEach(async (file) => {
      const snippets = await getConfigJson(`${docsPath}/${file}/index.json`);
      snippets && this.listFunctions.push(snippets);
    });
  }
}

export const searchViewHandleMap = (webview: SearchView): HandleMap => {
  return {
    init: () => {
      webview.postMessage('init', {
        functionList: webview.listFunctions
      });
    },
    clickFun: (item) => {
      vscode.commands.executeCommand('VueUse.previewMd', item.funcItem);
    }
  };
};

class MessageServer {
  constructor(
    webview: vscode.WebviewView,
    subscriptions: any,
    handlerMap: HandleMap
  ) {
    webview.webview.onDidReceiveMessage(
      async ({ name, data }) => {
        const handle = handlerMap[name];
        if (handle) await handle(data);
      },
      undefined,
      subscriptions
    );
  }
}
