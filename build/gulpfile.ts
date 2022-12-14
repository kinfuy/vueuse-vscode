import { resolve } from 'path';
import { run, withTask } from '@alqmc/build-utils';
import { series, task, watch } from 'gulp';
import { vscodeBuild } from './build';
import { rootPath } from './path';
import { copyFiles } from './copyfile';
import { buildVue } from './buildVue';
import { buildStyles } from './buildStyle';

task('watchVscode', () => {});

export const vscode = series(
  withTask('clear', () => run('pnpm run clear')),
  // withTask('update:version', () => run('pnpm run update:version')),
  withTask('vscode-build', vscodeBuild),
  withTask('style', buildStyles),
  withTask('vue', buildVue),
  withTask('vscode-copy', copyFiles)
);
export const vscodeExtension = withTask('vscode-watch', () => {
  watch(resolve(rootPath, 'package'), vscode);
});

export const watchVscode = series(vscodeExtension);
