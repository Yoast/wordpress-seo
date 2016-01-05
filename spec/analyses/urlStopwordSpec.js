var urlStopwords = require( "../../js/analyses/checkUrlForStopwords.js" );

describe( "Checks the URL for stopwords", function(){
	it("returns any stopwords found", function(){
		expect( urlStopwords( "before-and-after" ) ).toEqual( [ "after", "and", "before" ] );
		expect( urlStopwords( "before-after" ) ).toEqual( [ "after", "before" ] );
		expect( urlStopwords( "stopword-after" ) ).toEqual( [ "after" ] );
		expect( urlStopwords( "stopword" ) ).toEqual( [  ] );
		expect( urlStopwords( "" ) ).toEqual( [  ] );
	});
});
