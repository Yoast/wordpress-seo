var regexMatchFunction = require( "../../js/stringProcessing/matchStringWithRegex.js" );

describe( "Matches text with a regex", function() {
	it( "returns the number of matches", function() {
		expect( regexMatchFunction( "<p>1</p><p>2</p>", "<p(?:[^>]+)?>(.*?)<\/p>" ) ).toEqual( [ "<p>1</p>", "<p>2</p>" ] );
		expect( regexMatchFunction( "<img class=\"alignnone size-medium wp-image-9\" src=\"test.png\" alt=\"image1\" width=\"300\" height=\"36\" />",
			"<img(?:[^>]+)?>" ) ).toEqual( [ "<img class=\"alignnone size-medium wp-image-9\" src=\"test.png\" alt=\"image1\" width=\"300\" height=\"36\" />" ] );
	} );
} );

