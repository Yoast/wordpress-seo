import { get } from "lodash";
import { beforeAll, describe, expect, jest, test } from "@jest/globals";
import { waitFor, render } from "@testing-library/react";
import { WidgetFactory } from "../../src/services/widget-factory";
import { MockDataProvider } from "../__mocks__/data-provider";
import { FakeDataFormatter } from "../__mocks__/fake-data-formatter";
import { MockRemoteDataProvider } from "../__mocks__/remote-data-provider";
import { MockRemoteCachedDataProvider } from "../__mocks__/remote-cached-data-provider";

// Mock the Chart.js library. Preventing the error:
// > Error: Not implemented: HTMLCanvasElement.prototype.getContext (without installing the canvas npm package).
// Note: this also prevents the canvas from being rendered.
jest.mock( "chart.js" );
jest.mock( "react-chartjs-2" );

describe( "WidgetFactory", () => {
	let widgetFactory;
	let dataProvider;
	let remoteDataProvider;
	let remoteCachedDataProviders;
	let dataFormatters;

	const headers = {
		"X-Wp-Nonce": get( window, "wpseoScriptData.dashboard.nonce", "" ),
	};

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
		remoteCachedDataProviders = {
			topPages: new MockRemoteCachedDataProvider( { headers }, "storagePrefix", "yoastVersion", 3600 ),
			topQueries: new MockRemoteCachedDataProvider( { headers }, "storagePrefix", "yoastVersion", 3600 ),
			organicSessions: new MockRemoteCachedDataProvider( { headers }, "storagePrefix", "yoastVersion", 3600 ),
			searchRankingCompare: new MockRemoteCachedDataProvider( { headers }, "storagePrefix", "yoastVersion", 3600 ),
		};
		dataFormatters = {
			comparisonMetricsDataFormatter: new FakeDataFormatter( { locale: "en-US" } ),
			plainMetricsDataFormatter: new FakeDataFormatter( { locale: "en-US" } ),
		};
		widgetFactory = new WidgetFactory( dataProvider, remoteDataProvider, remoteCachedDataProviders, dataFormatters );
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
		[ "SEO scores", "seoScores", "SEO scores" ],
		[ "Readability scores", "readabilityScores", "Readability scores" ],
		[ "Top pages", "topPages", "Top 5 most popular content" ],
		[ "Top queries", "topQueries", "Top 5 search queries" ],
		[ "Search Ranking compare", "searchRankingCompare", "" ],
		[ "Organic sessions", "organicSessions", "Organic sessions" ],
	] )( "should create a %s widget", async( _, widgetType, title ) => {
		const element = widgetFactory.createWidget( widgetType );
		expect( element?.key ).toBe( widgetType );
		const { getByRole } = render( <>{ element }</> );

		await waitFor( () => {
			// Verify the title is present.
			if ( title ) {
				expect( getByRole( "heading", { name: title } ) ).toBeInTheDocument();
			}
		} );
	} );

	test( "should not create a widget if the type is not supported", async() => {
		const element = widgetFactory.createWidget( "unsupportedWidgetType" );
		expect( element ).toBeNull();
	} );
} );
