import functionWords from '../../../src/researches/german/functionWords.js';

describe( "a test for the existence of the properties of functionWords", function() {
	it( "returns true for all of its properties", function() {
		expect( functionWords().hasOwnProperty( "filteredAtBeginning" ) ).toBe( true );
		expect( functionWords().hasOwnProperty( "filteredAtEnding" ) ).toBe( true );
		expect( functionWords().hasOwnProperty( "filteredAtBeginningAndEnding" ) ).toBe( true );
		expect( functionWords().hasOwnProperty( "filteredAnywhere" ) ).toBe( true );
		expect( functionWords().hasOwnProperty( "all" ) ).toBe( true );
	} );

	it( "returns false for a non-existing property", function() {
		expect( functionWords().hasOwnProperty( "fakeProperty" ) ).toBe( false );
	} );
} );
