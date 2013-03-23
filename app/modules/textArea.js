// TextArea module
define([
  // Application.
  "app",

  // Dependencies
  "codemirror",
  "codemirror-markdown"
],

// Map dependencies from above array.
function(app) {

  // Create a new module.
  var TextArea = app.module();

  // Default View.
  TextArea.Views.Layout = Backbone.Layout.extend({
    template: "textArea",
    tagName: "textarea",

    // // Initialize the writing area view
    initialize: function() {
      $(window).on('resize.textArea', $.proxy(this._adjustEditorSize, this));
    },

    // // Free view resources
    cleanup: function() {
      $(window).off('resize.textArea');
    },

    // After rendering the View initialize the CodeMirror area if not
    // initialized yet
    afterRender: function() {

      if(!this.$cmEditor) {
        this.cmEditor = CodeMirror.fromTextArea( this.el, {
          mode: "markdown",
          lineNumbers: true,
          lineWrapping: true
        });

        // Register for cahnge event
        this.cmEditor.on('change', $.proxy(this._editorChanged, this) );

        // Store a reference to the editor wrapper
        this.$cmEditorWrapper = $('.textAreaWrapper');

        this._adjustEditorSize();   

        // Initial textArea content
        this.cmEditor.setValue('Simply write...');
      }
    },

    // Adjust the size of the editor when the window changes
    _adjustEditorSize: function() {
      var winHeight = $(window).height();
      var position = this.$cmEditorWrapper.position();
      var headerHeight = $(".headerAreaWrapper").height();
      var footerHeight = $(".footerAreaWrapper").height();

      this.$cmEditorWrapper.height( winHeight - position.top - headerHeight - footerHeight);
    },

    _editorChanged: function(event) {
      var result = {};
      var value = this.cmEditor.getValue();
      result.numChars = value.length;
      result.numWords = value.split(' ').length;
      result.numLines = this.cmEditor.lineCount();

      this.trigger('editorChanged', result);
    },

    // Updates the font size
    updateFontSize: function(size) {
      this.$cmEditorWrapper.find('.CodeMirror').css('font-size', size);
    },

    updateFontFamily: function(family) {
     this.$cmEditorWrapper.find('.CodeMirror').css('font-family', family); 
    },

    updateLineNumbers: function(value) {
      this.cmEditor.setOption('lineNumbers', value);
    },
    updateLineWrapper: function(value) {
      this.cmEditor.setOption('lineWrapping', value);
    },

    // Return current text on the text area
    getText: function() {
      return this.cmEditor.getValue();
    },
    setText: function(text) {
      this.cmEditor.setValue(text);
    }

  });

  // Return the module for AMD compliance.
  return TextArea;

});
