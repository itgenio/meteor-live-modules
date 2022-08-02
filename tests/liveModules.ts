import { LiveModules } from '../src/liveModules';
import { MODULE_NAME_REQUIRED, MODULE_NAME_NON_REQUIRED } from './_init';
import { requireModule } from '../src/requireModule';

Tinytest.addAsync(
  'LiveModules - subReady - auto subscribe by default',
  async function(test) {
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

Tinytest.addAsync(
  'LiveModules - require - by name',
  async function(test) {
    const m = LiveModules.require(MODULE_NAME_REQUIRED);
    test.isNotUndefined(m);
    test.equal(m.name, MODULE_NAME_REQUIRED);
  },
);
