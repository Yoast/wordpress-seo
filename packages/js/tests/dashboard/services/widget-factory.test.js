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
		dataProvider = new MockDataProvider();
		remoteDataProvider = new MockRemoteDataProvider( {} );
		widgetFactory = new WidgetFactory( dataProvider, remoteDataProvider );
	} );

	test.each( [
		[ "seoScores" ],
		[ "readabilityScores" ],
		[ "topPages" ],
	] )( "should have the widget type: %s", async( type ) => {
		expect( WidgetFactory.types[ type ] ).toBe( type );
	} );

	test.each( [
		[ "SEO scores", { id: "seo-scores-widget", type: "seoScores" }, "SEO scores" ],
		[ "Readability scores", { id: "readability-scores-widget", type: "readabilityScores" }, "Readability scores" ],
		[ "Top pages", { id: "top-pages-widget", type: "topPages" }, "Top 5 most popular content" ],
		[ "Unknown", { id: undefined, type: "unknown" }, undefined ],
	] )( "should create a %s widget", async( _, widget, title ) => {
		const element = widgetFactory.createWidget( widget, jest.fn() );
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
		widgetFactory = new WidgetFactory( dataProvider, remoteDataProvider );

		expect( widgetFactory.createWidget( widget, jest.fn() ) ).toBeNull();
	} );
} );
