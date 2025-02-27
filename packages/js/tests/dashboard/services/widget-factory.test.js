import { beforeAll, describe, expect, jest } from "@jest/globals";
import { waitFor } from "@testing-library/react";
import { WidgetFactory } from "../../../src/dashboard/services/widget-factory";
import { render } from "../../test-utils";
import { MockDataProvider } from "../__mocks__/data-provider";
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

	beforeAll( () => {
		dataProvider = new MockDataProvider( {
			siteKitConfiguration: {
				isFeatureEnabled: true,
			},
		} );
		remoteDataProvider = new MockRemoteDataProvider( {} );
		widgetFactory = new WidgetFactory( dataProvider, remoteDataProvider );
	} );

	test.each( [
		[ "seoScores" ],
		[ "readabilityScores" ],
		[ "topPages" ],
		[ "topQueries" ],
		[ "siteKitSetup" ],
		[ "organicSessions" ],
	] )( "should have the widget type: %s", async( type ) => {
		expect( WidgetFactory.types[ type ] ).toBe( type );
	} );

	test.each( [
		[ "Top pages", { id: "top-pages-widget", type: "topPages" } ],
		[ "Top queries", { id: "top-queries-widget", type: "topQueries" } ],
		[ "Organic sessions", { id: "organic-sessions-widget", type: "organicSessions" } ],
	] )( "should not create a %s widget when site kit is not connected", async( _, widget ) => {
		dataProvider.setSiteKitConnected( false );
		widgetFactory = new WidgetFactory( dataProvider, remoteDataProvider );
		expect( widgetFactory.createWidget( widget ) ).toBeNull();
	} );

	test.each( [
		[ "SEO scores", { id: "seo-scores-widget", type: "seoScores" }, "SEO scores" ],
		[ "Readability scores", { id: "readability-scores-widget", type: "readabilityScores" }, "Readability scores" ],
		[ "Site Kit setup", { id: "site-kit-setup-widget", type: "siteKitSetup" }, "Expand your dashboard with insights from Google!" ],
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
		dataProvider.setSiteKitConnected( true );
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

	test( "should create the site kit set up widget", async() => {
		const element = widgetFactory.createWidget( { id: "site-kit-setup-widget", type: "siteKitSetup" }, jest.fn() );
		expect( element?.key ).toBe( "site-kit-setup-widget" );
		const { getByRole } = render( <>{ element }</> );

		await waitFor( () => {
			expect( getByRole( "heading", { name: "Expand your dashboard with insights from Google!" } ) ).toBeInTheDocument();
		} );
	} );

	test( "should not create the site kit set up widget", async() => {
		dataProvider.setSiteKitConnected( true );
		const element = widgetFactory.createWidget( { id: "site-kit-setup-widget", type: "siteKitSetup" } );
		expect( element?.key ).toBe( "site-kit-setup-widget" );
		const { getByRole } = render( <>{ element }</> );

		await waitFor( () => {
			expect( getByRole( "heading", { name: "Expand your dashboard with insights from Google!" } ) ).toBeInTheDocument();
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
		widgetFactory = new WidgetFactory( dataProvider, remoteDataProvider );

		expect( widgetFactory.createWidget( widget ) ).toBeNull();
	} );


	test( "should not create the Site Kit setup widget if the data provider has isConfigurationDismissed set to true", () => {
		dataProvider = new MockDataProvider( {
			siteKitConfiguration: { isConfigurationDismissed: true },
		} );
		widgetFactory = new WidgetFactory( dataProvider, remoteDataProvider );

		expect( widgetFactory.createWidget( { id: "site-kite-setup-widget", type: "siteKitSetup" } ) ).toBeNull();
	} );

	test.each( [
		[ "Top pages", { id: "top-pages-widget", type: "topPages" } ],
		[ "Top queries", { id: "top-queries-widget", type: "topQueries" } ],
		[ "siteKitSetup", { id: "site-kite-setup-widget", type: "siteKitSetup" } ],
		[ "organicSessions", { id: "organic-sessions-widget", type: "organicSessions" } ],
	] )( "should not create a %s widget when site kit feature is disabled", async( _, widget ) => {
		dataProvider = new MockDataProvider( {
			siteKitConfiguration: { isFeatureEnabled: false },
		} );
		widgetFactory = new WidgetFactory( dataProvider, remoteDataProvider );

		expect( widgetFactory.createWidget( widget ) ).toBeNull();
	} );
} );
