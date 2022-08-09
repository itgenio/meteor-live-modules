import { Meteor } from 'meteor/meteor';
import { LiveModulesConfig } from './config';

const isDev = Meteor.isDevelopment;

const PREFIX = `[LiveModules]${Meteor.isServer ? '[SERVER]' : ''}`;
const TAG = isDev ? `[DEV]` : '';

export const log: typeof console.log = function(...args) {
  LiveModulesConfig.logging && console.log(`${PREFIX}${TAG}`, ...args);
};

export const warn: typeof console.warn = function(...args) {
  LiveModulesConfig.logging && console.warn(`${PREFIX}${TAG}`, ...args);
};

export const notice: typeof console.info = function(...args) {
  LiveModulesConfig.logging && console.info(`${PREFIX}${TAG}}`, ...args);
};
