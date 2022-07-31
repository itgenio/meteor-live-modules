import { Meteor } from 'meteor/meteor';
import type { ILiveModulesConfig } from './types';

const settings = Meteor.settings?.public?.liveModules ?? {};

export const LiveModulesConfig: ILiveModulesConfig = {
  logging: settings.logging != null ? !!settings.logging : Meteor.isDevelopment,
  collName: settings.collName ?? 'meteor_itgenio_live-modules',
  subName: settings.subName ?? 'itgenio.live-modules',
  subOnStartup: settings.subOnStartup != null ? settings.subOnStartup : true,
  importTimeout: settings.importTimeout ?? 5000,
  jsMarker: settings.jsMarker != null ? settings.jsMarker : `/*js-content*/`,
} as const;
