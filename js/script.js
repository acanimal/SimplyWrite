/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
$('#saveDialog').dialog({
	autoOpen: false,
	width: 600,
	modal: true,
	show: "drop",
	hide: "drop",
	buttons: {
		"Ok": function() {
			var title = $("#saveWriteTitle").val();
			var text = $("#writearea").val();
			
			// Store on DB. Check if exists
			var writeTransaction = dbase.transaction(
			  ["simplywriteOS"],           // The Object Stores to lock
			  IDBTransaction.READ_WRITE,  // Lock type (READ_ONLY, READ_WRITE)
			  0
			);
			// Open a store and generate a write request:
			var store = writeTransaction.objectStore("written");			
			var writeRequest = store.add( {
			    "title":  title,
			    "text": text
			} );
			writeRequest.onerror = function ( e ) {
			    writeTransaction.abort();
			    if(e.code==3) {
			    	alert("Another text with the same title exists !!! ");
			    } else {
			    	alert("There was an error storing data !!! ");
			    }
			};
			writeRequest.onsuccess = function ( e ) {
			};
						
			$(this).dialog("close");
		},
		"Cancel": function() {
			$(this).dialog("close");
		}
	}
});
$('#clearDialog').dialog({
	autoOpen: false,
	width: 350,
	modal: true,
	show: "drop",
	hide: "drop",
	buttons: {
		"Ok": function() {
			$("#writeTitle").val("Title here");
			$("#writearea").val("Start writting here...");
			$(this).dialog("close");
		},
		"Cancel": function() {
			$(this).dialog("close");
		}
	}
});
$('#listDialog').dialog({
	autoOpen: false,
	width: 600,
	modal: true,
	show: "drop",
	hide: "drop",
	buttons: {
		"Open": function() {
			var title = $("#listDialog > select").val();
			
			// Create a transaction
			var readTransaction = dbase.transaction(
			  ["simplywriteOS"],           // The Object Stores to lock
			  IDBTransaction.READ_ONLY,   // Lock type (READ_ONLY, READ_WRITE)
			  0
			);
			var store = readTransaction.objectStore("written");
			var readCursor = store.openCursor();
			
			// Setup a handler for the cursor’s `success` event:
			readCursor.onsuccess = function ( e ) {
			  if ( e.result ) {
			    if(e.result.value.title == title) {
			    	$("#writeTitle").val(e.result.value.title);
			    	$("#writearea").val(e.result.value.text);
			    } else {
			    	e.result.continue();	
			    }
			  } else {
			    // If the `success` event’s `result` is null, you’ve reached
			    // the end of the cursor’s list.
			  }
			};
			
			$(this).dialog("close");
		},
		"Cancel": function() {
			$(this).dialog("close");
		}
	}
});
$('#deleteDialog').dialog({
	autoOpen: false,
	width: 600,
	modal: true,
	show: "drop",
	hide: "drop",
	buttons: {
		"Ok": function() {
			var title = $("#writeTitle").val();

			// Store on DB. Check if exists
			var writeTransaction = dbase.transaction(
			  ["simplywriteOS"],           // The Object Stores to lock
			  IDBTransaction.READ_WRITE,  // Lock type (READ_ONLY, READ_WRITE)
			  0
			);
			// Open a store and generate a write request:
			var store = writeTransaction.objectStore("written");			
			var writeRequest = store.remove(title);
			writeRequest.onerror = function ( e ) {
			    writeTransaction.abort();
			    alert("There was an error deleting data !!! ");
			};
			writeRequest.onsuccess = function ( e ) {
				$("#writeTitle").val("Title here");
				$("#writearea").val("Start writting here...");
			};
			
			$(this).dialog("close");
		},
		"Cancel": function() {
			$(this).dialog("close");
		}
	}
});
$('#settingsDialog').dialog({
	autoOpen: false,
	width: 600,
	modal: true,
	show: "drop",
	hide: "drop",
	buttons: {
		"Ok": function() {
			$(this).dialog("close");
		},
		"Cancel": function() {
			$(this).dialog("close");
		}
	}
});
$('#aboutDialog').dialog({
	autoOpen: false,
	width: 600,
	modal: true,
	show: "drop",
	hide: "drop",
	buttons: {
		"Close": function() {
			$(this).dialog("close");
		}
	}
});

$('#saveButton').click( function() {
	$('#saveWriteTitle').val($('#writeTitle').val());
	$('#saveDialog').dialog('open');
	return false;
});
$('#clearButton').click( function() {
	$('#clearDialog').dialog('open');
	return false;
});
$('#listButton').click( function() {
	// Create a transaction
	var readTransaction = dbase.transaction(
	  ["simplywriteOS"],           // The Object Stores to lock
	  IDBTransaction.READ_ONLY,   // Lock type (READ_ONLY, READ_WRITE)
	  0
	);
	var store = readTransaction.objectStore("written");
	var readCursor = store.openCursor();
	
	$("#listDialog > select > option").remove();
	
	// Setup a handler for the cursor’s `success` event:
	readCursor.onsuccess = function ( e ) {
	  if ( e.result ) {
	    $("#listDialog > select").append("<option>"+e.result.value.title+"</option>");
	    e.result.continue();
	  } else {
	    // If the `success` event’s `result` is null, you’ve reached
	    // the end of the cursor’s list.
	  }
	};

	$('#listDialog').dialog('open');
	return false;
});
$('#deleteButton').click( function() {
	$('#deleteDialog').dialog('open');
	return false;
});
$('#settingsButton').click( function() {
	$('#settingsDialog').dialog('open');
	return false;
});
$('#aboutButton').click( function() {
	$('#aboutDialog').dialog('open');
	return false;
});

/////////////////////////////////////////////////////////
// Indexed DB
/////////////////////////////////////////////////////////
// Global variable to access IndexedDB.
var dbase = null;
// Deal with vendor prefixes
if ( "webkitIndexedDB" in window ) {
	window.indexedDB      = window.webkitIndexedDB;
	window.IDBTransaction = window.webkitIDBTransaction;
	window.IDBTransaction = window.webkitIDBTransaction;
	window.IDBKeyRange    = window.webkitIDBKeyRange;
} else if ( "mozIndexedDB" in window ) {
	window.indexedDB = window.mozIndexedDB;
}
if ( !window.indexedDB ) {
	// Browser doesn’t support indexedDB, do something
	// clever, and then exit early.
	alert("IndexedDB not supported !!!");
}

var dbRequest = window.indexedDB.open(
	"SimplyWriteDB",        // Database ID
	"All my SimplyWrities" // Database Description
);

// The `result` attribute of the `success` event
// holds the communication channel to the database
dbRequest.onsuccess = function ( e ) {
	var db = e.result;
	dbase = db;
	// Bootstrapping: if the user is hitting the page
	// for the first time, she won’t have a database.
	// We can detect this by inspecting the database’s
	// `version` attribute:
	if ( db.version === "" ) {
		// Empty string means the database hasn’t been versioned.
		// Set up the database by creating any necessary
		// Object Stores, and populating them with data
		// for the first run experience.

		// We’re dealing with an unversioned DB.  Versioning is, of
		// course, asynchronous:
		var versionRequest = db.setVersion( "1.0" );
		// Setting a version creates an implicit Transaction, meaning
		// that either _everything_ in the callback succeeds, or
		// _everything_ in the callback fails.
		versionRequest.onsuccess = function ( e ) {
			// Object Store creation is atomic, but can only take
			// place inside version-changing transaction.
			var store = db.createObjectStore(
			"written",	// The Object Store’s name
			"title",  				// The name of the property to use as a key
			false         		// Is the key auto-incrementing?
			);
		};
	}
};