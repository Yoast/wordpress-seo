import MissingArgument from "../src/errors/missingArgument.js";
import App from "../src/app.js";
import Factory from "../src/helpers/factory";

// Mock these function to prevent us from needing an actual DOM in the tests.
App.prototype.showLoadingDialog = function() {};
App.prototype.updateLoadingDialog = function() {};
App.prototype.removeLoadingDialog = function() {};
App.prototype.runAnalyzer = function() {};

// Makes lodash think this is a valid HTML element
const mockElement = [];
mockElement.nodeType = 1;

global.document = {};
document.getElementById = function() {
	return mockElement;
};

const researcher = Factory.buildMockResearcher( {}, true, false );

describe( "Creating an App", function() {
	it( "throws an error when no args are given", function() {
		expect( () => new App() ).toThrow( MissingArgument );
	} );

	it( "throws on an empty args object", function() {
		expect( () => new App( {} ) ).toThrow( MissingArgument );
	} );

	it( "throws on an invalid targets argument", function() {
		expect( function() {
			new App( {
				callbacks: {
					getData: () => {
						return {};
					},
				},
			} );
		} ).toThrow( MissingArgument );
	} );

	it( "throws on a missing getData callback", function() {
		expect( function() {
			new App( {
				targets: {
					snippet: "snippetID",
					output: "outputID",
				},
			} );
		} ).toThrow( MissingArgument );
	} );

	it( "throws on a missing researcher argument", function() {
		expect( function() {
			new App( {
				targets: {
					snippet: "snippetID",
					output: "outputID",
				},
			} );
		} ).toThrow( MissingArgument );
	} );

	it( "should work without an output ID", function() {
		new App( {
			targets: {
				snippet: "snippetID",
			},
			callbacks: {
				getData: () => {
					return {};
				},
			},
			researcher: researcher,
		} );
	} );

	it( "works with correct arguments", function() {
		new App( {
			targets: {
				snippet: "snippetID",
				output: "outputID",
			},
			callbacks: {
				getData: () => {
					return {};
				},
			},
			researcher: researcher,
		} );
	} );
} );
