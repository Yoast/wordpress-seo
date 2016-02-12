require("../js/config/config.js");
require("../js/config/scoring.js");
require("../js/analyzer.js");
require("../js/app.js");
require("../js/pluggable.js");
require("../js/scoreFormatter.js");

var MissingArgument = require( "../js/errors/missingArgument.js" );
var SnippetPreview = require( "../js/snippetPreview.js" );

var clone = require( "lodash/lang/clone" );

// Mock these function to prevent us from needing an actual DOM in the tests.
YoastSEO.App.prototype.createSnippetPreview = function(){};
YoastSEO.App.prototype.showLoadingDialog = function(){};
YoastSEO.App.prototype.updateLoadingDialog = function(){};
YoastSEO.App.prototype.removeLoadingDialog = function(){};
YoastSEO.App.prototype.initSnippetPreview = function(){};
YoastSEO.App.prototype.runAnalyzer = function(){};

document = {};
document.getElementById = function() { return mockElement; };

// Makes lodash think this is a valid HTML element
var mockElement = [];
mockElement.nodeType = 1;

describe( "Creating an App", function(){
	it( "throws an error when no args are given", function(){
		expect( YoastSEO.App ).toThrowError( MissingArgument );
	});

	it( "throws on an empty args object", function() {
		expect( function() {
			new YoastSEO.App({});
		} ).toThrowError( MissingArgument ) ;
	});

	it( "throws on an invalid targets argument", function() {
		expect( function() {
			new YoastSEO.App({
				callbacks: {
					getData: function() { return {} }
				}
			});
		} ).toThrowError( MissingArgument );
	});

	it( "throws on a missing getData callback", function() {
		expect( function() {
			new YoastSEO.App({
				targets: {
					snippet: "snippetID",
					output: "outputID"
				}
			} );
		} ).toThrowError( MissingArgument );
	});

	it( "throws on a missing snippet preview", function() {
		expect( function() {
			new YoastSEO.App({
				targets: {
					output: "outputID"
				},
				callbacks: {
					getData: function() { return {} }
				}
			});
		} ).toThrowError( MissingArgument );
	});

	it( "accepts a Snippet Preview object", function() {
		var app = new YoastSEO.App({
			targets: {
				output: "outputID"
			},
			callbacks: {
				getData: function() { return {} }
			},
			snippetPreview: new SnippetPreview({
				targetElement: mockElement
			})
		});
	});

	it( "throws on a missing output element ID", function() {
		expect( function() {
			new YoastSEO.App({
				targets: {
					snippet: "snippetID"
				},
				callbacks: {
					getData: function() { return {} }
				}
			} )
		} ).toThrowError( MissingArgument );
	});

	it( "works with correct arguments", function() {
		new YoastSEO.App({
			targets: {
				snippet: "snippetID",
				output: "outputID"
			},
			callbacks: {
				getData: function() { return {} }
			}
		});
	});
} );
