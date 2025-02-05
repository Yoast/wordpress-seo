import { describe, expect } from "@jest/globals";
import { DataFormatter } from "../../../src/dashboard/services/data-formatter";

describe( "DataFormatter", () => {
	test.each( [
		[ "subject, dropping protocol", "subject", "http://example.com/foo", "example.com/foo" ],
		[
			"subject, dropping: protocol, port, search and hash",
			"subject",
			"https://user:password@www.example.com:8080/foo?query=bar#baz",
			"www.example.com/foo",
		],
		[ "subject, not a URL", "subject", "foo", "foo" ],
		[ "clicks", "clicks", 1234, "1,234" ],
		[ "clicks, negative number in string", "clicks", "-10", "-10" ],
		[ "clicks, not a number", "clicks", {}, "NaN" ],
		[ "clicks, Dutch => different separator", "clicks", 1234, "1.234", "nl-NL" ],
		[ "impressions", "impressions", 1_234_567, "1,234,567" ],
		[ "ctr, rounded up", "ctr", 0.345678, "34.57%" ],
		[ "ctr, rounded down", "ctr", 0.00144, "0.14%" ],
		[ "ctr, zero padding", "ctr", 0, "0.00%" ],
		[ "position, rounded up", "position", 6548.567, "6,548.57" ],
		[ "position, rounded down", "position", 1.234, "1.23" ],
		[ "position, zero padding", "position", 1, "1.00" ],
		[ "position, Dutch => different separator", "position", 6548.567, "6.548,57", "nl-NL" ],
		[ "seoScore", "seoScore", "ok", "ok" ],
		[ "seoScore", "seoScore", "foo", "notAnalyzed" ],
		[ "unknown name", "unknown", "foo", "foo" ],
	] )( "should format %s", ( _, name, data, expected, locale = "en-US" ) => {
		const formatter = new DataFormatter( { locale } );

		expect( formatter.format( data, name, { widget: "topPages" } ) ).toBe( expected );
	} );
} );
