import englishAbbreviations from "../../../../../src/languageProcessing/languages/en/config/abbreviations";

describe( "tests if all abbreviations end with a fullstop", function() {
	englishAbbreviations.forEach( ( abbreviation ) =>{
		it( abbreviation + " should end with a fullstop", function() {
			const lastChar = abbreviation.substr( abbreviation.length - 1 );
			expect( lastChar ).toBe( "." );
		} );
	} );
} );

describe( "tests if there are no duplicates in the abbreviations list", function() {
	englishAbbreviations.forEach( ( abbreviation ) =>{
		it( abbreviation + " should occur once in the list", function() {
			expect( englishAbbreviations.filter( x => x === abbreviation ).length ).toBe( 1 );
		} );
	} );
} );

describe( "tests if there are no one-letter abbreviations in the abbreviations list", function() {
	englishAbbreviations.forEach( ( abbreviation ) =>{
		it( abbreviation + " should have more than one letter", function() {
			expect( abbreviation.length ).toBeGreaterThan( 2 );
		} );
	} );
} );
