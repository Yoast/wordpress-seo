import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { merge } from "lodash";

import falseConfig from "../../test-configs/false-config";
import trueConfigEmptyData from "../../test-configs/true-config-empty-data";
import trueConfigTestData from "../../test-configs/true-config-test-data";
import { startTheApp } from "../helpers";

/* eslint-disable max-statements */
let testConfig;

/**
 * This function throws if the supplied value is not checked, and/or a different value is checked.
 *
 * @param {Array}  separators A list of separator radio list elements.
 * @param {string} value      The value that should be checked.
 *
 * @returns {void}
 */
function testCheckedSeparator( separators, value ) {
	separators.forEach( separator => {
		if ( separator.firstChild.textContent === value ) {
			expect( separator ).toBeChecked();
		} else {
			expect( separator ).not.toBeChecked();
		}
	} );
}

describe( "The site defaults screen with all options set to false", () => {
	afterEach( cleanup );
	beforeEach( () => {
		// Render the target element.
		render( <div id="app" /> );

		// Reset the test config.
		testConfig = merge( {}, falseConfig );

		// Reset the route.
		window.location.hash = "#/";
	} );

	it( "can be navigated to when it's not the default landing page", () => {
		// Add the site Representation page, because that supersedes the site defaults as default landing page.
		testConfig.options.schema.siteRepresentation = true;

		// Start and navigate to the site defaults page.
		startTheApp( testConfig, "Site defaults" );

		// Did we navigate to the Site defaults page? There should be an H1 with Site defaults at the top.
		const currentH1 = screen.getByRole( "heading", { level: 1 } );
		expect( currentH1.innerHTML ).toEqual( "Site defaults" );
	} );

	it( "has an information alert", () => {
		// Start and navigate to the site defaults page.
		startTheApp( testConfig, "Site defaults" );

		screen.getByText( "You can use Site title and Separator as variables when configuring the search appearance of your content." );
	} );

	it( "has a site title section that looks like it should", () => {
		// Start and navigate to the site defaults page.
		startTheApp( testConfig, "Site defaults" );

		const strong = screen.getByText( "Site title" );
		expect( strong.tagName ).toBe( "STRONG" );

		const link = screen.getByText( "Edit" );
		expect( link.tagName ).toBe( "A" );
	} );

	it( "has a separator section that looks like it should", () => {
		// Start and navigate to the site defaults page.
		startTheApp( testConfig, "Site defaults" );

		const label = screen.getByText( "Separators" );
		expect( label.tagName ).toBe( "LABEL" );

		const ul = screen.getByText( "Separators" ).nextElementSibling;
		const separators = within( ul ).getAllByRole( "radio" );

		expect( ul.tagName ).toBe( "UL" );
		expect( ul.childElementCount ).toBe( 12 );

		expect( separators[ 0 ].textContent ).toBe( "-" );
		expect( separators[ 1 ].textContent ).toBe( "–" );
		expect( separators[ 2 ].textContent ).toBe( "—" );
		expect( separators[ 3 ].textContent ).toBe( ":" );
		expect( separators[ 4 ].textContent ).toBe( "·" );
		expect( separators[ 5 ].textContent ).toBe( "•" );
		expect( separators[ 6 ].textContent ).toBe( "*" );
		expect( separators[ 7 ].textContent ).toBe( "⋆" );
		expect( separators[ 8 ].textContent ).toBe( "«" );
		expect( separators[ 9 ].textContent ).toBe( "»" );
		expect( separators[ 10 ].textContent ).toBe( "<" );
		expect( separators[ 11 ].textContent ).toBe( ">" );
	} );

	it( "has a Site image section where you can select an image", () => {
		// Start and navigate to the site defaults page.
		startTheApp( testConfig, "Site defaults" );

		// Site image input is a button
		const ImageButton = screen.getByLabelText( "Site image" );
		expect( ImageButton.tagName ).toEqual( "BUTTON" );

		// Because it's empty, has the SVG with the photograph icon. An id was added to it for easy targeting.
		expect( document.getElementById( "site-image-no-image-svg" ) ).toBeInTheDocument();

		// There is also one button with "Select image", no "Remove image button";
		screen.getByText( "Select image" );
		expect( screen.queryByText( "Remove image" ) ).toBeNull();

		// There is a save button
		screen.getByText( "Save changes" );

		// There is a descriptive text
		screen.getByText( "This image is used as a fallback for posts/pages that don't have a featured image set." );
	} );
} );

describe( "The site defaults screen with all options set to true, but no data", () => {
	afterEach( cleanup );
	beforeEach( () => {
		// Render the target element.
		render( <div id="app" /> );

		// Reset the test config.
		testConfig = merge( {}, trueConfigEmptyData );

		// Reset the route.
		window.location.hash = "#/";
	} );

	it( "can be navigated to", () => {
		// Start and navigate to the site defaults page.
		startTheApp( testConfig, "Site defaults" );

		// Did we navigate to the Site defaults page? There should be an H1 with Site defaults at the top.
		const currentH1 = screen.getByRole( "heading", { level: 1 } );
		expect( currentH1.innerHTML ).toEqual( "Site defaults" );
	} );

	it( "has an information alert", () => {
		// Start and navigate to the site defaults page.
		startTheApp( testConfig, "Site defaults" );

		screen.getByText( "You can use Site title, Tagline and Separator as variables when configuring the search appearance of your content." );
	} );

	it( "has a Site title and Tagline section that looks like it should", () => {
		// Start and navigate to the site defaults page.
		startTheApp( testConfig, "Site defaults" );

		const siteTitle = screen.getByText( "Site title" );
		expect( siteTitle.tagName ).toBe( "STRONG" );

		const tagLine = screen.getByText( "Tagline" );
		expect( tagLine.tagName ).toBe( "STRONG" );

		const links = screen.getAllByText( "Edit" );
		expect( links[ 0 ].tagName ).toBe( "A" );
		expect( links[ 1 ].tagName ).toBe( "A" );
		expect( links.length ).toBe( 2 );
	} );

	it( "has a separator section that looks like it should", () => {
		// Start and navigate to the site defaults page.
		startTheApp( testConfig, "Site defaults" );

		const label = screen.getByText( "Separators" );
		expect( label.tagName ).toBe( "LABEL" );

		const ul = screen.getByText( "Separators" ).nextElementSibling;
		const separators = within( ul ).getAllByRole( "radio" );

		expect( ul.tagName ).toBe( "UL" );
		expect( separators.length ).toBe( 12 );

		// Expect "-" as the defaul separator, as no data was applied.
		testCheckedSeparator( separators, "-" );
	} );

	it( "has a Site image section where you can select an image", () => {
		// Start and navigate to the site defaults page.
		startTheApp( testConfig, "Site defaults" );

		// Site image input is a button
		const ImageButton = screen.getByLabelText( "Site image" );
		expect( ImageButton.tagName ).toEqual( "BUTTON" );

		// Because it's empty, has the SVG with the photograph icon. An id was added to it for easy targeting.
		expect( document.getElementById( "site-image-no-image-svg" ) ).toBeInTheDocument();

		// There is also one button with "Select image", no "Remove image button";
		screen.getByText( "Select image" );
		expect( screen.queryByText( "Remove image" ) ).toBeNull();

		// There is a save button
		screen.getByText( "Save changes" );

		// There is a descriptive text
		screen.getByText( "This image is used as a fallback for posts/pages that don't have a featured image set." );
	} );
} );

describe( "The site defaults screen with all options set to true, hydrated with data", () => {
	afterEach( cleanup );
	beforeEach( () => {
		// Render the target element.
		render( <div id="app" /> );

		// Reset the test config.
		testConfig = merge( {}, trueConfigTestData );

		// Reset the route.
		window.location.hash = "#/";
	} );

	it( "can be navigated to", () => {
		// Start and navigate to the site defaults page.
		startTheApp( testConfig, "Site defaults" );

		// Did we navigate to the Site defaults page? There should be an H1 with Site defaults at the top.
		const currentH1 = screen.getByRole( "heading", { level: 1 } );
		expect( currentH1.innerHTML ).toEqual( "Site defaults" );
	} );

	it( "has an information alert", () => {
		// Start and navigate to the site defaults page.
		startTheApp( testConfig, "Site defaults" );

		screen.getByText( "You can use Site title, Tagline and Separator as variables when configuring the search appearance of your content." );
	} );

	it( "has a Site title and Tagline section that looks like it should", () => {
		// Start and navigate to the site defaults page.
		startTheApp( testConfig, "Site defaults" );

		const siteTitle = screen.getByText( "Site title" );
		expect( siteTitle.tagName ).toBe( "STRONG" );

		const tagLine = screen.getByText( "Tagline" );
		expect( tagLine.tagName ).toBe( "STRONG" );

		const links = screen.getAllByText( "Edit" );
		expect( links[ 0 ].tagName ).toBe( "A" );
		expect( links[ 1 ].tagName ).toBe( "A" );
		expect( links.length ).toBe( 2 );
	} );

	it( "has a separator section that looks like it should", () => {
		// Start and navigate to the site defaults page.
		startTheApp( testConfig, "Site defaults" );

		const label = screen.getByText( "Separators" );
		expect( label.tagName ).toBe( "LABEL" );

		const ul = screen.getByText( "Separators" ).nextElementSibling;
		const separators = within( ul ).getAllByRole( "radio" );

		expect( ul.tagName ).toBe( "UL" );
		expect( ul.childElementCount ).toBe( 12 );

		// Only the selected separator should be checked.
		testCheckedSeparator( separators, trueConfigTestData.data.siteSettings.siteDefaults.separator );

		// Selecting a different separator should work.
		const NewSeparator = screen.getByLabelText( "<" );
		userEvent.click( NewSeparator );
		testCheckedSeparator( separators, "<" );
	} );

	it( "has a Site image section with an image selected", () => {
		// Start and navigate to the site defaults page.
		startTheApp( testConfig, "Site defaults" );

		// Site image input is a button
		const ImageButton = screen.getByLabelText( "Site image" );
		expect( ImageButton.tagName ).toEqual( "BUTTON" );

		// Because it's not empty, there is no photograph icon svg.
		expect( document.getElementById( "person-avatar-no-image-svg" ) ).not.toBeInTheDocument();

		// Instead, there is a button with an image in it, that reflects the config.
		expect( ImageButton.querySelector( "img" ).src ).toEqual( testConfig.data.siteSettings.siteDefaults.siteImage.url );

		// There is also one button with "Replace image", not "Select image", and a "Remove image button";
		expect( screen.getByText( "Replace image" ).tagName ).toEqual( "BUTTON" );
		expect( screen.getByText( "Remove image" ).tagName ).toEqual( "BUTTON" );
		expect( screen.queryByText( "Select image" ) ).not.toBeInTheDocument();

		// There is a descriptive text
		screen.getByText( "This image is used as a fallback for posts/pages that don't have a featured image set." );

		// There is a save button
		screen.getByText( "Save changes" );
	} );
} );
