var linkTypeFunction = require( "../../js/stringProcessing/linkType.js" );

describe( "checks type of link", function(){
	it( "returns linktype", function(){
		expect( linkTypeFunction( "http://yoast.com", "yoast.com" ) ).toBe( "internal" );
		expect( linkTypeFunction( "http://yoast.com", "example.com" ) ).toBe( "external" );
		expect( linkTypeFunction( "ftp://yoast.com", "yoast.com" ) ).toBe( "other" );
	});
});
