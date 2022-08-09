Package.describe({
  name: 'itgenio:live-modules',
  version: '0.0.6',
  summary: 'Deploy any code to client/server runtime',
  documentation: 'README.md',
  git: 'https://github.com/itgenio/meteor-live-modules.git',
});

function configurePackage(api) {
  api.versionsFrom('2.0');
  api.use(['typescript', 'mongo', 'minimongo', 'tracker']);

  api.mainModule('src/server.ts', 'server');
  api.mainModule('src/client.ts', 'client');
}

Package.onUse(function(api) {
  configurePackage(api);
});

Package.onTest(function(api) {
  configurePackage(api);
  api.use([
    'tinytest',
    'test-helpers',
  ], ['client', 'server']);

  api.addFiles(['tests/_init.ts', 'tests/utils.ts'], ['client', 'server']);

  api.addFiles(['tests/evaluateAsCSS.ts'], 'client');
  api.addFiles(['tests/liveModules.ts', 'tests/getModulesByNameOrTag.ts'], ['client','server']);
});
