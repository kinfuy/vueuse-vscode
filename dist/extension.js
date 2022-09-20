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
const registerWebviewViewProvider = (context, viewId, provider) => {
  context.subscriptions.push(
    vscode__namespace.window.registerWebviewViewProvider(viewId, provider)
  );
};

class WebViewProvider {
  viewType;
  _stylePath = [];
  _scriptPath = [];
  _ctx;
  view;
  constructor(context, options) {
    this.viewType = options.viewType;
    this._scriptPath = options.scriptPath;
    this._stylePath = options.stylePath;
    this._ctx = context;
  }
  resolveWebviewView(webviewView) {
    this.view = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._ctx.extensionUri]
    };
    webviewView.webview.html = this._getHtmlForWebview();
    this.init();
  }
  init() {
  }
  postMessage(type, data) {
    const msg = { type, data };
    this.view?.webview.postMessage(msg);
  }
  createVscodePath = (paths, type = "script") => {
    const vscodePath = paths.map((path) => {
      if (type === "script")
        return `<script defer  src="${path}"><\/script>`;
      if (type === "style")
        return `<link href="${path}" rel="stylesheet">`;
      return "";
    });
    return vscodePath;
  };
  _getHtmlForWebview() {
    const scriptCode = this.createVscodePath(this._scriptPath).join("\n");
    const stylePath = this.createVscodePath(this._stylePath, "style").join(
      "\n"
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

const getExtensionFileVscodeResource = (context, relativePath) => {
  const diskPath = vscode__namespace.Uri.file(path.join(context.extensionPath, relativePath));
  return diskPath.with({ scheme: "vscode-resource" }).toString();
};

const readDirs = async (path) => {
  const dirs = await promises.readdir(path);
  return dirs.filter((x) => fs.lstatSync(`${path}/${x}`).isDirectory());
};

const rootPath = path.resolve(__dirname);
const docsPath = path.resolve(rootPath, "docs");

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

class SearchView extends WebViewProvider {
  listFunctions = [];
  constructor(ctx, viewType) {
    super(ctx, {
      viewType,
      stylePath: [
        getExtensionFileVscodeResource(ctx, "style/search-view.css"),
        getExtensionFileVscodeResource(ctx, "style/bundle.css")
      ],
      scriptPath: [getExtensionFileVscodeResource(ctx, "views/search-view.js")]
    });
  }
  init() {
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
    const functionFile = await readDirs(docsPath);
    functionFile.forEach(async (file) => {
      const snippets = await getConfigJson(`${docsPath}/${file}/index.json`);
      snippets && this.listFunctions.push(snippets);
    });
  }
}
const searchViewHandleMap = (webview) => {
  return {
    init: () => {
      webview.postMessage("init", {
        functionList: webview.listFunctions
      });
    },
    clickFun: (item) => {
      vscode__namespace.commands.executeCommand("VueUse.previewMd", item.funcItem);
    }
  };
};
class MessageServer {
  constructor(webview, subscriptions, handlerMap) {
    webview.webview.onDidReceiveMessage(
      async ({ name, data }) => {
        const handle = handlerMap[name];
        if (handle)
          await handle(data);
      },
      void 0,
      subscriptions
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
  registerWebviewViewProvider(
    context,
    "docslibs",
    new SearchView(context, "docslibs")
  );
}
function deactivate() {
}

exports.activate = activate;
exports.deactivate = deactivate;
