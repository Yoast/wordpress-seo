import { htmlEntitiesRegex, hashedHtmlEntitiesRegexStart, hashedHtmlEntitiesRegexEnd } from "../../src/helpers/htmlEntities";

describe( "tests RegEx-es from the htmlEntities file", function() {
	it( "finds all HTML entities we support and 'hashes' them, i.e. turns the beginning '&' character to '#'", function() {
		const text = "This is our list of HTML entities we support: &amp;, and &lt;, plus &gt; & &quot;, + &apos; and &ndash;, " +
			"together with &mdash;, &copy;, &reg;, &trade;, &pound;, &yen;, &euro;, &dollar;, &deg;, then &asymp; and &ne;.";
		const expected = "This is our list of HTML entities we support: #amp;, and #lt;, plus #gt; & #quot;, + #apos; and #ndash;, " +
			"together with #mdash;, #copy;, #reg;, #trade;, #pound;, #yen;, #euro;, #dollar;, #deg;, then #asymp; and #ne;.";
		const actual = text.replace( htmlEntitiesRegex, "#$1" );
		expect( actual ).toMatch( expected );
	} );

	it( "finds and replaces a hashed HTML entity (#ne;) when it's in the beginning of a string", function() {
		const text = "#ne;This is a test";
		const expected = "♥This is a test";
		const actual = text.replace( hashedHtmlEntitiesRegexStart, "♥" );
		expect( actual ).toMatch( expected );
	} );

	it( "finds and replaces a hashed HTML entity (#ne;) when it's at the end of a string", function() {
		const text = "This is a test#ne;";
		const expected = "This is a test♥";
		const actual = text.replace( hashedHtmlEntitiesRegexEnd, "♥" );
		expect( actual ).toMatch( expected );
	} );
} );
