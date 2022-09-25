import { previewMdFile } from './preview';
import { updateDocs } from './updateDocs';
export const commandOptions = [
  {
    name: 'VueUse.previewMd',
    handler: previewMdFile
  },
  {
    name: 'VueUse.refreshEntry',
    handler: updateDocs
  }
];
