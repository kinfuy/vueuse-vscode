import { resolve } from 'path';
import { fetchFile } from '../tools/request';
import { getConfigJson } from '../tools/file';
import { docsPath } from '../config/path';
import { getDocsUrl } from '../config/vueuse';
export const updateDocs = async () => {
  const config = await getConfigJson(resolve(`${docsPath}/config.json`));
  if (!config) return;
  for (let i = 0; i < config.dirs.length; i++) {
    for (let j = 0; j < config.dirs[i].functions.length; j++) {
      const url = getDocsUrl(
        config.dirs[i].name,
        `${config.dirs[i].functions[j].name}/index.md`
      );
      console.log(`download: ${url}`);
      await fetchFile(url, config.dirs[i].functions[j].name);
    }
  }
};
