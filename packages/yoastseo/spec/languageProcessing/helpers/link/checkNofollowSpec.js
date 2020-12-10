import linkFollowFunction from "../../../../src/languageProcessing/helpers/link/checkNofollow.js";

describe( "checks if link has nofollow attribute", function() {
	it( "returns dofollow or nofollow", function() {
		expect( linkFollowFunction( "<a href='test' rel='nofollow'>test</a>" ) ).toBe( "Nofollow" );
		expect( linkFollowFunction( "<a href='test' rel=\"stylesheet\" >test</a>" ) ).toBe( "Dofollow" );
		expect( linkFollowFunction( "<a href='test'>test</a>" ) ).toBe( "Dofollow" );
	} );
} );
