/**
 * function dir
 */
export const docsDir = [
  'core',
  'electron',
  'firebase',
  'integrations',
  'router',
  'rxjs',
  'shared'
];

/**
 * vueuse 文档地址
 * @param dir 目录  package
 * @param file  文件
 * @returns
 */
export const getDocsUrl = (dir: string, file: string) => {
  return `https://raw.githubusercontent.com/vueuse/vueuse/main/packages/${dir}/${file}`;
};
