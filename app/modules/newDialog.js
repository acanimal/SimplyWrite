// NewDialog module
define([
  // Application.
  "app"
],

// Map dependencies from above array.
function(app) {

  // Create a new module.
  var NewDialog = app.module();

  // Default View.
  NewDialog.Views.Layout = Backbone.Layout.extend({
    template: "newDialog",
    events: {
      "click #newAcceptButton" : "_newAcceptButtonClick",
      "click #newCancelButton" : "_newCancelButtonClick",
      "click #newCloseIcon" : "_newCancelButtonClick"
    },

    initialize: function() {
      this.render();
    },

    // Trigger a newPage event so the application can handle it
    _newAcceptButtonClick: function() {
      this.hide();
      this.trigger('newPage');
    },
    // Close the view
    _newCancelButtonClick: function() {
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
  return NewDialog;

});
