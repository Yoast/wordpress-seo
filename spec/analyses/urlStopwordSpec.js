var urlStopwords = require( "../../js/analyses/checkUrlForStopwords.js" );

describe( "Checks the URL for stopwords", function(){
	it("returns any stopwords found", function(){
		expect( urlStopwords( "before-and-after" ) ).toContain( "before" );
		expect( urlStopwords( "before-and-after" ) ).toContain( "after" );
		expect( urlStopwords( "before-after" ) ).toContain( "before" );
		expect( urlStopwords( "before-after" ) ).toContain( "after" );
	});
});
