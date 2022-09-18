import path from 'path';
import { dest, src } from 'gulp';
import cleanCss from 'gulp-clean-css';
import gulpLess from 'gulp-less';
import autoprefixer from 'gulp-autoprefixer';
import { enterPath, outputPath } from './path';
export const buildStyles = () => {
  return src([path.resolve(enterPath, 'style/*.less')])
    .pipe(gulpLess())
    .pipe(autoprefixer({ cascade: false }))
    .pipe(cleanCss())
    .pipe(dest(`${outputPath}/style`));
};
