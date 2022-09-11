import * as vscode from 'vscode';

export async function activate() {
  vscode.window.showInformationMessage('hi,VueUse');
}

export function deactivate() {
  console.log('bye,VueUse');
}
