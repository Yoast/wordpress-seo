import Researcher from "../../src/languageProcessing/AbstractResearcher";
import Paper from "../../src/values/Paper.js";
import InvalidTypeError from "../../src/errors/invalidType.js";
import MissingArgument from "../../src/errors/missingArgument";


describe( "Creating a Researcher", function() {
	it( "returns an instantiation", function() {
		const researcher = new Researcher( new Paper( "This is a paper!" ) );

		expect( researcher.paper.getText() ).toBe( "This is a paper!" );
		expect( researcher.paper.getKeyword() ).toBe( "" );
	} );
} );

describe( "Calling a Research", function() {
	const researcher = new Researcher( new Paper( "This is another paper!" ) );

	it( "throws an error if no research name is given", function() {
		expect( function() {
			researcher.getResearch( "" );
		} ).toThrowError( MissingArgument );
	} );

	it( "returns false if an unknown research name is given", function() {
		expect( researcher.getResearch( "foobar" ) ).toBeFalsy();
	} );

	it( "returns a word count result when calling the wordCountInText research", function() {
		expect( researcher.getResearch( "wordCountInText" ).count ).toEqual( 4 );
	} );
} );

describe( "Calling a helper", function() {
	const researcher = new Researcher( new Paper( "This is another paper!" ) );

	it( "returns false if an unknown helper name is given", function() {
		expect( researcher.getHelper( "foobar" ) ).toBeFalsy();
	} );

	it( "returns an array of sentences when calling the memoizedTokenizer helper", function() {
		expect( researcher.getHelper( "memoizedTokenizer" )( "One sentence. Another sentence." ) )
			.toEqual( [ "One sentence.", "Another sentence." ] );
	} );
} );

describe( "Adding a research to a Researcher", function() {
	const researcher = new Researcher( new Paper( "This is another paper!" ) );

	it( "throws an error if no name is given", function() {
		expect( function() {
			researcher.addResearch( "", function() {} );
		} ).toThrowError( MissingArgument );

		expect( Object.keys( researcher.customResearches ).length ).toEqual( 0 );
	} );

	it( "throws an error if no function is given", function() {
		expect( function() {
			researcher.addResearch( "foobar", null );
		} ).toThrowError( InvalidTypeError );

		expect( Object.keys( researcher.customResearches ).length ).toEqual( 0 );
	} );

	it( "adds a research to the custom researches object", function() {
		expect( Object.keys( researcher.customResearches ).length ).toEqual( 0 );
		researcher.addResearch( "foo", function() {
			return true;
		} );
		expect( Object.keys( researcher.customResearches ).length ).toEqual( 1 );
	} );

	it( "overwrites a research in the custom researches object", function() {
		expect( Object.keys( researcher.customResearches ).length ).toEqual( 1 );
		researcher.addResearch( "foo", function() {
			return false;
		} );
		expect( Object.keys( researcher.customResearches ).length ).toEqual( 1 );
	} );

	it( "overwrites a research in the default researches object with a custom one with the same name", function() {
		const currentDefaultsLength = Object.keys( researcher.defaultResearches ).length;
		const currentCustomLength = Object.keys( researcher.customResearches ).length;
		const totalLength = currentDefaultsLength + currentCustomLength;

		expect( Object.keys( researcher.getAvailableResearches() ).length ).toEqual( totalLength );
		researcher.addResearch( "wordCountInText", function() {
			return {
				count: 9000,
				unit: "character",
			};
		} );
		expect( Object.keys( researcher.getAvailableResearches() ).length ).toEqual( totalLength );
		expect( researcher.getResearch( "wordCountInText" ).count ).toEqual( 9000 );
	} );
} );

describe( "Adding a custom helper to a Researcher", function() {
	const researcher = new Researcher( new Paper( "This is another paper!" ) );

	it( "throws an error if no name is given", function() {
		expect( function() {
			researcher.addHelper( "", function() {} );
		} ).toThrowError( MissingArgument );

		expect( Object.keys( researcher.helpers ).length ).toEqual( 1 );
	} );

	it( "throws an error if no function is given", function() {
		expect( function() {
			researcher.addHelper( "foobar", null );
		} ).toThrowError( InvalidTypeError );

		expect( Object.keys( researcher.helpers ).length ).toEqual( 1 );
	} );

	it( "adds a helper to the helpers object", function() {
		expect( Object.keys( researcher.helpers ).length ).toEqual( 1 );
		researcher.addHelper( "foo", function() {
			return true;
		} );
		expect( Object.keys( researcher.helpers ).length ).toEqual( 2 );
	} );

	it( "overwrites a helper in the helpers object", function() {
		expect( Object.keys( researcher.helpers ).length ).toEqual( 2 );
		researcher.addHelper( "foo", function() {
			return false;
		} );
		expect( Object.keys( researcher.helpers ).length ).toEqual( 2 );
	} );
} );

describe( "Retrieving config", function() {
	const researcher = new Researcher( new Paper( "This is another paper!" ) );

	it( "returns false if an unknown config name is given", function() {
		expect( researcher.getConfig( "foobar" ) ).toBeFalsy();
	} );

	it( "returns whether hyphens should be word boundaries", function() {
		expect( researcher.getConfig( "areHyphensWordBoundaries" ) )
			.toEqual( true );
	} );
} );

describe( "Adding a custom config to a Researcher", function() {
	const researcher = new Researcher( new Paper( "This is another paper!" ) );

	it( "throws an error if no name is given", function() {
		expect( function() {
			researcher.addConfig( "", {} );
		} ).toThrowError( MissingArgument );

		expect( Object.keys( researcher.config ).length ).toEqual( 1 );
	} );

	it( "throws an error if an empty object is given as the config", function() {
		expect( function() {
			researcher.addConfig( "pets", {} );
		} ).toThrowError( MissingArgument );

		expect( Object.keys( researcher.config ).length ).toEqual( 1 );
	} );

	it( "throws an error if no config is given", function() {
		expect( function() {
			researcher.addConfig( "pets" );
		} ).toThrowError( MissingArgument );

		expect( Object.keys( researcher.config ).length ).toEqual( 1 );
	} );

	it( "adds a config to the config object", function() {
		expect( Object.keys( researcher.config ).length ).toEqual( 1 );
		const petsList1 = [ "cats", "dogs", "rabbits" ];
		researcher.addConfig( "pets", petsList1 );
		expect( Object.keys( researcher.config ).length ).toEqual( 2 );
		expect( researcher.getConfig( "pets" ) ).toEqual( petsList1 );
	} );

	it( "overwrites a config in the config object", function() {
		expect( Object.keys( researcher.config ).length ).toEqual( 2 );
		const petsList2 = [ "birds", "horses", "tortoise" ];

		researcher.addConfig( "pets", petsList2 );
		expect( Object.keys( researcher.config ).length ).toEqual( 2 );
		expect( researcher.hasConfig( "pets" ) ).toBeTruthy();
		expect( researcher.getConfig( "pets" ) ).toEqual( petsList2 );
		expect( researcher.getAvailableConfig() ).toEqual( {
			areHyphensWordBoundaries: true,
			pets: [ "birds", "horses", "tortoise" ],
		} );
	} );
} );

describe( "Adding and getting researchData to/from a Researcher", function() {
	const researcher = new Researcher( new Paper( "This is another paper!" ) );

	it( "adds a research data provider", function() {
		researcher.addResearchData( "newResearch", "some data" );
		expect( researcher.getData( "newResearch" ) ).toEqual( "some data" );
	} );
} );
