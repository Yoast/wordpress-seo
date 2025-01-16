import { beforeAll, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { fetchJson } from "../../../../src/dashboard/fetch/fetch-json";
import { TimeoutError } from "../../../../src/dashboard/fetch/timeout-error";
import { Scores } from "../../../../src/dashboard/scores/components/scores";
import { fireEvent, render, waitFor } from "../../../test-utils";
import categories from "./__data__/categories.json";
import contentTypes from "./__data__/content-types.json";
import productCategories from "./__data__/product_cat.json";
import scores from "./__data__/scores.json";

// Mock the Chart.js library. Preventing the error:
// > Error: Not implemented: HTMLCanvasElement.prototype.getContext (without installing the canvas npm package).
// Note: this also prevents the canvas from being rendered.
jest.mock( "chart.js" );
jest.mock( "react-chartjs-2" );

// Mock fetchJson, providing the data for the tests.
jest.mock( "../../../../src/dashboard/fetch/fetch-json" );

describe( "Scores", () => {
	beforeAll( () => {
		fetchJson.mockImplementation( ( url ) => {
			switch ( url.pathname ) {
				case "/error":
					return Promise.reject( new Error( "An error" ) );
				case "/timeout":
					return Promise.reject( new TimeoutError( "A timeout error" ) );
				case "/categories":
					if ( url.searchParams.get( "search" ) === "nothing" ) {
						return Promise.resolve( [] );
					}
					return Promise.resolve( categories );
				case "/product_cat":
					return Promise.resolve( productCategories );
				default:
					return Promise.resolve( scores );
			}
		} );
	} );

	beforeEach( () => {
		fetchJson.mockClear();
	} );

	it( "should render the component", async() => {
		const { container, getAllByRole, getByRole } = render(
			<Scores
				analysisType="seo"
				contentTypes={ contentTypes }
				endpoint="https://example.com/seo_scores"
			/>
		);

		// Verify the title is present.
		expect( getByRole( "heading", { name: "SEO scores" } ) ).toBeInTheDocument();

		// Verify the filters are present.
		expect( getByRole( "combobox", { name: "Content type" } ) ).toBeInTheDocument();
		expect( getByRole( "combobox", { name: "Categories" } ) ).toBeInTheDocument();

		// The skeleton loader should be visible before the fetch calls succeed.
		expect( container.querySelector( ".yst-skeleton-loader" ) ).not.toBeNull();

		// Await the fetch calls: scores and terms.
		await waitFor( () => expect( fetchJson ).toHaveBeenCalledTimes( 2 ) );
		expect( fetchJson ).toHaveBeenCalledWith(
			expect.objectContaining( { href: "https://example.com/seo_scores?contentType=post" } ),
			expect.any( Object )
		);
		expect( fetchJson ).toHaveBeenCalledWith(
			expect.objectContaining( { href: "https://example.com/categories?search=&_fields=id%2Cname" } ),
			expect.any( Object )
		);

		// Ensure the skeleton loader is removed.
		expect( container.querySelector( ".yst-skeleton-loader" ) ).toBeNull();

		// Verify the score content.
		expect( getByRole( "list" ) ).toBeInTheDocument();

		// Verify the score list items.
		const listItems = getAllByRole( "listitem" );
		expect( listItems ).toHaveLength( 4 );
		expect( listItems[ 0 ] ).toHaveTextContent( "Good" );
		expect( listItems[ 1 ] ).toHaveTextContent( "OK" );
		expect( listItems[ 2 ] ).toHaveTextContent( "Needs improvement" );
		expect( listItems[ 3 ] ).toHaveTextContent( "Not analyzed" );
	} );

	it( "should show an error with a link to the support page", async() => {
		const { getByRole } = render(
			<Scores
				analysisType="seo"
				contentTypes={ contentTypes }
				endpoint="https://example.com/error"
			/>
		);

		// Await the fetch calls: scores and terms.
		await waitFor( () => expect( fetchJson ).toHaveBeenCalledTimes( 2 ) );

		// Verify the error is present.
		expect( getByRole( "status" ) )
			.toHaveTextContent( "Something went wrong. In case you need further help, please take a look at our Support page." );

		// Verify a link to the support page is present.
		expect( getByRole( "link", { name: "Support page" } ) ).toHaveAttribute( "href", "admin.php?page=wpseo_page_support" );
	} );

	it( "should show a timeout error with a link to the support page", async() => {
		const { getByRole } = render(
			<Scores
				analysisType="seo"
				contentTypes={ contentTypes }
				endpoint="https://example.com/timeout"
			/>
		);

		// Await the fetch calls: scores and terms.
		await waitFor( () => expect( fetchJson ).toHaveBeenCalledTimes( 2 ) );

		// Verify the error is present.
		expect( getByRole( "status" ) )
			.toHaveTextContent( "A timeout occurred, possibly due to a large number of posts or terms. In case you need further help, please take a look at our Support page." );

		// Verify a link to the support page is present.
		expect( getByRole( "link", { name: "Support page" } ) ).toHaveAttribute( "href", "admin.php?page=wpseo_page_support" );
	} );

	it( "should not show the categories filter without taxonomies", async() => {
		const { getByRole, queryByRole } = render(
			<Scores
				analysisType="seo"
				contentTypes={ contentTypes }
				endpoint="https://example.com/seo_scores"
			/>
		);

		// Await the fetch calls: scores and terms.
		await waitFor( () => expect( fetchJson ).toHaveBeenCalledTimes( 2 ) );

		// Click the content type filter to show the options.
		const contentTypeFilter = getByRole( "combobox", { name: "Content type" } );
		fireEvent.click( contentTypeFilter );

		// Double check all the options are present.
		expect( getByRole( "option", { name: "Posts" } ) ).toBeInTheDocument();
		expect( getByRole( "option", { name: "Pages" } ) ).toBeInTheDocument();
		const pagesOption = getByRole( "option", { name: "Pages" } );
		expect( pagesOption ).toBeInTheDocument();

		// Select the "Pages" option.
		fireEvent.click( pagesOption );

		// Await new fetch call for the scores.
		await waitFor( () => expect( fetchJson ).toHaveBeenCalledTimes( 3 ) );
		expect( fetchJson )
			.toHaveBeenCalledWith( expect.objectContaining( { href: "https://example.com/seo_scores?contentType=page" } ), expect.any( Object ) );

		// Verify the categories filter is not there.
		expect( queryByRole( "combobox", { name: "Categories" } ) ).toBeNull();
	} );

	it( "should request the (readability) scores for a specific term", async() => {
		const { getByRole } = render(
			<Scores
				analysisType="readability"
				contentTypes={ contentTypes }
				endpoint="https://example.com/readability_scores"
			/>
		);

		// Verify the title is present.
		expect( getByRole( "heading", { name: "Readability scores" } ) ).toBeInTheDocument();

		// Await the fetch calls: scores and terms.
		await waitFor( () => expect( fetchJson ).toHaveBeenCalledTimes( 2 ) );
		// Verify the `readability_scores` part.
		expect( fetchJson )
			.toHaveBeenCalledWith( expect.objectContaining( { href: "https://example.com/readability_scores?contentType=post" } ), expect.any( Object ) );

		// Select the content type: "Products".
		fireEvent.click( getByRole( "combobox", { name: "Content type" } ) );
		fireEvent.click( getByRole( "option", { name: "Products" } ) );

		// Await new fetch call for the scores and terms.
		await waitFor( () => expect( fetchJson ).toHaveBeenCalledTimes( 4 ) );
		expect( fetchJson )
			.toHaveBeenCalledWith( expect.objectContaining( { href: "https://example.com/readability_scores?contentType=product" } ), expect.any( Object ) );
		expect( fetchJson ).toHaveBeenCalledWith( expect.objectContaining( { pathname: "/product_cat" } ), expect.any( Object ) );

		// Select the product term: "merchandise".
		fireEvent.click( getByRole( "combobox", { name: "Product categories" } ) );
		fireEvent.click( getByRole( "option", { name: "merchandise" } ) );

		// Await new fetch call for the scores.
		await waitFor( () => expect( fetchJson ).toHaveBeenCalledTimes( 5 ) );
		// Verify the taxonomy is "product_cat" and the term is the ID of "merchandise" (see data JSON).
		expect( fetchJson ).toHaveBeenCalledWith(
			expect.objectContaining( { href: "https://example.com/readability_scores?contentType=product&taxonomy=product_cat&term=18" } ),
			expect.any( Object )
		);
	} );

	it( "should filter the content types", async() => {
		const { getAllByRole, getByRole } = render(
			<Scores
				analysisType="seo"
				contentTypes={ contentTypes }
				endpoint="https://example.com/seo_scores"
			/>
		);

		// Await the fetch calls: scores and terms.
		await waitFor( () => expect( fetchJson ).toHaveBeenCalledTimes( 2 ) );

		// Search for the content type "pr".
		fireEvent.change( getByRole( "combobox", { name: "Content type" } ), { target: { value: "pr" } } );

		// Verify "Products" is in the list.
		expect( getByRole( "option", { name: "Products" } ) ).toBeInTheDocument();
		// Verify that is the only option.
		expect( getAllByRole( "option" ) ).toHaveLength( 1 );
	} );

	it( "should search for terms", async() => {
		const { getByRole } = render(
			<Scores
				analysisType="readability"
				contentTypes={ contentTypes }
				endpoint="https://example.com/readability_scores"
			/>
		);

		// Await the fetch calls: scores and terms.
		await waitFor( () => expect( fetchJson ).toHaveBeenCalledTimes( 2 ) );

		// Search for the term "thing".
		fireEvent.change( getByRole( "combobox", { name: "Categories" } ), { target: { value: "thing" } } );

		// Await the new fetch call for the terms.
		await waitFor( () => expect( fetchJson ).toHaveBeenCalledTimes( 3 ) );
		expect( fetchJson ).toHaveBeenCalledWith(
			expect.objectContaining( { href: "https://example.com/categories?search=thing&_fields=id%2Cname" } ),
			expect.any( Object )
		);
	} );

	it( "should show a loading indicator when searching for terms", async() => {
		const { getByRole } = render(
			<Scores
				analysisType="seo"
				contentTypes={ contentTypes }
				endpoint="https://example.com/seo_scores"
			/>
		);

		// Await the fetch calls: scores and terms.
		await waitFor( () => expect( fetchJson ).toHaveBeenCalledTimes( 2 ) );

		// Search for a term.
		fireEvent.change( getByRole( "combobox", { name: "Categories" } ), { target: { value: "foo" } } );

		// Verify the loading indicator is present.
		const list = getByRole( "listbox" );
		expect( list ).toBeInTheDocument();
		expect( list.querySelector( ".yst-animate-spin" ) ).not.toBeNull();

		// Await the fetch call for terms, or the request might come through after the mock clear between tests.
		await waitFor( () => expect( fetchJson ).toHaveBeenCalledTimes( 3 ) );
	} );

	it( "should show a message when no terms are found", async() => {
		const { getByRole } = render(
			<Scores
				analysisType="seo"
				contentTypes={ contentTypes }
				endpoint="https://example.com/seo_scores"
			/>
		);

		// Await the fetch calls: scores and terms.
		await waitFor( () => expect( fetchJson ).toHaveBeenCalledTimes( 2 ) );

		// Search for the term "nothing": which has a mock that yields no results.
		fireEvent.change( getByRole( "combobox", { name: "Categories" } ), { target: { value: "nothing" } } );

		// Await the new fetch call for the terms.
		await waitFor( () => expect( fetchJson ).toHaveBeenCalledTimes( 3 ) );
		expect( fetchJson ).toHaveBeenCalledWith(
			expect.objectContaining( { href: "https://example.com/categories?search=nothing&_fields=id%2Cname" } ),
			expect.any( Object )
		);

		// Verify the "Nothing found" message is present.
		expect( getByRole( "listbox" ) ).toHaveTextContent( "Nothing found" );
	} );

	it( "should be possible to clear the term filter", async() => {
		const { getByRole } = render(
			<Scores
				analysisType="seo"
				contentTypes={ contentTypes }
				endpoint="https://example.com/seo_scores"
			/>
		);

		// Await the fetch calls: scores and terms.
		await waitFor( () => expect( fetchJson ).toHaveBeenCalledTimes( 2 ) );

		// Search for the term "nothing": which has a mock that yields no results.
		fireEvent.change( getByRole( "combobox", { name: "Categories" } ), { target: { value: "foo" } } );

		// Await the new fetch call for the terms.
		await waitFor( () => expect( fetchJson ).toHaveBeenCalledTimes( 3 ) );

		// Clear the term filter.
		fireEvent.click( getByRole( "button", { name: "Clear filter" } ) );

		// Await the new fetch call for the terms.
		await waitFor( () => expect( fetchJson ).toHaveBeenCalledTimes( 3 ) );
		// Verify the search is empty.
		expect( fetchJson ).toHaveBeenCalledWith(
			expect.objectContaining( { href: "https://example.com/categories?search=&_fields=id%2Cname" } ),
			expect.any( Object )
		);
	} );
} );
