import fetch from 'node-fetch';
import { errorTip } from '../vscode/tips';

// https://raw.githubusercontent.com/vueuse/vueuse/main/packages/export-size.json
export const fetchJson = async (path: string) => {
  try {
    const data = await fetch(path);
    const json = await data.text();
  } catch (error) {
    errorTip('网络请求失败！');
  }
};
