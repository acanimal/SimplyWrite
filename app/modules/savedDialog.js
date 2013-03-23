// SavedDialog module
define([
  // Application.
  "app",

  // Modules
  "modules/page"
],

// Map dependencies from above array.
function(app, Page) {

  // Create a new module.
  var SavedDialog = app.module();

  // Default View.
  SavedDialog.Views.Layout = Backbone.Layout.extend({
    template: "savedDialog",
    events: {
      "click #acceptButton" : "_acceptButtonClick",
      "click #cancelButton" : "_cancelButtonClick",
      "click #closeIcon" : "_cancelButtonClick"
    },

    initialize: function() {

      this.pageList = new Page.Views.PageList({
        collection: this.collection
      });
      this.setView('#pageList', this.pageList);

      this.render();
    },

    // Trigger a newPage event so the application can handle it
    _acceptButtonClick: function() {
      var pageId = $("#pageList input[type='radio']:checked").val();
      if(pageId) {
        this.hide();
        this.trigger('openPage', {pageId: pageId});
      }
    },
    // Close the view
    _cancelButtonClick: function() {
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
  return SavedDialog;

});
