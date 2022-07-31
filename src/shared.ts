import { Mongo } from 'meteor/mongo';
import { LiveModulesConfig } from './config';
import type { DBLiveModule } from './types';

export const LiveModulesCollection = new Mongo.Collection<DBLiveModule, DBLiveModule>(LiveModulesConfig.collName);
