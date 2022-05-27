import englishAbbreviations from "../../../../../src/languageProcessing/languages/en/config/abbreviations";

describe( "tests if all abbreviations end with a fullstop", function() {
	englishAbbreviations.forEach( ( abbreviation ) =>{
		it( abbreviation + "should end with a fullstop", function() {
			const lastChar = abbreviation.substr( abbreviation.length - 1 );
			expect( lastChar ).toBe( "." );
		} );
	} );
} );
