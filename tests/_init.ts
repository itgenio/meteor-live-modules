import { LiveModulesConfig } from '../src/config';
import { LiveModulesCollection } from '../src/shared';

export const MODULE_NAME_NON_REQUIRED = `@itgenio/non-required`;
export const MODULE_NAME_REQUIRED = `@itgenio/required`;
export const MODULE_NAME_CSS = `@itgenio/css`;
export const MODULE_NAME_REMOTE = `@itgenio/sketchpad-plugin`;

if (Meteor.isServer) {
  LiveModulesCollection.remove({});
  LiveModulesCollection.insert({
    name: MODULE_NAME_NON_REQUIRED,
    v: 0,
    tags: ['startup'],
    enabled: true,
    required: false,
    source: `${LiveModulesConfig.jsMarker} console.log('hello from non required'); Object['${MODULE_NAME_NON_REQUIRED}']=true;`,
  });
  LiveModulesCollection.insert({
    name: MODULE_NAME_REQUIRED,
    v: 0,
    tags: ['startup'],
    enabled: true,
    required: true,
    source: `${LiveModulesConfig.jsMarker} meteorInstall({"node_modules":{"@itgenio":{"required"(r,e,m){console.log('hello from required'); Object['${MODULE_NAME_REQUIRED}']=true; e.name = "${MODULE_NAME_REQUIRED}"}}}})`,
  });
  LiveModulesCollection.insert({
    name: MODULE_NAME_CSS,
    v: 0,
    enabled: true,
    source: `.itgenio-css { }`,
  });
  LiveModulesCollection.insert({
    name: MODULE_NAME_REMOTE,
    v: 0,
    enabled: true,
    url: 'https://cdn.jsdelivr.net/npm/@itgenio/sketchpad-plugin@0.0.15/dist/index.meteor.js',
  });
}
