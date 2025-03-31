import { beforeAll, describe, expect, jest, test } from "@jest/globals";
import { waitFor, render } from "@testing-library/react";
import { WidgetFactory } from "../../src/services/widget-factory";
import { MockDataProvider } from "../__mocks__/data-provider";
import { FakeDataFormatter } from "../__mocks__/fake-data-formatter";
import { MockRemoteDataProvider } from "../__mocks__/remote-data-provider";

// Mock the Chart.js library. Preventing the error:
// > Error: Not implemented: HTMLCanvasElement.prototype.getContext (without installing the canvas npm package).
// Note: this also prevents the canvas from being rendered.
jest.mock( "chart.js" );
jest.mock( "react-chartjs-2" );

describe( "WidgetFactory", () => {
	let widgetFactory;
	let dataProvider;
	let remoteDataProvider;
	let dataFormatters;
	beforeAll( () => {
		dataProvider = new MockDataProvider( {
			siteKitConfiguration: {
				isFeatureEnabled: true,
				connectionStepsStatuses: {
					isInstalled: true,
					isActive: true,
					isSetupCompleted: true,
				},
			},
		} );
		remoteDataProvider = new MockRemoteDataProvider( {} );
		dataFormatters = {
			comparisonMetricsDataFormatter: new FakeDataFormatter( { locale: "en-US" } ),
			plainMetricsDataFormatter: new FakeDataFormatter( { locale: "en-US" } ),
		};
		widgetFactory = new WidgetFactory( dataProvider, remoteDataProvider, dataFormatters );
	} );

	describe( "types", () => {
		test.each( [
			"seoScores",
			"readabilityScores",
			"topPages",
			"topQueries",
			"organicSessions",
			"searchRankingCompare",
		] )( "should have the widget type: %s", async( type ) => {
			expect( widgetFactory.types[ type ] ).toBe( type );
		} );
	} );

	test.each( [
		[ "SEO scores", { id: "seo-scores-widget", type: "seoScores" }, "SEO scores" ],
		[ "Readability scores", { id: "readability-scores-widget", type: "readabilityScores" }, "Readability scores" ],
		[ "Top pages", { id: "top-pages-widget", type: "topPages" }, "Top 5 most popular content" ],
		[ "Top queries", { id: "top-queries-widget", type: "topQueries" }, "Top 5 search queries" ],
		[ "Search Ranking compare", { id: "search-ranking-compare-widget", type: "searchRankingCompare" }, "" ],
		[ "Organic sessions", { id: "organic-sessions-widget", type: "organicSessions" }, "Organic sessions" ],
		[ "Unknown", { id: undefined, type: "unknown" }, undefined ],
	] )( "should create a %s widget", async( _, widget, title ) => {
		const element = widgetFactory.createWidget( widget );
		expect( element?.key ).toBe( widget.id );
		const { getByRole } = render( <>{ element }</> );

		await waitFor( () => {
			// Verify the title is present.
			if ( title ) {
				expect( getByRole( "heading", { name: title } ) ).toBeInTheDocument();
			}
		} );
	} );
} );
