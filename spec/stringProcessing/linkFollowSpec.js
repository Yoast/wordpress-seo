var linkFollowFunction = require( "../../js/stringProcessing/checkNofollow.js" );

describe( "checks if link has nofollow attribute", function(){
	it( "returns dofollow or nofollow", function(){
		expect( linkFollowFunction( "<a href='test' rel='nofollow'>test</a>" ) ).toBe( "Nofollow" );
		expect( linkFollowFunction( "<a href='test'>test</a>" ) ).toBe( "Dofollow" );
	});
});
