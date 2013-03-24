// Application module
define([
  // Application.
  "app", 

  // Modules
  "modules/textArea",
  "modules/statusPanel",
  "modules/page",
  "modules/newDialog",
  "modules/savedDialog",
  "modules/optionsDialog",
  "modules/aboutDialog",

  // Bootstrap
  "bootstrap", 

  "backbone.localStorage"
],

// Map dependencies from above array.
function(app, TextArea, StatusPanel, Page, NewDialog, SavedDialog, OptionsDialog, AboutDialog) {

  // Create a new module.
  var Application = app.module();

  // Default View.
  Application.Views.Layout = Backbone.Layout.extend({
    template: "application",
    events: {
      "click #savedButton": "_savedButtonClick",
      "click #newButton": "_newButtonClick",
      "click #saveButton": "_saveButtonClick",
      "click #optionsButton": "_optionsButtonClick",
      "click #aboutButton": "_aboutButtonClick"
    },

    MESSAGE_DURATION: 2000,
    TOGGLE_IN_DURATION: 500,
    TOGGLE_OUT_DURATION: 1000,
    IDLE_CHECK_TIME: 4000,
    idleTime: 0,
    idleInterval: null,
    hiddenPanels: false,
    TIMER_CHECK: 1000,
    timer: null,
    workingTime: 0,
    totalTime: 0,
    updateWorkingtTimer: true,

    initialize: function() {
      // Current working Model Page
      this.currentPage = null;

      // Collection where store all pages 
      this.pageCollection = new Page.Collection();
      this.pageCollection.fetch();

      // Create views
      this.textArea = new TextArea.Views.Layout();
      this.statusPanel = new StatusPanel.Views.Layout({
        keep: true  // Don't remove the view when change
      }); 

      // Set views
      this.setViews({
        '.textAreaWrapper': this.textArea,
        '#statusPanel': this.statusPanel
      });

      // Update status panel on editor changes
      this.textArea.on('editorChanged', this.statusPanel.updateStatus, this.statusPanel);

      // Define event to manage mouse idle
      this._handleMouseIdle();

      // Start total and working timers
      this._startTimer();
    },

    afterRender: function() {
      // Detect when window is focused or blur to update working time.
      $(window).focus( $.proxy(function() {
        this._updateWorkingtTimer(true);
      }, this) );
      $(window).blur( $.proxy(function() {
        this._updateWorkingtTimer(false);
      }, this) );
    },

    // Change the message test
    _setMessage: function(text, timeout) {
      var $message = this.$('#message');
      $message.html(text);

      if(!timeout) {
         timeout = this.MESSAGE_DURATION;
      }

      $message.fadeIn();
      var to = setTimeout(function() {
        $message.fadeOut();
        clearTimeout(to);
      }, timeout);

    },

    // Show the saved pages dialog
    _savedButtonClick: function() {
      var savedDialog = new SavedDialog.Views.Layout({
        collection: this.pageCollection
      });

      // If dialog trigger openPage event then handle it
      savedDialog.on('openPage', this._openPage, this);

      // Show dialog
      savedDialog.show();
    },
    // Show a modal dialog to confirm create new page
    _newButtonClick: function() {
      var newDialog = new NewDialog.Views.Layout({});

      // If dialog trigger newPage event then handle it
      newDialog.on('newPage', this._newPage, this);

      // Show dialog
      newDialog.show();
    },
    // Trigger a savePage event so the aplication view can handle the event.
    _saveButtonClick: function() {
      this._savePage();
    },

    // Show a modal dialog to change options
    _optionsButtonClick: function() {
      var optionsDialog = new OptionsDialog.Views.Layout({});

      // Add listeners for options changes
      optionsDialog.on('fontFamilyChanged', function(fontFamily) {
        this.textArea.updateFontFamily(fontFamily);
      }, this);
      optionsDialog.on('fontSizeChanged', function(fontsize) {
        this.textArea.updateFontSize(app.configuration.fontConversion[fontsize]);
      }, this);
      optionsDialog.on('lineNumbersChanged', function(checked) {
        this.textArea.updateLineNumbers(checked);
      }, this);
      optionsDialog.on('wrapLineChanged', function(checked) {
        this.textArea.updateLineWrapper(checked);
      }, this);

      // Show dialog
      optionsDialog.show();
    },

    // Show about dialog
    _aboutButtonClick: function() {
      var aboutDialog = new AboutDialog.Views.Layout({});

      // Show dialog
      aboutDialog.show();
    },

    // Open specified page
    _openPage: function(event) {
      this.currentPage = this.pageCollection.get(event.pageId);
      this.textArea.setText(this.currentPage.get('content'));
      this._setMessage('Page loaded');
    },

    // Create a new page
    _newPage: function() {
      this.currentPage = null;
      this.textArea.setText('Simply write...');
      this._setMessage('New page created');
    },

    // Save the current page
    _savePage: function() {
      var text = this.textArea.getText();

      if(!this.currentPage) {
        this.currentPage = new Page.Model();
        this.pageCollection.create(this.currentPage);
      }

      // Set as title the first non empty line
      var title = text;
      title = $.trim(title).split('\n')[0];

      this.currentPage.set('title', title);
      this.currentPage.set('content', text);
      this.currentPage.save();

      this._setMessage("Page saved with title '"+title+"' ");
    },

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    // Start the timer to count total and worked time
    _startTimer: function() {
      this.timer = setInterval( $.proxy(function() {

        this.totalTime++;

        var time = this.totalTime;
        var Th = Math.floor(time / 3600);
        Th = (Th <10) ? "0"+Th : Th;
        time = time - Th * 3600;

        var Tm = Math.floor(time / 60);
        Tm = (Tm <10) ? "0"+Tm : Tm;
        time = time - Tm * 60;
        Ts = (time <10) ? "0"+time : time;
        
        this.$('#totalTime').html(Th+":"+Tm+":"+Ts);
        
        if(this.updateWorkingtTimer) {
          this.workingTime++; 

          time = this.workingTime;

          var Wh = Math.floor(time / 3600);
          Wh = (Wh <10) ? "0"+Wh : Wh;
          time = time - Wh * 3600;

          var Wm = Math.floor(time / 60);
          Wm = (Wm <10) ? "0"+Wm : Wm;
          time = time - Wm * 60;
          Ws = (time <10) ? "0"+time : time;

          this.$('#workingTime').html(Wh+":"+Wm+":"+Ws);  
        }

      }, this), this.TIMER_CHECK);
    },
    // Stop timer
    _stopTimer: function() {
      clearInterval(this.timer);
    },
    // Change flag indicating if working time must be increased
    _updateWorkingtTimer: function(value) {
      this.updateWorkingtTimer = value;
    },

    // Define methods to check if the mouse is IDLE to hide panels
    _handleMouseIdle: function() {
      this.idleInterval = setInterval( $.proxy(function() {
        this.idleTime++;

        if(this.idleTime > 1 && !this.hiddenPanels) {
          this.hiddenPanels = true;

          // Hide panels
          this.statusPanel.$el.fadeOut(this.TOGGLE_OUT_DURATION);
          $('#mainActions').fadeOut(this.TOGGLE_OUT_DURATION);

          // TODO - Hide the text area scrolls
        }
      }, this), this.IDLE_CHECK_TIME);

      $(window).on('mousemove', $.proxy(function() {
        this.idleTime = 0;

        if(this.hiddenPanels) {
          this.hiddenPanels = false;
          
          this.statusPanel.$el.fadeIn(this.TOGGLE_IN_DURATION);
          $('#mainActions').fadeIn(this.TOGGLE_IN_DURATION);
        }

      }, this));
    }

  });

  // Return the module for AMD compliance.
  return Application;

});
