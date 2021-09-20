import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { merge } from "lodash";

import { mockItemsData } from "../example-config";
import testConfig from "../test-configs/test-config";
import { startTheApp } from "./helpers";

let cleanConfig;

const testId = mockItemsData.products[ 0 ].id;

describe( "The detail view page", () => {
	afterEach( cleanup );
	beforeEach( async () => {
		// Render the target element.
		render( <div id="app" /> );

		// Reset the test config.
		cleanConfig = merge( {}, testConfig );

		// Set the route to the detail view directly
		window.location.hash = `#/products/${ testId }`;

		await waitFor( () => startTheApp( cleanConfig ) );
	} );

	it( "extracts the correct id from the url path", () => {
		// For now we can establish this from reading the heading. Should be established by monitoring the query once that is implemented.
		expect( screen.getByText( "Mock title" ).tagName ).toEqual( "H1" );
	} );

	it( "has a back button that goes back to the overview", () => {
		const backButton = ( within( screen.getByRole( "banner" ) ).getAllByRole( "link" ) )[ 0 ];
		expect( backButton.getAttribute( "aria-label" ) ).toEqual( "Back to products overview." );
		userEvent.click( backButton );
		expect( window.location.hash ).toEqual( "#/products" );
	} );

	it( "has two links for going to the CMS", () => {
		const editButton = screen.getAllByText( "Edit with WordPress SEO" )[ 0 ];
		expect( editButton.closest( "a" ) ).toHaveClass( "yst-button yst-button--secondary" );
		screen.getByText( "View product" );
	} );

	it( "has a cornerstone content collapsible with an unchecked toggle", async () => {
		const cornerstone = screen.getByText( "Cornerstone product content" );
		userEvent.click( cornerstone );
		const toggle = screen.getByLabelText( "Mark as cornerstone content" );
		expect( toggle.getAttribute( "aria-checked" ) ).toEqual( "false" );
	} );

	it( "has an advanced settings collapsible", async () => {
		const advancedCollapsible = screen.getByText( "Advanced" );
		userEvent.click( advancedCollapsible );
		const isNoIndex = screen.getByLabelText( "Allow search engines to show this Product in search results?" );
		expect( isNoIndex.value ).toBe( "" );
		const isNoFollow = document.getElementsByName( "search-engine-links" );
		expect( isNoFollow[ 0 ].value ).toBe( "false" );
		expect( isNoFollow[ 0 ] ).toBeChecked();
		const robots = screen.getByLabelText( "Meta robots advanced" );
		expect( robots.value ).toBe( "" );
		const canonicalUrl = screen.getByLabelText( "Canonical URL" );
		expect( canonicalUrl.value ).toBe( "https://canonical-url.mock" );
	}  );

	it( "has a section for media with a bigger featured images and smaller images", () => {
		screen.getByText( "Media" );
		const editLink = screen.getAllByText( "Edit with WordPress SEO" )[ 1 ];
		expect( editLink.closest( "a" ) ).toHaveClass( "yst-block" );
		const featuredImage = screen.getByAltText( "Featured image" );
		expect( featuredImage.closest( "div" ) ).toHaveClass( "yst-h-200 yst-w-200" );
		const remainingImages = screen.getAllByAltText( "alt text" );
		expect( remainingImages[ 0 ].closest( "div" ) ).toHaveClass( "yst-max-h-100" );
	} );

	it( "has no readability analysis", async () => {
		// Switch to a blog post.
		window.location.hash = `#/pages/${ mockItemsData[ "blog-posts" ][ 0 ].id }`;

		expect( screen.queryByText( "Readability analysis" ) ).toBeNull();
	} );

	it( "has no SEO analysis", async () => {
		// Switch to a blog post.
		window.location.hash = `#/pages/${ mockItemsData[ "blog-posts" ][ 0 ].id }`;

		expect( screen.queryByText( "SEO analysis" ) ).toBeNull();
	} );

	it( "has no related keyphrases", async () => {
		// Switch to a blog post.
		window.location.hash = `#/pages/${ mockItemsData[ "blog-posts" ][ 0 ].id }`;

		expect( screen.queryByText( "Add related keyphrase" ) ).toBeNull();
	} );

	it( "has no cornerstone content", async () => {
		// Switch to a blog post.
		window.location.hash = `#/pages/${ mockItemsData[ "blog-posts" ][ 0 ].id }`;

		expect( screen.queryByText( "Cornerstone content" ) ).toBeNull();
	} );
} );
