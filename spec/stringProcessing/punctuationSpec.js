var removeTerminators = require( "../../js/stringProcessing/removeTerminators.js" );

describe( "Removing terminators at the begin and end of a word", function(){
	it( "returns a word without a terminator.", function() {
		expect( removeTerminators( "word." ) ).toBe( "word" );
		expect( removeTerminators( "10.000" ) ).toBe( "10.000" );
		expect( removeTerminators( "¿que?" ) ).toBe( "que" );
		expect( removeTerminators( "word!!" ) ).toBe( "word" );
		expect( removeTerminators( "¡¡word" ) ).toBe( "word" );
		expect( removeTerminators( "'word'" ) ).toBe( "word" );
		expect( removeTerminators( "'word'!!!???!!!!" ) ).toBe( "word" );

	} );
} );
