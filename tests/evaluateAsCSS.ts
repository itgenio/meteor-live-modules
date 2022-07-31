import { evaluateAsCSS, DATA_ATTRIBUTE_NAME } from '../src/evaluateAsCSS';

const MODULE_NAME = `@itgenio/live-modules-tests`;

const queryElement = () => document.querySelector<HTMLStyleElement>(`[${DATA_ATTRIBUTE_NAME}="${MODULE_NAME}"]`);

Tinytest.add(
  'evaluateAsCSS - add attribute',
  function(test) {
    evaluateAsCSS('.test {}', MODULE_NAME);

    test.equal(queryElement().getAttribute(DATA_ATTRIBUTE_NAME), MODULE_NAME);
  },
);

Tinytest.add(
  `evaluateAsCSS - doesn't duplicate for the same module`,
  function(test) {
    evaluateAsCSS('.test1 {}', MODULE_NAME);
    evaluateAsCSS('.test2 {}', MODULE_NAME);
    test.equal(queryElement().textContent, `.test2 {}`);
  },
);
