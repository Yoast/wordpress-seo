import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { navigateByNavText } from "@yoast/admin-ui-toolkit/helpers";
import { merge } from "lodash";
import { getIndicatorForRating } from "../../src/components/score-indicator";
import { mockItemsData } from "../example-config";
import testConfig from "../test-configs/test-config";
import { startTheApp, testSelectOptions } from "./helpers";

let cleanConfig;

describe( "The content list page", () => {
	afterEach( cleanup );
	beforeEach( () => {
		// Render the target element.
		render( <div id="app" /> );

		// Reset the test config.
		cleanConfig = merge( {}, testConfig );

		// Reset the route.
		window.location.hash = "#/";

		startTheApp( cleanConfig );
	} );

	it( "can navigate to all content types provided", () => {
		Object.values( cleanConfig.contentTypes ).forEach( ( contentTypeConfig, index ) => {
			// The optimize app redirects to the first route, so skip that one here.
			if ( index !== 0 ) {
				expect( () => navigateByNavText( contentTypeConfig.label ) ).not.toThrow();
			}
			expect( () => navigateByNavText( contentTypeConfig.label + "jibberish" ) ).toThrow();
		} );
	} );

	it( "has a search box when visiting a content type", () => {
		const contentTypeName = cleanConfig.contentTypes.products.label;

		// There is a Search input with a correct placeholder
		screen.getByPlaceholderText( `Search ${ contentTypeName }` );
	} );

	it( "has a select for the status filter with correct values", () => {
		const expectedOptions = [
			"All statuses",
			"Active",
			"Draft",
			"Archived",
		];

		testSelectOptions( "All statuses", expectedOptions );
	} );

	it( "has a select for the SEO score filter with correct values", () => {
		const expectedOptions = [
			"All SEO scores",
			"SEO: Needs improvement",
			"SEO: OK",
			"SEO: Good",
			"SEO: No focus keyphrase",
			"SEO: No index",
		];

		testSelectOptions( "All SEO scores", expectedOptions );
	} );

	it( "has a select for the Readability score filter with correct values", () => {
		const expectedOptions = [
			"All Readability scores",
			"Readability: Needs improvement",
			"Readability: OK",
			"Readability: Good",
		];

		testSelectOptions( "All Readability scores", expectedOptions );
	} );

	it( "has all expected column headers", () => {
		const expectedColumns = cleanConfig.contentTypes.products.columns;

		// First row is the header
		const HeaderRow = screen.getAllByRole( "row" )[ 0 ];
		expectedColumns.forEach( expectedColumn => {
			within( HeaderRow ).getByText( expectedColumn.label );
		} );
	} );

	it( "lists all items of the content type", async () => {
		const rawData = mockItemsData.products;

		await waitFor( () => screen.getByText( rawData[ 0 ].metaDescription ), { timeout: 5000 } );

		// Get a list of all rows.
		const tableRows = Array.from( document.querySelectorAll( "tbody > tr" ) );
		tableRows.forEach( ( row, index ) => {
			// Should be clickable
			expect( row ).toHaveAttribute( "role", "link" );

			within( row ).getByText( rawData[ index ].title );
			within( row ).getByText( rawData[ index ].date );
			within( row ).getByText( rawData[ index ].seoTitle );
			within( row ).getByText( rawData[ index ].metaDescription );
			within( row ).getByText( rawData[ index ].focusKeyphrase );

			// Expect there to be two screenreader only elements with reflecting the scores
			expect( row.getElementsByClassName( "yst-sr-only" )[ 0 ].innerHTML ).toEqual( getIndicatorForRating( rawData[ index ].seoScore ).screenReaderText );
			expect( row.getElementsByClassName( "yst-sr-only" )[ 1 ].innerHTML ).toEqual( getIndicatorForRating( rawData[ index ].readabilityScore ).screenReaderReadabilityText );
		} );
	} );

	it( "has a button to show more results if there are more results", async () => {
		const rawData = mockItemsData.products;

		await waitFor( () => screen.getByText( rawData[ 0 ].metaDescription ), { timeout: 5000 } );

		expect( screen.queryByText( "You've reached the end of the results." ) ).toBeNull();
		expect( screen.getByText( "Show more results" ).parentElement.tagName ).toBe( "BUTTON" );
	} );

	it( "has an end of results text of there are no further results", async () => {
		cleanConfig.handleQuery.mockImplementation( ( query ) => {
			return {
				status: 200,
				data: {
					items: mockItemsData[ query.contentType ],
					after: null,
				},
			};
		} );

		const rawData = mockItemsData.products;

		await waitFor( () => screen.getByText( rawData[ 0 ].metaDescription ), { timeout: 5000 } );

		screen.getByText( "You've reached the end of the results." );
		expect( screen.queryByText( "Show more results" ) ).toBeNull();
	} );

	it( "routes to a detail page when clicking an item", async () => {
		// Wait till we see something
		const exampleProduct = mockItemsData.products[ 0 ];

		await waitFor( () => screen.getByText( exampleProduct.metaDescription ), { timeout: 5000 } );

		// Get first row:
		const firstRow = screen.getByText( exampleProduct.metaDescription ).parentElement;
		expect( firstRow.tagName ).toBe( "TR" );
		expect( firstRow.getAttribute( "role" ) ).toBe( "link" );

		// Small test to see if navigation went well.
		await waitFor( () => userEvent.click( firstRow ) );
		expect( window.location.hash ).toEqual( `#/products/${ exampleProduct.id }` );
	} );
} );
