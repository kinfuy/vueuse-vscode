import * as vscode from 'vscode';
export const infoTip = (message: string, btn?: string) => {
  if (btn) return vscode.window.showInformationMessage(message, btn);
  else return vscode.window.showInformationMessage(message);
};
export const worringTip = (message: string) => {
  return vscode.window.showWarningMessage(message);
};
export const errorTip = (message: string, btn?: string) => {
  if (btn) return vscode.window.showErrorMessage(message, btn);
  else return vscode.window.showErrorMessage(message);
};
