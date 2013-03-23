// StatusPanel module
define([
  // Application.
  "app"
],

// Map dependencies from above array.
function(app) {

  // Create a new module.
  var StatusPanel = app.module();

  // Default View.
  StatusPanel.Views.Layout = Backbone.Layout.extend({
    template: "statusPanel",

    updateStatus: function(event) {
      this.$('#numWords').html(event.numWords);
      this.$('#numChars').html(event.numChars);
      this.$('#numLines').html(event.numLines);
    }

  });

  // Return the module for AMD compliance.
  return StatusPanel;

});
