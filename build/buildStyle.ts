import path from 'path';
import { dest, src } from 'gulp';
import cleanCss from 'gulp-clean-css';
import { log } from '@alqmc/build-utils';
import gulpLess from 'gulp-less';
import autoprefixer from 'gulp-autoprefixer';
import { enterPath, outputPath } from './path';
export const buildStyles = () => {
  return src([path.resolve(enterPath, 'style/*.less')])
    .pipe(gulpLess())
    .pipe(autoprefixer({ cascade: false }))
    .pipe(
      cleanCss({}, (d) => {
        console.log(
          `${log.info(d.name)}: ${log.warning(
            `${d.stats.originalSize / 1000}`
          )} KB -> ${log.success(`${d.stats.minifiedSize / 1000}`)} KB`
        );
      })
    )
    .pipe(dest(`${outputPath}/style`));
};
