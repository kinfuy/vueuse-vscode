import type * as vscode from 'vscode';

export type HandleMap = Record<string, (data: any) => any>;

export class WebViewProvider implements vscode.WebviewViewProvider {
  viewType: string;

  private _stylePath: string[] = [];
  private _scriptPath: string[] = [];

  _ctx: vscode.ExtensionContext;

  view?: vscode.WebviewView;

  constructor(
    context: vscode.ExtensionContext,
    options: {
      viewType: string;
      stylePath: string[];
      scriptPath: string[];
    }
  ) {
    this.viewType = options.viewType;
    this._scriptPath = options.scriptPath;
    this._stylePath = options.stylePath;
    this._ctx = context;
  }

  //  `resolveWebviewView` is called when a view first becomes visible. This may happen when the view is
  //  first loaded or when the user hides and then shows a view again.
  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this.view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._ctx.extensionUri]
    };
    webviewView.webview.html = this._getHtmlForWebview();
    this.init();
  }

  init() {}

  postMessage(type: any, data: any) {
    const msg = { type, data };
    this.view?.webview.postMessage(msg);
  }

  private createVscodePath = (
    paths: string[],
    type: 'script' | 'style' = 'script'
  ) => {
    const vscodePath = paths.map((path) => {
      if (type === 'script') return `<script defer  src="${path}"></script>`;
      if (type === 'style') return `<link href="${path}" rel="stylesheet">`;
      return '';
    });
    return vscodePath;
  };

  private _getHtmlForWebview() {
    const scriptCode = this.createVscodePath(this._scriptPath).join('\n');
    const stylePath = this.createVscodePath(this._stylePath, 'style').join(
      '\n'
    );

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				${stylePath}

        ${scriptCode}
				<title>webview</title>
			</head>
			<body>
          <div id='app'></div>
			</body>
			</html>`;
  }
}
