require("./helpers/i18n.js");
require("../js/config/config.js");
require("../js/config/scoring.js");
require("../js/analyzer.js");
require("../js/app.js");
require("../js/browser.js");
require("../js/pluggable.js");
require("../js/preprocessor.js");
require("../js/scoreFormatter.js");
require("../js/stringHelper.js");
require("../js/templates.js");

// Makes lodash think this is a valid HTML element
var mockElement = [];
mockElement.nodeType = 1;

var mockSnippet = [];
mockSnippet.nodeType = 1;

describe( "Creating an app without any arguments", function(){
	it( "throws error for missing callbacks object", function(){
		expect( function(){ YoastSEO.App() } ).toThrow( new Error( "The app requires an object with a getdata callback." ) );
	} )
} );

var argsCallbacks = {
	callbacks: {
		getData: function(){ return {} },
		bindElementEvents: function(){},
		updateSnippetValues: function(){},
		saveScores: function(){}
	}
};

describe( "Creating an app with only callbacks", function() {
	it( "throws error for missing targets", function(){
		expect( function(){ YoastSEO.App( argsCallbacks ) } ).toThrow( new Error( "No targetElement is defined." ) );
	} )
} );

var argsTargetsNoOutput = {
	callbacks: {
		getData: function(){ return {} },
		bindElementEvents: function(){},
		updateSnippetValues: function(){},
		saveScores: function(){}
	},targets: { snipppet: mockSnippet }
};

describe( "Creating an app with only callbacks", function() {
	it( "throws error for missing targets", function(){
		expect( function(){ YoastSEO.App( argsTargetsNoOutput ) } ).toThrow( new Error( "No output target defined." ) );
	} )
} );

var argsTargetsNoSnippet = {
	callbacks: {
		getData: function(){ return {} },
		bindElementEvents: function(){},
		updateSnippetValues: function(){},
		saveScores: function(){}
	},targets: { output: mockElement }
};

describe( "Creating an app with only callbacks", function() {
	it( "throws error for missing targets", function(){
		expect( function(){ YoastSEO.App( argsTargetsNoSnippet ) } ).toThrow( new Error( "No snippet target defined." ) );
	} )
} );

var argsElementTarget = {
	callbacks: {
		getData: function(){ return {} },
		bindElementEvents: function(){},
		updateSnippetValues: function(){},
		saveScores: function(){}
	},targets: {
		output: mockElement,
		snippet: mockSnippet
	},
	replaceTarget: [ "content" ],
	resetTarget: [ "content" ],
	elementTarget: [ "content" ]
};


YoastSEO.App.prototype.createSnippetPreview = function(){};
YoastSEO.App.prototype.showLoadingDialog = function(){};
YoastSEO.App.prototype.updateLoadingDialog = function(){};
YoastSEO.App.prototype.removeLoadingDialog = function(){};

describe( "Creating an app with callbacks and elements", function(){
	it( "throws no replacetarget error", function(){
		var app = new YoastSEO.App( argsElementTarget );
		//expect( function(){ YoastSEO.App( argsResetTarget ) } ).toThrow( new Error( "No elementTarget is defined" ) );
	} )
} );