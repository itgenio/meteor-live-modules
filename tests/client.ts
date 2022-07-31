import { LiveModules } from '../src/client';
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
    await LiveModules.importModule(MODULE_NAME_NON_REQUIRED);

    test.isTrue(Object[MODULE_NAME_NON_REQUIRED]);
  },
);
