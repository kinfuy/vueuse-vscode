'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vscode = require('vscode');
var path = require('path');
var promises = require('fs/promises');
var fs = require('fs');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var vscode__namespace = /*#__PURE__*/_interopNamespace(vscode);

const registerCommands = (context, registerOptions) => {
  const commands = [];
  registerOptions.forEach((command) => {
    const item = vscode__namespace.commands.registerCommand(command.name, command.handler);
    commands.push(item);
  });
  context.subscriptions.push(...commands);
  return commands;
};
const registerTreeDataProvider = (context, registerOptions) => {
  const treeDataProvider = registerOptions.map((x) => {
    return vscode__namespace.window.registerTreeDataProvider(x.viewID, x.treeDataProvider);
  });
  context.subscriptions.push(...treeDataProvider);
};
const registerWebviewViewProvider = (context, viewId, provider) => {
  context.subscriptions.push(
    vscode__namespace.window.registerWebviewViewProvider(viewId, provider)
  );
};

const rootPath = path.resolve(__dirname);
const docsPath = path.resolve(rootPath, "docs");

const readDirs = async (path) => {
  const dirs = await promises.readdir(path);
  return dirs.filter((x) => fs.lstatSync(`${path}/${x}`).isDirectory());
};

const errorTip = (message, btn) => {
  if (btn)
    return vscode__namespace.window.showErrorMessage(message, btn);
  else
    return vscode__namespace.window.showErrorMessage(message);
};

const getConfigJson = async (rootPath) => {
  try {
    const fileBuffer = await promises.readFile(rootPath, "utf-8");
    const snipptesList = fileBuffer ? JSON.parse(fileBuffer.toString()) : null;
    return snipptesList;
  } catch (error) {
    errorTip(error);
  }
};

class SilderView {
  constructor() {
  }
  getTreeItem(node) {
    return node;
  }
  async getChildren(node) {
    const functionFile = await readDirs(docsPath);
    return new Promise((resolve2) => {
      if (node) {
        this.getFunction(functionFile).then((treeNode) => {
          resolve2(treeNode);
        });
      } else {
        let count = 0;
        const treeNode = [];
        if (functionFile.length === 0) {
          resolve2(treeNode);
        } else {
          functionFile.forEach((x) => {
            this.getFunction([x]).then((node2) => {
              if (node2.length > 0) {
                treeNode.push(node2[0]);
              }
            }).finally(() => {
              count++;
              if (functionFile.length === count) {
                resolve2(treeNode);
              }
            });
          });
        }
      }
    });
  }
  getFunction(functionFile) {
    return new Promise((resolve2) => {
      const treeNode = [];
      let count = 0;
      functionFile.forEach(async (name) => {
        const snippets = await getConfigJson(`${docsPath}/${name}/index.json`);
        if (snippets) {
          treeNode.push(new SilderViewItem(snippets));
        }
        count++;
        if (count === functionFile.length) {
          resolve2(treeNode);
        }
      });
    });
  }
  _onDidChangeTreeData = new vscode__namespace.EventEmitter();
  onDidChangeTreeData = this._onDidChangeTreeData.event;
  refresh() {
    this._onDidChangeTreeData.fire();
  }
}
class SilderViewItem extends vscode__namespace.TreeItem {
  category;
  exportSize;
  lastChnage;
  related;
  constructor(options) {
    super(options.name, options.collapsibleState);
    this.category = options.category;
    this.exportSize = options.exportSize;
    this.lastChnage = options.lastChnage;
    this.related = options.related;
    const tooltip = [
      `### ${options.name}`,
      `${options.description}`,
      `${options.exportSize}`,
      `${options.lastChnage}`
    ];
    this.tooltip = new vscode__namespace.MarkdownString(tooltip.join("\n\n"), true);
    this.command = {
      title: "\u9884\u89C8\u6587\u6863",
      command: "VueUse.previewMd",
      arguments: [options]
    };
  }
  iconPath = {
    light: path.resolve(rootPath, `public/logo.svg`),
    dark: path.resolve(rootPath, `public/logo.svg`)
  };
  contextValue = "dependency";
}

class WebViewProvider {
  viewType;
  _stylePath = [];
  _scriptPath = [];
  extensionUri;
  _view;
  constructor(extensionUri, viewType, stylePath = [], scriptPath = []) {
    this.extensionUri = extensionUri;
    this.viewType = viewType;
    this._scriptPath = scriptPath;
    this._stylePath = stylePath;
  }
  resolveWebviewView(webviewView) {
    this._view = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri]
    };
    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
  }
  createVscodePath = (paths, nonce, type = "script") => {
    const vscodePath = paths.map((path) => {
      if (type === "script")
        return `<script nonce="${nonce}"  src="${path}"><\/script>`;
      if (type === "style")
        return `<link href="${path}" rel="stylesheet">`;
      return [];
    });
    return vscodePath;
  };
  _getHtmlForWebview(webview) {
    const nonce = getNonce();
    const scriptCode = this.createVscodePath(this._scriptPath, nonce).join(
      "/n"
    );
    const stylePath = this.createVscodePath(
      this._stylePath,
      nonce,
      "style"
    ).join("/n");
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
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

const getExtensionFileVscodeResource = (context, relativePath) => {
  const diskPath = vscode__namespace.Uri.file(path.join(context.extensionPath, relativePath));
  return diskPath.with({ scheme: "vscode-resource" }).toString();
};

class SearchView extends WebViewProvider {
  constructor(ctx, viewType) {
    super(
      ctx.extensionUri,
      viewType,
      [getExtensionFileVscodeResource(ctx, "style/search-view.css")],
      [getExtensionFileVscodeResource(ctx, "views/search-view.js")]
    );
  }
}

const previewMdFile = async (options) => {
  const path$1 = vscode__namespace.Uri.file(path.resolve(docsPath, `${options.name}/index.md`));
  await vscode__namespace.commands.executeCommand("markdown.showPreviewToSide", path$1);
};

const commandOptions = [
  {
    name: "VueUse.previewMd",
    handler: previewMdFile
  }
];

async function activate(context) {
  registerCommands(context, commandOptions);
  registerTreeDataProvider(context, [
    {
      viewID: "docslibs",
      treeDataProvider: new SilderView()
    }
  ]);
  registerWebviewViewProvider(
    context,
    "docssearch",
    new SearchView(context, "docssearch")
  );
}
function deactivate() {
}

exports.activate = activate;
exports.deactivate = deactivate;
