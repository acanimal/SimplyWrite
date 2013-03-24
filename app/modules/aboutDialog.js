// AboutDialog module
define([
  // Application.
  "app"
],

// Map dependencies from above array.
function(app) {

  // Create a new module.
  var AboutDialog = app.module();

  // Default View.
  AboutDialog.Views.Layout = Backbone.Layout.extend({
    template: "aboutDialog",
    events: {
      "click #closeIcon" : "_closeButtonClick"
    },

    initialize: function() {
      this.render();
    },

    // Close the view
    _closeButtonClick: function() {
      this.hide();
    },

    // Show the view.
    // We use an external modal element to place the view, 
    // see: http://lostechies.com/derickbailey/2012/04/17/managing-a-modal-dialog-with-backbone-and-marionette/
    show: function() {
      var $modalEl = $("#modalDialog");
      $modalEl.html(this.el);
      $modalEl.modal('show');
    },
    // Hide the view
    hide: function() {
      var $modalEl = $("#modalDialog");
      $modalEl.modal('hide');
    }

  });

  // Return the module for AMD compliance.
  return AboutDialog;

});
