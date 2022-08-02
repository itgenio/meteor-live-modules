import { LiveModulesCollection } from './shared';

export function getModulesByNameOrTag(tagOrName: string) {
  return LiveModulesCollection.find({ $or: [{ name: tagOrName }, { tags: tagOrName }] }).fetch();
}
