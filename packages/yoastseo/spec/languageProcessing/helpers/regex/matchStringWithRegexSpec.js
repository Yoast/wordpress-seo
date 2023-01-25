import regexMatchFunction from "../../../../src/languageProcessing/helpers/regex/matchStringWithRegex.js";

describe( "Matches text with a regex", function() {
	it( "returns the number of matches", function() {
		expect( regexMatchFunction( "<p>1</p><p>2</p>", "<p(?:[^>]+)?>(.*?)</p>" ) ).toEqual( [ "<p>1</p>", "<p>2</p>" ] );
		expect( regexMatchFunction( "<img class=\"alignnone size-medium wp-image-9\" src=\"test.png\" alt=\"image1\" width=\"300\" height=\"36\" />",
			// eslint-disable-next-line max-len
			"<img(?:[^>]+)?>" ) ).toEqual( [ "<img class=\"alignnone size-medium wp-image-9\" src=\"test.png\" alt=\"image1\" width=\"300\" height=\"36\" />" ] );
	} );
	it( "returns an empty array if there is no matches", function() {
		// eslint-disable-next-line max-len,no-useless-escape
		expect( regexMatchFunction( "<img class=\"alignnone size-medium wp-image-9", "<p(?:[^>]+)?>(.*?)<\/p>" ) ).toEqual( [] );
	} );
} );

