define([
  // Application.
  "app",

  // Modules
  "modules/application",
  "modules/textArea"
],

function(app, Application, TextArea) {

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    routes: {
      "": "index"
    },

    initialize: function() {
      // Create the main application view
      app.application = new Application.Views.Layout();
    },

    index: function() {
      // Use and configure a 'main' layout
      app.useLayout('app').setViews({
        '#application': app.application
      }).render();
    }
  });

  return Router;

});
