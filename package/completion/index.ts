import * as vscode from 'vscode';

export interface RegisterCompletionOptions {
  file: string[];
  provider: vscode.CompletionItemProvider<vscode.CompletionItem>;
}

const getResolveCompletionItem = () => {
  return (item: vscode.CompletionItem) => {
    item.documentation = new vscode.MarkdownString(
      [
        'Keep states in the global scope to be reusable across Vue instances.',
        '```js',
        `import { ref } from 'vue';`,
        `import { createGlobalState } from '@vueuse/core`,
        `const useGlobalState = createGlobalState(() => {
            const count = ref(0);
            return { count };
          });`,
        '```'
      ].join('\n')
    );
    item.insertText = `createGlobalState(()=>{ return {} })`;
    return item;
  };
};
const getProvideCompletionItems = () => {
  return () => {
    const completionItems: vscode.CompletionItem[] = [];
    completionItems.push(
      new vscode.CompletionItem(
        `createGlobalState`,
        vscode.CompletionItemKind.Field
      )
    );
    return completionItems;
  };
};

export const completionOptions: RegisterCompletionOptions[] = [];

export const getCompletionOptions = (): RegisterCompletionOptions[] => {
  return [
    {
      file: ['vue', 'typescript', 'javascript'],
      provider: {
        provideCompletionItems: getProvideCompletionItems(),
        resolveCompletionItem: getResolveCompletionItem()
      }
    }
  ];
};
