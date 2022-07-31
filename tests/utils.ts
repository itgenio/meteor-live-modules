import { LiveModulesConfig } from '../src/config';
import { isJSModule, isCSSModule } from '../src/utils';

Tinytest.add(
  'utils - isJSModule - by url',
  function(test) {
    test.isTrue(isJSModule('', 'http://a/b/index.js?some=1'));
    test.isTrue(isJSModule('', 'http://a/index.cjs'));
    test.isFalse(isJSModule('', 'http://a/index.mjs')); //mjs currently isn't supported
  },
);

Tinytest.add(
  'utils - isJSModule - by content with markers',
  function(test) {
    test.isTrue(isJSModule(LiveModulesConfig.jsMarker));
  },
);

Tinytest.add(
  `utils - isCSSModule - only url with '.css' in the end`,
  function(test) {
    test.isTrue(isCSSModule('', 'http://a/style.css?some=1'));
    test.isFalse(isCSSModule('', 'http://a/style.js'));
  },
);

Tinytest.add(
  `utils - isCSSModule - by content (not empty)`,
  function(test) {
    test.isTrue(isCSSModule(' ')); // yeah
  },
);
