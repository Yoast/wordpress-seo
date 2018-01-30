var urlStopwords = require( "../../js/researches/stopWordsInUrl.js" );
var Paper = require( "../../js/values/Paper.js" );

describe( "Checks the URL for stopwords", function() {
	it("returns any stopwords found", function() {
		expect( urlStopwords( new Paper("Sample", { url: "before-and-after" }) ) ).toEqual( [ "after", "and", "before" ] );
		expect( urlStopwords( new Paper("Sample", { url: "before-after" }) ) ).toEqual( [ "after", "before" ] );
		expect( urlStopwords( new Paper("Sample", { url: "stopword-after" }) ) ).toEqual( [ "after" ] );
		expect( urlStopwords( new Paper("Sample", { url: "stopword" }) ) ).toEqual( [  ] );
		expect( urlStopwords( new Paper("Sample", { url: "" }) ) ).toEqual( [  ] );
	});
});
