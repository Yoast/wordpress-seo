import urlIsTooLong from '../../src/researches/urlIsTooLong.js';
import Paper from '../../src/values/Paper.js';

describe( "Checks length of Url", function() {
	it( "is too long", function() {
		var paper = new Paper( "", {
			url: "new-very-very-very-very-very-very-lengthy-url",
			keyword: "keyword",
		} );

		expect( urlIsTooLong( paper ) ).toBe( true );
	} );

	it( "is not too long", function() {
		var paper = new Paper( "", {
			url: "short url",
			keyword: "keyword",
		} );

		expect( urlIsTooLong( paper ) ).toBe( false );
	} );
} );
