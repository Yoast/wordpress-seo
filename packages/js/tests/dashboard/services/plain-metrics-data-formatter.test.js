import { describe, expect } from "@jest/globals";
import { PlainMetricsDataFormatter } from "../../../src/dashboard/services/plain-metrics-data-formatter";

describe( "PlainMetricsDataFormatter", () => {
	// Use variable here so the memory address stays the same, so we can keep testing with toBe.
	const testData = { foo: "bar" };

	test.each( [
		[ "subject for topPages, dropping protocol and hostname", "subject", { widget: "topPages" }, "http://example.com/foo", "/foo" ],
		[
			"subject for topPages, dropping: protocol, hostname, port, search and hash",
			"subject",
			{ widget: "topPages" },
			"https://user:password@www.example.com:8080/foo?query=bar#baz",
			"/foo",
		],
		[ "subject for topPages, not a URL", "subject", { widget: "topPages" }, "foo", "foo" ],
		[ "subject for topQueries", "subject", { widget: "topQueries" }, "foo", "foo" ],
		[ "subject for topQueries, number to string", "subject", { widget: "topQueries" }, 1234, "1234" ],
		[ "subject for topQueries, boolean to string", "subject", { widget: "topQueries" }, true, "true" ],
		[ "subject for topQueries, object to string", "subject", { widget: "topQueries" }, { working: "not really" }, "[object Object]" ],
		[ "subject without context", "subject", {}, testData, testData ],
		[ "clicks", "clicks", { widget: "topPages" }, 1234, "1,234" ],
		[ "clicks", "clicks", { widget: "topPages" }, 1234, "1,234" ],
		[ "clicks, negative number in string", "clicks", { widget: "topPages" }, "-10", "-10" ],
		[ "clicks, not a number", "clicks", { widget: "topPages" }, {}, "NaN" ],
		[ "clicks, Dutch => different separator", "clicks", { widget: "topPages" }, 1234, "1.234", "nl-NL" ],
		[ "impressions", "impressions", { widget: "topPages" }, 1_234_567, "1,234,567" ],
		[ "ctr, rounded up", "ctr", { widget: "topPages" }, 0.345678, "34.57%" ],
		[ "ctr, rounded down", "ctr", { widget: "topPages" }, 0.00144, "0.14%" ],
		[ "ctr, zero padding", "ctr", { widget: "topPages" }, 0, "0.00%" ],
		[ "difference, rounded up", "difference", { widget: "organicSessions" }, 0.345678, "34.57%" ],
		[ "position, rounded up", "position", { widget: "topPages" }, 6548.567, "6,548.57" ],
		[ "position, rounded down", "position", { widget: "topPages" }, 1.234, "1.23" ],
		[ "position, zero padding", "position", { widget: "topPages" }, 1, "1.00" ],
		[ "position, Dutch => different separator", "position", { widget: "topPages" }, 6548.567, "6.548,57", "nl-NL" ],
		[ "seoScore", "seoScore", { widget: "topPages" }, "ok", "ok" ],
		[ "seoScore", "seoScore", { widget: "topPages" }, "foo", "notAnalyzed" ],
		[ "unknown name", "unknown", { widget: "topPages" }, "foo", "foo" ],
	] )( "should format %s", ( _, name, context, data, expected, locale = "en-US" ) => {
		const formatter = new PlainMetricsDataFormatter( { locale } );

		expect( formatter.format( data, name, context ) ).toBe( expected );
	} );
} );
