import { describe, expect } from "@jest/globals";
import { ComparisonMetricsDataFormatter } from "../../src/services/comparison-metrics-data-formatter";

describe( "ComparisonMetricsDataFormatter", () => {
	test.each( [
		[ " impressions", "impressions", {}, { value: 1234, delta: 0.567 }, { formattedValue: "1,234", delta: 0.567, formattedDelta: "56.70%" } ],
		[ " impressions with fractional value rounded down", "impressions", {}, { value: 1234.2, delta: 0.567 }, { formattedValue: "1,234", delta: 0.567, formattedDelta: "56.70%" } ],
		[ "clicks", "clicks", {}, { value: 1234, delta: 0.567 }, { formattedValue: "1,234", delta: 0.567, formattedDelta: "56.70%" } ],
		[ "clicks with fractional value rounded up", "clicks", {}, { value: 1234.8, delta: 0.567 }, { formattedValue: "1,235", delta: 0.567, formattedDelta: "56.70%" } ],
		[ "ctr", "ctr", {}, { value: 0.1234, delta: 0.567 }, { formattedValue: "12.34%", delta: 0.567, formattedDelta: "56.70%" } ],
		[ "position", "position", {}, { value: 1234.567, delta: 1 }, { formattedValue: "1,234.57", delta: 1, formattedDelta: "100.00%" } ],
		[ "position with negative delta", "position", {}, { value: 1234.567, delta: -0.41 }, { formattedValue: "1,234.57", delta: -0.41, formattedDelta: "-41.00%" } ],
		[ "non-existent metric", "non-existent", {}, { value: 1234.567, delta: -0.41 }, { value: 1234.567, delta: -0.41 } ],
		[ "date", "date", { widget: "organicSessions" }, "20250304", "Mar 4" ],
		[ "sessions", "sessions", { widget: "organicSessions" }, 20_250_304.12, "20,250,304" ],
		[ "sessions, NaN becomes zero", "sessions", { widget: "organicSessions" }, NaN, "0" ],
		[ "sessions, undefined becomes zero", "sessions", { widget: "organicSessions" }, undefined, "0" ],
		[ "sessions, null becomes zero", "sessions", { widget: "organicSessions" }, null, "0" ],
		[ "difference, rounded up", "difference", { widget: "organicSessions" }, 0.345678, "34.57%" ],
	] )( "should format %s", ( _, name, context, data, expected, locale = "en-US" ) => {
		const formatter = new ComparisonMetricsDataFormatter( { locale } );
		expect( formatter.format( data, name, context ) ).toStrictEqual( expected );
	} );
} );
