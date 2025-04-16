import { beforeAll, describe, expect, it, jest, test } from "@jest/globals";
import { waitFor } from "@testing-library/react";
import { WidgetFactory } from "../../../src/dashboard/services/widget-factory";
import { render } from "../../test-utils";
import { MockDataProvider } from "../__mocks__/data-provider";
import { MockDataTracker } from "../__mocks__/data-tracker";
import { FakeDataFormatter } from "../__mocks__/fake-data-formatter";
import { MockRemoteCachedDataProvider } from "../__mocks__/remote-cached-data-provider";
import { MockRemoteDataProvider } from "../__mocks__/remote-data-provider";

// Mock the Chart.js library. Preventing the error:
// > Error: Not implemented: HTMLCanvasElement.prototype.getContext (without installing the canvas npm package).
// Note: this also prevents the canvas from being rendered.
jest.mock( "chart.js" );
jest.mock( "react-chartjs-2" );

describe( "WidgetFactory", () => {
	let widgetFactory;
	let dataProvider;
	let dataTrackers;
	let remoteDataProvider;
	let remoteCachedDataProviders;
	let dataFormatters;
	beforeAll( () => {
		dataTrackers = { setupWidgetDataTracker: new MockDataTracker() };
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
			topPages: new MockRemoteCachedDataProvider( {} ),
			topQueries: new MockRemoteCachedDataProvider( {} ),
			organicSessions: new MockRemoteCachedDataProvider( {} ),
			searchRankingCompare: new MockRemoteCachedDataProvider( {} ),
		};
		dataFormatters = {
			comparisonMetricsDataFormatter: new FakeDataFormatter( { locale: "en-US" } ),
			plainMetricsDataFormatter: new FakeDataFormatter( { locale: "en-US" } ),
		};
		widgetFactory = new WidgetFactory( dataProvider, remoteDataProvider, remoteCachedDataProviders, dataFormatters, dataTrackers );
	} );

	describe( "types", () => {
		test.each( [
			"seoScores",
			"readabilityScores",
			"topPages",
			"topQueries",
			"siteKitSetup",
			"organicSessions",
			"searchRankingCompare",
		] )( "should have the widget type: %s", async( type ) => {
			expect( widgetFactory.types[ type ] ).toBe( type );
		} );
	} );

	test.each( [
		[ "SEO scores", "seoScores", "SEO scores" ],
		[ "Readability scores", "readabilityScores", "Readability scores" ],
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

	test.each( [
		[ "Top pages", "topPages", "Top 5 most popular content" ],
		[ "Top queries", "topQueries", "Top 5 search queries" ],
		[ "Search Ranking compare", "searchRankingCompare", "" ],
		[ "Organic sessions", "organicSessions", "Organic sessions" ],
	] )( "should create a %s widget (that depend on Site Kit consent)", async( _, widgetType, title ) => {
		dataProvider.setSiteKitConsentGranted( true );
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

	test.each( [
		[ "SEO scores", "seoScores" ],
		[ "Readability scores", "readabilityScores" ],
	] )( "should not create the %s widget if the data provider does not have the features", ( _, widget ) => {
		dataProvider = new MockDataProvider( {
			features: {
				indexables: false,
				seoAnalysis: false,
				readabilityAnalysis: false,
			},
		} );
		widgetFactory = new WidgetFactory( dataProvider, remoteDataProvider, remoteCachedDataProviders, dataFormatters, dataTrackers );

		expect( widgetFactory.createWidget( widget ) ).toBeNull();
	} );

	it( "should not create the Site Kit setup widget if the data provider has isSetupWidgetDismissed set to true", () => {
		dataProvider = new MockDataProvider( {
			siteKitConfiguration: { isSetupWidgetDismissed: true },
		} );
		widgetFactory = new WidgetFactory( dataProvider, remoteDataProvider, remoteCachedDataProviders, dataFormatters, dataTrackers );

		expect( widgetFactory.createWidget( "siteKitSetup" ) ).toBeNull();
	} );

	test.each( [
		[ "Top pages", "topPages" ],
		[ "Top queries", "topQueries" ],
		[ "Search ranking compare", "searchRankingCompare" ],
		[ "Site Kit setup", "siteKitSetup" ],
		[ "Organic Sessions", "organicSessions" ],
	] )( "should not create a %s widget when site kit feature is disabled", ( _, widgetType ) => {
		dataProvider = new MockDataProvider( {
			siteKitConfiguration: { isFeatureEnabled: false },
		} );
		widgetFactory = new WidgetFactory( dataProvider, remoteDataProvider, remoteCachedDataProviders, dataFormatters, dataTrackers );

		expect( widgetFactory.createWidget( widgetType ) ).toBeNull();
	} );

	describe( "should not create the site kit widgets and should create the site kit setup widget", () => {
		test.each( [
			[ "no step is completed", { isInstalled: false, isActive: false, isSetupCompleted: false, isConsentGranted: false } ],
			[ "only installed", { isInstalled: true, isActive: false, isSetupCompleted: false, isConsentGranted: false } ],
			[ "only installed and activated", { isInstalled: true, isActive: true, isSetupCompleted: false, isConsentGranted: false } ],
			[ "only consent not granted", { isInstalled: true, isActive: true, isSetupCompleted: true, isConsentGranted: false } ],
			[ "only consent granted", { isInstalled: false, isActive: false, isSetupCompleted: false, isConsentGranted: true } ],
			[
				"only site kit setup completed and consent granted",
				{ isInstalled: false, isActive: false, isSetupCompleted: true, isConsentGranted: true },
			],
			[ "only not activated", { isInstalled: true, isActive: false, isSetupCompleted: true, isConsentGranted: true } ],
			[ "only site kit setup is not completed", { isInstalled: true, isActive: true, isSetupCompleted: false, isConsentGranted: true } ],
			[
				"site kit plugin version is not supported",
				{ isInstalled: true, isActive: true, isSetupCompleted: true, isConsentGranted: true, isVersionSupported: false },
			],
		] )( "when %s", async( _, siteKitConfiguration ) => {
			const siteKitWidgets = [
				"topPages",
				"topQueries",
				"searchRankingCompare",
				"organicSessions",
			];
			dataProvider = new MockDataProvider( {
				siteKitConfiguration: { ...siteKitConfiguration, isFeatureEnabled: true },
			} );

			widgetFactory = new WidgetFactory( dataProvider, remoteDataProvider, remoteCachedDataProviders, dataFormatters, dataTrackers );
			siteKitWidgets.forEach( ( widget ) => {
				expect( widgetFactory.createWidget( widget ) ).toBeNull();
			} );

			const element = widgetFactory.createWidget( "siteKitSetup" );

			expect( element?.key ).toBe( "siteKitSetup" );
			const { getByRole } = render( <>{ element }</> );

			await waitFor( () => {
				expect( getByRole( "heading", { name: "Expand your dashboard with insights from Google!" } ) ).toBeInTheDocument();
			} );
		} );
	} );

	test.each( [
		[ "Consent not granted", { isConsentGranted: false } ],
		[ "Analytics is not connected", { isAnalyticsConnected: false } ],
		[ "no permission to view analytics data", { capabilities: { viewAnalyticsData: false } } ],
	] )( "should not create a OrganicSessions widget when %s", ( _, config ) => {
		dataProvider = new MockDataProvider( {
			siteKitConfiguration: config,
		} );
		widgetFactory = new WidgetFactory( dataProvider, remoteDataProvider, remoteCachedDataProviders, {}, dataTrackers );

		expect( widgetFactory.createWidget( { id: "organic-sessions-widget", type: "organicSessions" } ) ).toBeNull();
	} );

	test.each( [
		[ "Top pages", "topPages" ],
		[ "Top queries", "topQueries" ],
		[ "Search ranking compare", "searchRankingCompare" ],
	] )( "should not create a %s widget when a user has no view search console data permission", ( _, widget ) => {
		dataProvider = new MockDataProvider( {
			siteKitConfiguration: {
				capabilities: {
					viewSearchConsoleData: false,
				},
			},
		} );
		widgetFactory = new WidgetFactory( dataProvider, remoteDataProvider, remoteCachedDataProviders, {}, dataTrackers );

		expect( widgetFactory.createWidget( widget ) ).toBeNull();
	} );

	test( "should not create a widget if the type is not supported", async() => {
		const element = widgetFactory.createWidget( "unsupportedWidgetType" );
		expect( element ).toBeNull();
	} );
} );
