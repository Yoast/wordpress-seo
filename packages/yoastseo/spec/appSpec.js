import MissingArgument from "../src/errors/missingArgument.js";
import SnippetPreview from "../src/snippetPreview/snippetPreview.js";
import App from "../src/app.js";

// Mock these function to prevent us from needing an actual DOM in the tests.
App.prototype.createSnippetPreview = function() {};
App.prototype.showLoadingDialog = function() {};
App.prototype.updateLoadingDialog = function() {};
App.prototype.removeLoadingDialog = function() {};
App.prototype.initSnippetPreview = function() {};
App.prototype.runAnalyzer = function() {};

// Makes lodash think this is a valid HTML element
var mockElement = [];
mockElement.nodeType = 1;

global.document = {};
document.getElementById = function() {
	return mockElement;
};

describe( "Creating an App", function() {
	it( "throws an error when no args are given", function() {
		expect( App ).toThrowError( MissingArgument );
	} );

	it( "throws on an empty args object", function() {
		expect( function() {
			new App( {} );
		} ).toThrowError( MissingArgument );
	} );

	it( "throws on an invalid targets argument", function() {
		expect( function() {
			new App( {
				callbacks: {
					getData: function() {
						return {};
					},
				},
			} );
		} ).toThrowError( MissingArgument );
	} );

	it( "throws on a missing getData callback", function() {
		expect( function() {
			new App( {
				targets: {
					snippet: "snippetID",
					output: "outputID",
				},
			} );
		} ).toThrowError( MissingArgument );
	} );

	it( "throws on a missing snippet preview", function() {
		expect( function() {
			new App( {
				targets: {
					output: "outputID",
				},
				callbacks: {
					getData: function() {
						return {};
					},
				},
			} );
		} ).toThrowError( MissingArgument );
	} );

	it( "accepts a Snippet Preview object", function() {
		new App( {
			targets: {
				output: "outputID",
			},
			callbacks: {
				getData: function() {
					return {};
				},
			},
			snippetPreview: new SnippetPreview( {
				targetElement: mockElement,
			} ),
		} );
	} );

	it( "should work without an output ID", function() {
		new App( {
			targets: {
				snippet: "snippetID",
			},
			callbacks: {
				getData: function() {
					return {};
				},
			},
		} );
	} );

	it( "works with correct arguments", function() {
		new App( {
			targets: {
				snippet: "snippetID",
				output: "outputID",
			},
			callbacks: {
				getData: function() {
					return {};
				},
			},
		} );
	} );
} );
