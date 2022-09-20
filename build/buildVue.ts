import { resolve } from 'path';
import { writeFileSync } from 'fs';
import replace from '@rollup/plugin-replace';
import css from 'rollup-plugin-css-only';
import postcss from 'rollup-plugin-postcss';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { buildVueLib } from '@alqmc/build-vue';
import { enterPath, outputPath, rootPath } from './path';
import type { DefineVueConfig } from '@alqmc/build-vue';

const buildVueConfig: DefineVueConfig = {
  baseOptions: {
    input: resolve(enterPath, 'views/search-view/main.ts'),
    outPutPath: resolve(outputPath, 'views'),
    pkgPath: resolve(enterPath, 'package.json'),
    enterPath,
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
    mergeType: 'sufix',
    plugins: [
      vueJsx(),
      css({
        output(styles) {
          writeFileSync(resolve(outputPath, 'style/bundle.css'), styles);
        }
      }),
      postcss(),
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
