import { LiveModules } from '../src/liveModules';
import { getModulesByNameOrTag } from '../src/getModulesByNameOrTag';
import { MODULE_NAME_REQUIRED } from './_init';

Tinytest.addAsync(
  'getModulesByNameOrTag - by name',
  async function(test) {
    await LiveModules.subReady();

    const [m] = getModulesByNameOrTag(MODULE_NAME_REQUIRED);

    test.equal(m.name, MODULE_NAME_REQUIRED);
  },
);
