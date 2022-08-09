import { Meteor } from 'meteor/meteor';
import { LiveModulesConfig } from './config';
import { LiveModulesCollection } from './shared';
import { LiveModules } from './liveModules';
import { log } from './logger';
import type { DBLiveModule } from './types';

export { LiveModules, LiveModulesCollection, LiveModulesConfig };

//send only enabled modules
Meteor.publish(LiveModulesConfig.subName, function() {
  return LiveModulesCollection.find({ enabled: true });
});

Meteor.startup(() => {
  log(`initialized, modules:`,
    Object.keys(LiveModules.getModulesWithTagsOrNames([])).join(','),
  );
});

export class LiveModulesService {
  async addModule(module: Omit<DBLiveModule, '_id' | 'v'>) {
    const moduleId = LiveModulesCollection.insert({ ...module, v: 0 });

    return moduleId;
  }

  async removeAllModules() {
    LiveModulesCollection.remove({});
  }

  async removeModuleById(moduleId: string) {
    LiveModulesCollection.remove({ _id: moduleId });
  }

  async enableModule(moduleId: string) {
    LiveModulesCollection.update({ _id: moduleId }, { $set: { enabled: true } });
  }

  async disableModule(moduleId: string) {
    LiveModulesCollection.update({ _id: moduleId }, { $set: { enabled: false } });
  }

  async enableRequired(moduleId: string) {
    LiveModulesCollection.update({ _id: moduleId }, { $set: { required: true } });
  }

  async disableRequired(moduleId: string) {
    LiveModulesCollection.update({ _id: moduleId }, { $set: { required: false } });
  }

  async updateUrl(moduleId: string, newUrl: DBLiveModule['url']) {
    LiveModulesCollection.update({ _id: moduleId }, { $set: { url: newUrl }, $inc: { v: 1 } });
  }

  async updateSource(moduleId: string, newSource: DBLiveModule['source']) {
    LiveModulesCollection.update({ _id: moduleId }, { $set: { source: newSource }, $inc: { v: 1 } });
  }

  async updateName(moduleId: string, newName: DBLiveModule['name']) {
    LiveModulesCollection.update({ _id: moduleId }, { $set: { name: newName } });
  }

  async updateTags(moduleId: string, newTags: Required<DBLiveModule['tags']>) {
    LiveModulesCollection.update({ _id: moduleId }, { $set: { tags: newTags } });
  }

  async increaseVersion(moduleId: string) {
    LiveModulesCollection.update({ _id: moduleId }, { $inc: { v: 1 } });
  }
}

export const LiveModulesServiceDefault = new LiveModulesService();
