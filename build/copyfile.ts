import { resolve } from 'path';
import { copy, copyFile } from '@alqmc/build-utils';
import { enterPath, outputPath } from './path';
export const copyFiles = async () => {
  Promise.all([
    copyFile(
      resolve(enterPath, 'package.json'),
      resolve(outputPath, 'package.json')
    ),
    copy(resolve(enterPath, 'public'), resolve(outputPath, 'public'))
    // copyFile(resolve(rootPath, 'README.md'), resolve(outputPath, 'README.md')),
  ]);
};
