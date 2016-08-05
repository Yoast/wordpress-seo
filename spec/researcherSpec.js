var Researcher = require("../js/researcher.js");
var Paper = require("../js/values/Paper.js");
var InvalidTypeError = require( "../js/errors/invalidType.js" );
var MissingArgument = require( "../js/errors/missingArgument" );


describe( "Creating a Researcher", function() {
	it( "returns an instantiation", function() {
		var researcher = new Researcher( new Paper( "This is a paper!" ) );

		expect( researcher.paper.getText() ).toBe( "This is a paper!" );
		expect( researcher.paper.getKeyword() ).toBe( "" );
	} );

} );

describe( "Calling a Researcher", function() {
	var researcher = new Researcher( new Paper( "This is another paper!" ));

	it( "throws an error if no name is given", function() {
		expect( function() { researcher.getResearch( "" ) } ).toThrowError( MissingArgument );
	});

	it( "returns false if an unknown name is given", function() {
		expect( researcher.getResearch( "foobar" ) ).toBeFalsy();
	});

	it( "returns a word count result when calling the wordCountInText researcher", function() {
		expect( researcher.getResearch( "wordCountInText" ) ).toEqual( 4 );
	});
} );

describe( "Adding to a Researcher", function() {
	var researcher = new Researcher( new Paper( "This is another paper!" ));

	it( "throws an error if no name is given", function() {
		expect( function() {
			researcher.addResearch("", function() {} )
		} ).toThrowError( MissingArgument );

		expect( Object.keys( researcher.customResearches ).length ).toEqual( 0 );
	});

	it( "throws an error if no function is given", function() {
		expect( function() {
			researcher.addResearch("foobar", null )
		} ).toThrowError( InvalidTypeError );

		expect( Object.keys( researcher.customResearches ).length ).toEqual( 0 );
	});

	it( "adds a research to the custom researches object", function() {
		expect( Object.keys( researcher.customResearches ).length ).toEqual( 0 );
		researcher.addResearch("foo", function() { return true; });
		expect( Object.keys( researcher.customResearches ).length ).toEqual( 1 );
	});

	it( "overloads a research in the custom researches object", function() {
		expect( Object.keys( researcher.customResearches ).length ).toEqual( 1 );
		researcher.addResearch("foo", function() { return false; });
		expect( Object.keys( researcher.customResearches ).length ).toEqual( 1 );
	});

	it( "overloads a research in the default researches object with a custom one with the same name", function() {
		var currentDefaultsLength = Object.keys( researcher.defaultResearches ).length;
		var currentCustomLength = Object.keys( researcher.customResearches ).length;
		var totalLength = currentDefaultsLength + currentCustomLength;

		expect( Object.keys( researcher.getAvailableResearches() ).length ).toEqual( totalLength );
		researcher.addResearch("wordCountInText", function() { return 9000; });
		expect( Object.keys( researcher.getAvailableResearches() ).length ).toEqual( totalLength );
		expect( researcher.getResearch( "wordCountInText" ) ).toEqual( 9000 )
	});
} );
