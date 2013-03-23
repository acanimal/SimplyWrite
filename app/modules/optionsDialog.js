// OptionsDialog module
define([
  // Application.
  "app"
],

// Map dependencies from above array.
function(app) {

  // Create a new module.
  var OptionsDialog = app.module();

  // Default View.
  OptionsDialog.Views.Layout = Backbone.Layout.extend({
    template: "optionsDialog",
    events: {
      "click #newCloseIcon" : "_closeButtonClick",
      "click #font-family > ul > li" : "_fontFamilyChanged",
      "click #font-size > ul > li" : "_fontSizeChanged",
      "change #lineNumbersOption" : "_lineNumbersChanged",
      "change #wrapLineOption" : "_wrapLineChanged"
    },

    initialize: function() {
      this.render();
    },

    afterRender: function() {
      this._initializeFields();
    },

    // Initialize fields with option values
    _initializeFields: function() {
      var fontFamily = app.configuration.fontFamily;
      var fontSize = app.configuration.fontSize;
      var lineNumbers = app.configuration.lineNumbers;
      var lineWrap = app.configuration.lineWrap;

      switch(fontFamily) {
        case "sans-serif":
          this.$el.find('.sans-serif > a').addClass('selected');
          break;

        case "serif":
          this.$el.find('.serif > a').addClass('selected');
          break;

        case "monospace":
          this.$el.find('.monospace > a').addClass('selected');
          break;

        default:
          break;
      }

      switch(fontSize) {
        case "font-small":
          this.$el.find('.font-small > a').addClass('selected');
          break;

        case "font-medium":
          this.$el.find('.font-medium > a').addClass('selected');
          break;

        case "font-big":
          this.$el.find('.font-big > a').addClass('selected');
          break;

        default:
          break;
      }

      if(lineNumbers) {
        this.$el.find('#lineNumbersOption').attr('checked',true);
      } else {
        this.$el.find('#lineNumbersOption').attr('checked',false);
      }

      if(lineWrap) {
        this.$el.find('#wrapLineOption').attr('checked',true);
      } else {
        this.$el.find('#wrapLineOption').attr('checked',false);
      }
      
    },

    // Executed when a font is selected
    _fontFamilyChanged: function(e) {
      this.$el.find('#font-family > ul > li > a').removeClass('selected');
      $(e.target).addClass('selected');

      var fontFamily = $(e.currentTarget).data('font');
      app.configuration.fontFamily = fontFamily;

      this.trigger('fontFamilyChanged', fontFamily);
    },
    
    // Executed when a size is selected
    _fontSizeChanged: function(e) {
      this.$el.find('#font-size > ul > li > a').removeClass('selected');
      $(e.target).addClass('selected');

      var fontSize = $(e.currentTarget).data('size');
      app.configuration.fontSize = fontSize;

      this.trigger('fontSizeChanged', fontSize);
    },

    _lineNumbersChanged: function(e) {
      app.configuration.lineNumbers = e.currentTarget.checked;

      this.trigger('lineNumbersChanged', app.configuration.lineNumbers);
    },

    _wrapLineChanged: function(e) {
      app.configuration.lineWrap = e.currentTarget.checked;

      this.trigger('wrapLineChanged', app.configuration.lineWrap);
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

    // Hide the dialog
    hide: function() {
      var $modalEl = $("#modalDialog");
      $modalEl.modal('hide');
    }

  });

  // Return the module for AMD compliance.
  return OptionsDialog;

});
