import { LiveModules } from '../src/liveModules';
import { MODULE_NAME_REQUIRED, MODULE_NAME_NON_REQUIRED, MODULE_NAME_CSS, MODULE_NAME_REMOTE } from './_init';
import { requireModule } from '../src/requireModule';

Tinytest.addAsync(
  'LiveModules - subReady - auto subscribe by default',
  async function() {
    await LiveModules.subReady();
  },
);

Tinytest.addAsync(
  'LiveModules - importModules - by tag',
  async function(test) {
    await LiveModules.importModules(['startup']);

    test.isTrue(Object[MODULE_NAME_REQUIRED]);

    test.equal(requireModule(MODULE_NAME_REQUIRED).name, MODULE_NAME_REQUIRED);
  },
);

Tinytest.addAsync(
  'LiveModules - importModule - by name',
  async function(test) {
    const m = await LiveModules.importModule(MODULE_NAME_NON_REQUIRED);

    test.isTrue(Object[MODULE_NAME_NON_REQUIRED]);
    test.isUndefined(m);

    const { name } = await LiveModules.importModule(MODULE_NAME_REQUIRED);
    test.equal(name, MODULE_NAME_REQUIRED);
  },
);

Tinytest.add(
  'LiveModules - require - by name',
  function(test) {
    const m = LiveModules.require(MODULE_NAME_REQUIRED);
    test.isNotUndefined(m);
    test.equal(m.name, MODULE_NAME_REQUIRED);
  },
);

Tinytest.addAsync(
  'LiveModules - import - css',
  async function(test) {
    await LiveModules.importModule(MODULE_NAME_CSS);

    if (Meteor.isClient) {
      test.equal((document.querySelector<HTMLStyleElement>(`style[data-module="${MODULE_NAME_CSS}"]`))?.textContent, '.itgenio-css { }');
    } else {
      //TOOD how to test?
    }
  },
);

Tinytest.addAsync(
  'LiveModules - import - remote',
  async function(test) {
    await LiveModules.importModule(MODULE_NAME_REMOTE);

    if (Meteor.isClient) {
      const { SketchpadPlugin } = LiveModules.require(MODULE_NAME_REMOTE);

      test.isNotUndefined(SketchpadPlugin);
    }

    if (Meteor.isServer) {
      try {
        LiveModules.require(MODULE_NAME_REMOTE);
      } catch (e: any) {
        test.equal(e.message, 'window is not defined');
      }
    }
  },
);
