var regexMatchFunction = require ( "../../js/stringProcessing/matchStringWithRegex.js" );

describe( "Matches text with a regex", function(){
	it("returns the number of matches", function(){
		expect( regexMatchFunction( "<p>1</p><p>2</p>", "<p(?:[^>]+)?>(.*?)<\/p>" ) ).toEqual( ["<p>1</p>", "<p>2</p>"] );
	});
});

