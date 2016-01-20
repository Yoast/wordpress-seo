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
		expect( function(){ YoastSEO.App() } ).toThrow( new Error( "The app requires an object with callbacks" ) );
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
		expect( function(){ YoastSEO.App( argsCallbacks ) } ).toThrow( new Error( "No targetElement is defined" ) );
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
		expect( function(){ YoastSEO.App( argsTargetsNoOutput ) } ).toThrow( new Error( "no output target defined" ) );
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
		expect( function(){ YoastSEO.App( argsTargetsNoSnippet ) } ).toThrow( new Error( "no snippet target defined" ) );
	} )
} );

var argsCallbacksElements = {
	callbacks: {
		getData: function(){ return {} },
		bindElementEvents: function(){},
		updateSnippetValues: function(){},
		saveScores: function(){}
	},targets: {
		output: mockElement,
		snippet: mockSnippet
	}
};

describe( "Creating an app with callbacks and elements", function(){
	it( "throws no replacetarget error", function(){
		expect( function(){ YoastSEO.App( argsCallbacksElements ) } ).toThrow( new Error( "No replaceTarget is defined" ) );
	} )
} );

var argsReplaceTarget = {
	callbacks: {
		getData: function(){ return {} },
		bindElementEvents: function(){},
		updateSnippetValues: function(){},
		saveScores: function(){}
	},targets: {
		output: mockElement,
		snippet: mockSnippet
	},
	replaceTarget: ["content"]
};

describe( "Creating an app with callbacks and elements", function(){
	it( "throws no replacetarget error", function(){
		expect( function(){ YoastSEO.App( argsReplaceTarget ) } ).toThrow( new Error( "No resetTarget is defined" ) );
	} )
} );

var argsResetTarget = {
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
	resetTarget: [ "content" ]
};

describe( "Creating an app with callbacks and elements", function(){
	it( "throws no replacetarget error", function(){
		expect( function(){ YoastSEO.App( argsResetTarget ) } ).toThrow( new Error( "No elementTarget is defined" ) );
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

describe( "Creating an app with callbacks and elements", function(){
	it( "throws no replacetarget error", function(){
		var app = new YoastSEO.App( argsElementTarget );
		//expect( function(){ YoastSEO.App( argsResetTarget ) } ).toThrow( new Error( "No elementTarget is defined" ) );
	} )
} );