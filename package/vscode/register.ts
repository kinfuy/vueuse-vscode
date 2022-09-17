import * as vscode from 'vscode';

export interface RegisterCommandsOptions {
  name: string;
  handler: (...args: any[]) => any;
}
export interface RegisterHoverProviderOptions {
  file: Array<string>;
  handler: vscode.HoverProvider;
}

export interface RegisterCompletionOptions {
  file: string[];
  provider: vscode.CompletionItemProvider<vscode.CompletionItem>;
}
export interface RegisterTreeDataOptions {
  viewID: string;
  treeDataProvider: vscode.TreeDataProvider<unknown>;
}

/**
 * 注册命令
 * @param registerOptions
 * @returns
 */
export const registerCommands = (
  context: vscode.ExtensionContext,
  registerOptions: RegisterCommandsOptions[]
) => {
  const commands: Array<vscode.Disposable> = [];
  registerOptions.forEach((command) => {
    const item = vscode.commands.registerCommand(command.name, command.handler);
    commands.push(item);
  });
  context.subscriptions.push(...commands);
  return commands;
};

/**
 * 注册HoverProvider
 * @param registerOptions
 * @returns
 */
export const registerHoverProvider = (
  context: vscode.ExtensionContext,
  registerOptions: RegisterHoverProviderOptions[]
) => {
  const hoverProviders: Array<vscode.Disposable> = [];
  registerOptions.forEach((command) => {
    const item = vscode.languages.registerHoverProvider(
      command.file,
      command.handler
    );
    hoverProviders.push(item);
  });
  context.subscriptions.push(...hoverProviders);
  return hoverProviders;
};
/**
 * 注册自动补全
 * @param context
 * @param registerOptions
 */
export const registerCompletionItemProvider = (
  context: vscode.ExtensionContext,
  registerOptions: RegisterCompletionOptions[]
) => {
  const completionProvider = registerOptions.map((x) => {
    return vscode.languages.registerCompletionItemProvider(x.file, x.provider);
  });
  context.subscriptions.push(...completionProvider);
};

/**
 * 注册侧边菜单视图
 * @param context
 * @param registerOptions
 */
export const registerTreeDataProvider = (
  context: vscode.ExtensionContext,
  registerOptions: RegisterTreeDataOptions[]
) => {
  const treeDataProvider = registerOptions.map((x) => {
    return vscode.window.registerTreeDataProvider(x.viewID, x.treeDataProvider);
  });
  context.subscriptions.push(...treeDataProvider);
};

/**
 * 注册自定义视图
 * @param context
 * @param viewId
 * @param provider
 */

export const registerWebviewViewProvider = (
  context: vscode.ExtensionContext,
  viewId: string,
  provider: vscode.WebviewViewProvider
) => {
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(viewId, provider)
  );
};
