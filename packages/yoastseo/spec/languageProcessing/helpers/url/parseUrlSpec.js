import parseUrl from "../../../../src/languageProcessing/helpers/url/parseUrl";

describe( "parseUrl", function() {
	it.each( [
		[ "https://Example.COM/path?x=1#top", { protocol: "https:", hostname: "example.com", hash: "#top" } ],
		[ "  http://example.com  ", { protocol: "http:", hostname: "example.com", hash: null } ],
		[ "http://example.com/page#", { protocol: "http:", hostname: "example.com", hash: "#" } ],
		[ "http://münchen.de/", { protocol: "http:", hostname: "xn--mnchen-3ya.de", hash: null } ],
		[ "http://user:pass@example.com:8080/", { protocol: "http:", hostname: "example.com", hash: null } ],
		[ "http:\\\\example.com", { protocol: "http:", hostname: "example.com", hash: null } ],
		[ "http://[::1]/article", { protocol: "http:", hostname: "::1", hash: null } ],
		[ "https://[2001:DB8::1]:8080/page", { protocol: "https:", hostname: "2001:db8::1", hash: null } ],
		[ "/page", { protocol: null, hostname: null, hash: null } ],
		[ "../page#top", { protocol: null, hostname: null, hash: "#top" } ],
		[ "example.com/page", { protocol: null, hostname: null, hash: null } ],
		[ "//example.com/page", { protocol: null, hostname: null, hash: null } ],
		[ "http:example.com", { protocol: "http:", hostname: null, hash: null } ],
		[ "http:/example.com", { protocol: "http:", hostname: null, hash: null } ],
		[ "mailto:info@example.com", { protocol: "mailto:", hostname: null, hash: null } ],
		[ "", { protocol: null, hostname: null, hash: null } ],
	] )( "parses %j", function( input, expected ) {
		expect( parseUrl( input ) ).toEqual( expected );
	} );

	it( "parses the host of a protocol-relative URL when slashes denote the host", function() {
		expect( parseUrl( "//Example.com/page", true ) ).toEqual( { protocol: null, hostname: "example.com", hash: null } );
	} );

	it( "does not parse a host for three slashes when slashes denote the host", function() {
		expect( parseUrl( "///page", true ) ).toEqual( { protocol: null, hostname: null, hash: null } );
	} );

	it( "keeps the raw host of an invalid URL", function() {
		expect( parseUrl( "http://Exa mple.com/page" ) ).toEqual( { protocol: "http:", hostname: "exa mple.com", hash: null } );
	} );
} );
