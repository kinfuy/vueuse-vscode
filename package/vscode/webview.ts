import type * as vscode from 'vscode';

export class WebViewProvider implements vscode.WebviewViewProvider {
  viewType: string;

  private _stylePath: string[] = [];
  private _scriptPath: string[] = [];
  private extensionUri: vscode.Uri;

  private _view?: vscode.WebviewView;

  constructor(
    extensionUri: vscode.Uri,
    viewType: string,
    stylePath: string[] = [],
    scriptPath: string[] = []
  ) {
    this.extensionUri = extensionUri;
    this.viewType = viewType;
    this._scriptPath = scriptPath;
    this._stylePath = stylePath;
  }

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri]
    };
    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
  }

  private createVscodePath = (
    paths: string[],
    nonce: string,
    type: 'script' | 'style' = 'script'
  ) => {
    const vscodePath = paths.map((path) => {
      if (type === 'script')
        return `<script nonce="${nonce}"  src="${path}"></script>`;
      if (type === 'style') return `<link href="${path}" rel="stylesheet">`;
      return [];
    });
    return vscodePath;
  };

  private _getHtmlForWebview(webview: vscode.Webview) {
    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    const scriptCode = this.createVscodePath(this._scriptPath, nonce).join(
      '/n'
    );

    const stylePath = this.createVscodePath(
      this._stylePath,
      nonce,
      'style'
    ).join('/n');

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
				-->
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				${stylePath}
				
				<title>webview</title>
			</head>
			<body>
                <div id='app'></div>
                ${scriptCode}
			</body>
			</html>`;
  }
}
function getNonce() {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
