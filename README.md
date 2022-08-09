# meteor/itgenio:live-modules

Deploy any code to client/server runtime in any time.

## Installation

1. Add to your meteor project:

```bash
meteor add itgenio:live-modules
```

2. **(server side)** Register modules:

- by inserting documents into `LiveModulesCollection`;
- by using helper class `LiveModulesServiceDefault`.

3. **(client/server side)** Use `LiveModules.importModule(...)` or `LiveModules.importModules(..)` anywhere to import a code.

[See an example](#example)

## Features

- Enable/disable modules
- Import modules by specific tags or name
- `importTimeout` to control imports time
- Works with JS & CSS
- Server and Client

## Configuration via Meteor.settings

```json
{
  "public": {
    "liveModules": {
      "collName": "meteor_itgenio_live-modules",
      "subName": "itgenio.live-modules",
      "logging": true,
      "importTimeout": 5000,
      "subOnStartup": true,
      "jsMarker": "/*js-content*/"
    }
  }
}
```

## Example

1. Add the package:

```bash
meteor add itgenio:live-modules
```

2. Register **live module** (server side):

`server/index.js`:

```typescript
import { LiveModulesConfig, LiveModulesCollection } from 'meteor/itgenio:live-modules';

LiveModulesCollection.remove({}); //clean all modules

LiveModulesCollection.insert({
  name: 'test-module1',
  v: 0,
  tags: ['startup'],
  enabled: true,
  required: false,
  source: `${LiveModulesConfig.jsMarker} console.log('Hello from test-module1');`,
});

LiveModulesCollection.insert({
  name: 'test-module2',
  v: 0,
  tags: ['startup'],
  enabled: true,
  required: false,
  source: `${LiveModulesConfig.jsMarker} console.log('Hello from test-module2');`,
});
```

3. Import **live module** (client side):

`client/index.js`:

```typescript
import { LiveModules } from 'meteor/itgenio:live-modules';

(async () => {
  await LiveModules.importModule('test-module1'); //by name
})();
```

4. Done! Check your console in the browser for a line `Hello from test-module1`

## Use cases

**Import by tag on startup**

```typescript
import { LiveModules } from 'meteor/itgenio:live-modules';

Meteor.startup(async () => {
  //...

  //
  // Import all modules with tag `startup`
  //
  try {
    await LiveModules.importModules(['startup']);
  } catch (e) {
    console.error(e);
  }
  //...
});
```

**Import by name in specific page**

```typescript jsx
import { LiveModules } from 'meteor/itgenio:live-modules';

const lazy = () => LiveModules.importModule('my-lazy-component');

//suspense is HOC for <Suspense/> from react
const SubComponent = suspense(() => {
  //Some magic...
  //But you just waiting for resolving promise
  const { LazyComponent } = useService(lazy);

  return LazyComponent;
});

export function MyPage() {
  return <SubComponent />;
}
```

## Evaluation

**evaluate as JS**

If the url ends with `.js/.cjs` or the `source` field starts with LiveModulesConfig.jsMarker (by
default,  `/*js-content*/`).

It's not safe, so be careful to use `source` field.

**evaluate as CSS**

If the url ends with `.css` or the `source` field doesn't start with `LiveModulesConfig.jsMarker`.

Only works on the Client side.

## Types

[See `src/types.ts`](./src/types.ts)

## Links

- https://github.com/benjamn/install
- https://github.com/benjamn/reify
- https://github.com/meteor/meteor/tree/ffcfa5062cf1bf8a64ea64fef681ffcd99fe7939/packages/modules-runtime

## Tests

```bash
npm run test
```
