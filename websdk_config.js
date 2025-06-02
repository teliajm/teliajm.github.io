window.CallGuide.config = {
  // In this template, wds.domain.ex, paths, and nameOfInstance are just placeholders,
  // they have to be replaced by the actual hostname and instance name from the production environment.

  // Path to customer specific instance, probably the path where this file is fetched from
  instanceLocation: 'https://#INSTANCE#/',

  // Path to ACE Web SDK configuration for this instance
  configUrl: 'https://#INSTANCE#/config_services.js',

  // Path to ACE Web SDK modules for visitor clients
  visitorLocation: 'https://wds.ace.teliacompany.com/wds/#VERSION#/visitor/js/modules/',

  // Path to ACE Web SDK agent cobrowsing client
  agentLocation: 'https://wds.ace.teliacompany.com/wds/#VERSION#/agent/',

  // Name of Web SDK instance to use (NOT the Chat Engine instance!)
  instance: 'teliajm.github.io',

  // ACE Web SDK version
  version: '29.0.7',
};
