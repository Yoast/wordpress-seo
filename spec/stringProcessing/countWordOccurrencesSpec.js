var countWordOccurrences = require( "../../js/stringProcessing/countWordOccurrences.js" );

describe( "Counts words in text and returns occurrences", function(){
	it( "returns counts", function() {
		expect( countWordOccurrences( "this is a text", "text", "en_EN") ).toBe( 1 );
		expect( countWordOccurrences( "this is a text", "thïs", "nl_NL") ).toBe( 1 );
		expect( countWordOccurrences( "this is a text text", "text", "nl_NL") ).toBe( 2 );
	} );
} );
