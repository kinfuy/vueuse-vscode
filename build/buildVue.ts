import { resolve } from 'path';
import replace from '@rollup/plugin-replace';
import { buildVueLib } from '@alqmc/build-vue';
import { enterPath, outputPath, rootPath } from './path';
import type { DefineVueConfig } from '@alqmc/build-vue';

const buildVueConfig: DefineVueConfig = {
  baseOptions: {
    input: resolve(enterPath, 'views/search-view/main.ts'),
    outPutPath: resolve(outputPath, 'views'),
    pkgPath: resolve(rootPath, 'package.json'),
    enterPath: resolve(enterPath, 'popup'),
    tsConfigPath: resolve(rootPath, 'tsconfig.json'),
    preserveModules: false,
    extraOptions: {
      // 会重写输出配置
      dir: undefined,
      format: 'iife',
      file: resolve(outputPath, 'views/search-view.js')
    }
  },
  pluginOptions: {
    mergeType: 'prefix',
    plugins: [
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production'),
        'process.env.BASE_URL': JSON.stringify('/')
      })
    ]
  },
  includePackages: ['vue'],
  buildProduct: ['es'],
  pureOutput: true
};

export const buildVue = async () => {
  await buildVueLib(buildVueConfig);
};
