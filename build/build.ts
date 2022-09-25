import { resolve } from 'path';
import { buildTypescriptLib } from '@alqmc/build-ts';
import { enterPath, rootPath } from './path';
import type { DefineTsConfig } from '@alqmc/build-ts';

const buildConfig: DefineTsConfig = {
  baseOptions: {
    input: resolve(enterPath, 'extension.ts'),
    enterPath,
    outPutPath: resolve(rootPath, 'dist'),
    tsConfigPath: resolve(rootPath, 'tsconfig.json'),
    pkgPath: resolve(rootPath, 'package.json'),
    preserveModules: false
  },
  externalOptions: ['vscode'],
  buildProduct: ['lib'],
  pureOutput: true
};

export const vscodeBuild = async () => {
  return buildTypescriptLib(buildConfig);
};
