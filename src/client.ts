import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { LiveModulesConfig } from './config';
import { evaluateAsCSS } from './evaluateAsCSS';
import { LiveModulesCollection } from './shared';
import type { DBLiveModule, ILiveModules } from './types';
import { log, notice, warn } from './logger';
import { isCSSModule, isJSModule } from './utils';
import { requireModule } from './requireModule';

export { LiveModulesCollection, LiveModulesConfig };

let resolveReadyPromise: Function = () => {
};
const readyPromise = new Promise<void>(res => {
  resolveReadyPromise = res;
});

if (LiveModulesConfig.subOnStartup) {
  Meteor.startup(() => LiveModules.subscribe());
} else {
  notice(`Because 'subOnStartup' set to 'false', you should manually subscribe to a subscription '${LiveModulesConfig.subName}' before import any module and then call 'LiveModules.markAsReady()'`);
}

const NOT_FOUND_MARKERS = [`<!DOCTYPE html>`];

type ImportOptions = {
  importTimeout?: number;
};

export const LiveModules: ILiveModules = new (class LiveModulesClass implements ILiveModules {
  private getModulesWithTagsOrNames(tagsOrNames: string[]) {
    return LiveModulesCollection.find({
      enabled: true,
      $or: [{ tags: { $in: tagsOrNames } }, { name: { $in: tagsOrNames } }],
    })
      .fetch()
      .reduce((acc, lm) => {
        acc[lm.name] = lm;
        return acc;
      }, {} as Record<string, DBLiveModule>);
  }

  async subReady() {
    return readyPromise;
  }

  async importModule(tagOrName: string, opts: ImportOptions = {}) {
    return this.importModules([tagOrName], opts);
  }

  async importModules(tagsOrNames: string[] = [], opts: ImportOptions = {}) {
    const importTimeout = opts.importTimeout != null ? opts.importTimeout : LiveModulesConfig.importTimeout;

    return new Promise<void>((res, rej) => {
      let resolved = false;

      const timeoutId = setTimeout(() => {
        resolved = true;
        warn(`importModules: [${tagsOrNames.join(',')}] timeout!(${importTimeout}ms)`);
        rej('timeout');
      }, importTimeout);

      this._import(tagsOrNames)
        .then(() => {
          !resolved && res();
          clearTimeout(timeoutId);
        })
        .catch(rej);
    });
  }

  private async _import(tagsOrNames: string[] = []) {
    const prefixString = `[${tagsOrNames.join(',')}]`;
    let st = Date.now();

    await this.subReady();

    log(`importModules: ${prefixString} waited ${Date.now() - st}ms`);

    const modules = this.getModulesWithTagsOrNames(tagsOrNames);

    const modulesNames = Object.keys(modules);

    if (modulesNames.length === 0) {
      log(`there is no module to load`);
      return;
    }

    log(`importModules: ${prefixString} try to import modules:`, modulesNames.join(','));

    st = Date.now();

    try {
      const entries = Object.entries(modules).filter(([, module]) => {
        if (!module.source && !module.url) {
          warn(module.name, `skipped because no url nor source`);
          return false;
        }

        return true;
      });

      const willBeRequired = [] as DBLiveModule[];

      const tryToEvaluate = function tryToEvaluate(module: DBLiveModule, source: string) {
        try {
          if (isJSModule(source, module.url)) {
            eval(source);
            log(module.name, `evaluated as JS`);

            if (module.required) {
              willBeRequired.push(module);
            } else {
              log(module.name, `will not be required`);
            }
          } else if (isCSSModule(source, module.url)) {
            evaluateAsCSS(source, module.name);
            log(module.name, `evaluated as CSS`);
          }
        } catch (e) {
          warn(module.name, `error while evaluating:`);
          console.error(e);
        }
      };

      await Promise.allSettled(
        entries.map(([moduleName, module]) => {
          if (module.url) {
            return fetch(module.url)
              .then(async r => {
                try {
                  const txt = await r.text();

                  if (NOT_FOUND_MARKERS.some(m => txt.startsWith(m))) {
                    warn(moduleName, `not found by path: ${module.url}`);
                  } else {
                    log(moduleName, `loaded from path: ${module.url}`);

                    tryToEvaluate(module, txt);
                  }
                } catch (e) {
                  warn(moduleName, `error while handle:`);
                  console.error(e);
                }
              })
              .catch(e => {
                warn(moduleName, `error while fetching:`);
                console.error(e);
              });
          } else if (module.source) {
            log(moduleName, `loaded from source`);
            tryToEvaluate(module, module.source);
          }
        }),
      );

      willBeRequired.forEach(module => {
        try {
          requireModule(module.name);
          log(module.name, `required`);
        } catch (e) {
          warn(module.name, `error while require:`);
          console.error(e);
        }
      });

      log(`importModules: ${prefixString} done`);
    } catch (e) {
      warn(`error while loading modules:`);
      console.error(e);
    } finally {
      log(`importModules: ${prefixString} imported in ${Date.now() - st}ms`);
    }
  }

  subscribe() {
    const ts = Date.now();
    log(`subscribe ...`);
    const sub = Meteor.subscribe(LiveModulesConfig.subName);

    const t = Tracker.autorun(() => {
      const isReady = sub.ready();

      if (isReady) {
        this.markAsReady();
        t.stop();
        log(`subscribed, elapsed time: ${Date.now() - ts}ms`);
      }
    });

    return sub;
  }

  markAsReady(): void {
    resolveReadyPromise();
  }
})();
