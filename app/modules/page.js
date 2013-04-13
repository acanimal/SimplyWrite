// Page module
define([
  // Application.
  "app",


  // backbone local storage
  "backbone.localStorage"
],

// Map dependencies from above array.
function(app) {

  // Create a new module.
  var Page = app.module();

  // Default Model.
  Page.Model = Backbone.Model.extend({
    defaults: {
      title: '',
      content: 'Simply write...'
    }
  });

  // Default Collection.
  Page.Collection = Backbone.Collection.extend({
    model: Page.Model,
    url: '/pages',
    localStorage: new Backbone.LocalStorage("SimplyWrite")
  });

  // Page list view
  Page.Views.PageList = Backbone.Layout.extend({
    tagName: 'ul',

    // Insert all subViews prior to rendering the View.
    beforeRender: function() {
      // Iterate over the passed collection and create a view for each item.
      this.collection.each(function(model) {
        // Pass the sample data to the new SomeItem View.
        this.insertView( new Page.Views.PageItem({
          model: model
        }));
      }, this);
    }
    
  });  

  // Single page item view
  Page.Views.PageItem = Backbone.Layout.extend({
    template: 'pageItem',
    tagName: 'li',
    events: {
      "click #deleteButton" : "_deleteButtonClick",
      "click #exportButton" : "_exportButtonClick"
    },

    // Remove the item from the view and model fomr the collection
    _deleteButtonClick: function() {
      var r = window.confirm("Are you sure you want to delete this write ???\You will lost all your data.");
      if (r==true) {
        var pageId = $("#"+this.model.id).val();
        if(pageId) {
          // Remove the model from collection and render again.
          $(this.el).remove();
          this.model.destroy();
        }
      }
    },

    // Open new window with content to easy save by the user
    _exportButtonClick: function() {
      var title = this.model.get('title');
      var content = this.model.get('content');
      content = content.replace(/(\r\n|\n|\r)/g,"<br />");

      var win = window.open('');
      win.document.write(content);
      win.document.title = title; 
      win.focus();
    },

    serialize: function() {
      return this.model.toJSON();
    }
  });  

  // Return the module for AMD compliance.
  return Page;

});
