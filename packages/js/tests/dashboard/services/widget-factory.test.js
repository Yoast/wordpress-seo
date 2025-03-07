import { beforeAll, describe, expect, it, jest, test } from "@jest/globals";
import { waitFor } from "@testing-library/react";
import { WidgetFactory } from "../../../src/dashboard/services/widget-factory";
import { render } from "../../test-utils";
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
				isInstalled: true,
				isActive: true,
				isSetupCompleted: true,
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
			"siteKitSetup",
			"organicSessions",
			"searchRankingCompare",
		] )( "should have the widget type: %s", async( type ) => {
			expect( WidgetFactory.types[ type ] ).toBe( type );
		} );
	} );

	test.each( [
		[ "Top pages", { id: "top-pages-widget", type: "topPages" } ],
		[ "Top queries", { id: "top-queries-widget", type: "topQueries" } ],
		[ "Search Ranking compare", { id: "search-ranking-compare-widget", type: "searchRankingCompare" } ],
		[ "Organic sessions", { id: "organic-sessions-widget", type: "organicSessions" } ],
	] )( "should not create a %s widget when site kit is not connected", async( _, widget ) => {
		dataProvider.setSiteKitConsentGranted( false );
		widgetFactory = new WidgetFactory( dataProvider, remoteDataProvider, dataFormatters );
		expect( widgetFactory.createWidget( widget ) ).toBeNull();
	} );

	test.each( [
		[ "SEO scores", { id: "seo-scores-widget", type: "seoScores" }, "SEO scores" ],
		[ "Readability scores", { id: "readability-scores-widget", type: "readabilityScores" }, "Readability scores" ],
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

	test.each( [
		[ "Top pages", { id: "top-pages-widget", type: "topPages" }, "Top 5 most popular content" ],
		[ "Top queries", { id: "top-queries-widget", type: "topQueries" }, "Top 5 search queries" ],
		[ "Organic sessions", { id: "organic-sessions-widget", type: "organicSessions" }, "Organic sessions" ],
	] )( "should create a %s widget", async( _, widget, title ) => {
		dataProvider.setSiteKitConsentGranted( true );
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

	test.each( [
		[ "SEO scores", { id: "seo-scores-widget", type: "seoScores" } ],
		[ "Readability scores", { id: "readability-scores-widget", type: "readabilityScores" } ],
	] )( "should not create the %s widget if the data provider does not have the features", ( _, widget ) => {
		dataProvider = new MockDataProvider( {
			features: {
				indexables: false,
				seoAnalysis: false,
				readabilityAnalysis: false,
			},
		} );
		widgetFactory = new WidgetFactory( dataProvider, remoteDataProvider, dataFormatters );

		expect( widgetFactory.createWidget( widget ) ).toBeNull();
	} );

	it( "should not create the Site Kit setup widget if the data provider has isSetupWidgetDismissed set to true", () => {
		dataProvider = new MockDataProvider( {
			siteKitConfiguration: { isSetupWidgetDismissed: true },
		} );
		widgetFactory = new WidgetFactory( dataProvider, remoteDataProvider, dataFormatters );

		expect( widgetFactory.createWidget( { id: "site-kite-setup-widget", type: "siteKitSetup" } ) ).toBeNull();
	} );

	test.each( [
		[ "Top pages", { id: "top-pages-widget", type: "topPages" } ],
		[ "Top queries", { id: "top-queries-widget", type: "topQueries" } ],
		[ "searchRankingCompare", { id: "search-ranking-compare-widget", type: "searchRankingCompare" } ],
		[ "Site Kit setup", { id: "site-kite-setup-widget", type: "siteKitSetup" } ],
		[ "Organic Sessions", { id: "organic-sessions-widget", type: "organicSessions" } ],
	] )( "should not create a %s widget when site kit feature is disabled", ( _, widget ) => {
		dataProvider = new MockDataProvider( {
			siteKitConfiguration: { isFeatureEnabled: false },
		} );
		widgetFactory = new WidgetFactory( dataProvider, remoteDataProvider, dataFormatters );

		expect( widgetFactory.createWidget( widget ) ).toBeNull();
	} );

	describe( "should not create the site kit widgets and should create the site kit setup widget", () => {
		test.each( [
			[ "no step is completed", { isInstalled: false, isActive: false, isSetupCompleted: false, isConsentGranted: false } ],
			[ "only installed", { isInstalled: true, isActive: false, isSetupCompleted: false, isConsentGranted: false } ],
			[ "only installed and activated", { isInstalled: true, isActive: true, isSetupCompleted: false, isConsentGranted: false } ],
			[ "only not connected", { isInstalled: true, isActive: true, isSetupCompleted: true, isConsentGranted: false } ],
			[ "only connected", { isInstalled: false, isActive: false, isSetupCompleted: false, isConsentGranted: true } ],
			[
				"only site kit setup completed and connected",
				{ isInstalled: false, isActive: false, isSetupCompleted: true, isConsentGranted: true },
			],
			[ "only not activated", { isInstalled: true, isActive: false, isSetupCompleted: true, isConsentGranted: true } ],
			[ "only site kit setup is not completed", { isInstalled: true, isActive: true, isSetupCompleted: false, isConsentGranted: true } ],
		] )( "when %s", async( _, siteKitConfiguration ) => {
			const siteKitWidgets = [
				{ id: "top-pages-widget", type: "topPages" },
				{ id: "top-queries-widget", type: "topQueries" },
			];
			dataProvider = new MockDataProvider( {
				siteKitConfiguration: { ...siteKitConfiguration, isFeatureEnabled: true },
			} );

			widgetFactory = new WidgetFactory( dataProvider, remoteDataProvider );
			siteKitWidgets.forEach( ( widget ) => {
				expect( widgetFactory.createWidget( widget ) ).toBeNull();
			} );

			const element = widgetFactory.createWidget( { id: "site-kit-setup-widget", type: "siteKitSetup" } );

			expect( element?.key ).toBe( "site-kit-setup-widget" );
			const { getByRole } = render( <>{ element }</> );

			await waitFor( () => {
				expect( getByRole( "heading", { name: "Expand your dashboard with insights from Google!" } ) ).toBeInTheDocument();
			} );
		} );
	} );

	test.each( [
		[ "Site Kit is not connected", { isConnected: false } ],
		[ "Analytics is not connected", { isAnalyticsConnected: false } ],
	] )( "should not create a OrganicSessions widget when %s", ( _, config ) => {
		dataProvider = new MockDataProvider( {
			siteKitConfiguration: config,
		} );
		widgetFactory = new WidgetFactory( dataProvider, remoteDataProvider );

		expect( widgetFactory.createWidget( { id: "organic-sessions-widget", type: "organicSessions" } ) ).toBeNull();
	} );
} );
