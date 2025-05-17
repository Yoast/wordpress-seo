import regexMatchFunction from "../../../../src/languageProcessing/helpers/regex/matchStringWithRegex.js";

describe( "Matches text with a regex", function() {
	it( "returns the number of matches", function() {
		expect( regexMatchFunction( "<p>1</p><p>2</p>", new RegExp( "<p(?:[^>]+)?>(.*?)</p>", "ig" ) ) ).toEqual( [ "<p>1</p>", "<p>2</p>" ] );
		expect( regexMatchFunction(
			"<img class=\"alignnone size-medium wp-image-9\" src=\"test.png\" alt=\"image1\" width=\"300\" height=\"36\" />",
			new RegExp( "<img(?:[^>]+)?>", "ig" ) )
		).toEqual( [ "<img class=\"alignnone size-medium wp-image-9\" src=\"test.png\" alt=\"image1\" width=\"300\" height=\"36\" />" ] );
	} );
	it( "returns an empty array if there is no matches", function() {
		expect( regexMatchFunction( "<img class=\"alignnone size-medium wp-image-9", "<p(?:[^>]+)?>(.*?)</p>" ) ).toEqual( [] );
	} );
} );

