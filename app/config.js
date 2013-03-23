// Set the require.js configuration for your application.
require.config({

  // Initialize the application with the main application file and the JamJS
  // generated configuration file.
  deps: ["../vendor/jam/require.config", "main"],

  // Packeges defined at jam/require.config.js required by shim libraries
  packages: [
    {"name" : "backbone"}, 
    {"name" : "jquery"}
  ],

  paths: {
    // Put paths here.
    "codemirror" : "../vendor/codemirror-3.0/lib/codemirror",
    "codemirror-markdown": "../vendor/codemirror-3.0/mode/markdown/markdown",
    "backbone.localStorage": "../vendor/backbone.localStorage-1.0/backbone.localStorage",
    "bootstrap" : "../vendor/bootstrap-2.2.2/js/bootstrap"
  },

  shim: {
    // Put shims here.
    "codemirror-markdown": {
      deps: ["codemirror"]
    },
    "backbone.localStorage": {
      deps: ['backbone']
    },
    "bootstrap": {
      deps: ['jquery']
    }
  }

});
