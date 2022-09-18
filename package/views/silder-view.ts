import { resolve } from 'path';
import * as vscode from 'vscode';
import { docsPath, rootPath } from '../config/path';
import { readDirs } from '../tools/utils';
import { getConfigJson } from '../tools/file';
import type { FunctionInfo } from '../tools/file';
export class SilderView implements vscode.TreeDataProvider<SilderViewItem> {
  private searchValue = '';
  constructor() {}

  getTreeItem(node: SilderViewItem): vscode.TreeItem {
    return node;
  }

  async getChildren(node?: SilderViewItem): Promise<SilderViewItem[]> {
    const functionFile = await readDirs(docsPath);
    return new Promise((resolve) => {
      if (node) {
        this.getFunction(functionFile).then((treeNode) => {
          if (this.searchValue) resolve(treeNode);
        });
      } else {
        let count = 0;
        const treeNode: SilderViewItem[] = [];
        if (functionFile.length === 0) {
          resolve(treeNode);
        } else {
          functionFile.forEach((x) => {
            this.getFunction([x])
              .then((node) => {
                if (node.length > 0) {
                  treeNode.push(node[0]);
                }
              })
              .finally(() => {
                count++;
                if (functionFile.length === count) {
                  resolve(treeNode);
                }
              });
          });
        }
      }
    });
  }

  private getFunction(functionFile: string[]): Promise<SilderViewItem[]> {
    return new Promise((resolve) => {
      const treeNode: SilderViewItem[] = [];
      let count = 0;
      functionFile.forEach(async (name) => {
        const snippets = await getConfigJson(`${docsPath}/${name}/index.json`);
        if (snippets) {
          treeNode.push(new SilderViewItem(snippets));
        }
        count++;
        if (count === functionFile.length) {
          resolve(treeNode.filter((x) => x.name.includes(this.searchValue)));
        }
      });
    });
  }

  search(msg: any) {
    this.searchValue = msg.searchValue;
    this.refresh();
  }

  private _onDidChangeTreeData: vscode.EventEmitter<
    SilderViewItem | undefined | null | void
  > = new vscode.EventEmitter<SilderViewItem | undefined | null | void>();

  readonly onDidChangeTreeData: vscode.Event<
    SilderViewItem | undefined | null | void
  > = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}

class SilderViewItem extends vscode.TreeItem {
  readonly category;
  readonly exportSize;
  readonly lastChnage;
  readonly related;
  readonly name;
  constructor(options: FunctionInfo) {
    super(options.name, options.collapsibleState);
    this.name = options.name;
    this.category = options.category;
    this.exportSize = options.exportSize;
    this.lastChnage = options.lastChnage;
    // this.description = options.description;
    this.related = options.related;
    const tooltip = [
      `### ${options.name}`,
      `${options.description}`,
      `${options.exportSize}`,
      `${options.lastChnage}`
    ];
    this.tooltip = new vscode.MarkdownString(tooltip.join('\n\n'), true);
    this.command = {
      title: '预览文档',
      command: 'VueUse.previewMd',
      arguments: [options]
    };
  }
  iconPath = {
    light: resolve(rootPath, `public/logo.svg`),
    dark: resolve(rootPath, `public/logo.svg`)
  };

  contextValue = 'dependency';
}
