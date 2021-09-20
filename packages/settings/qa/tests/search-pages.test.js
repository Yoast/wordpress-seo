import { cleanup, render, screen, within } from "@testing-library/react";
import { navigateByNavText, testReplaceVarConsoleOutputOnce } from "@yoast/admin-ui-toolkit/helpers";
import { merge } from "lodash";

import falseConfig from "../test-configs/false-config";
import trueConfigEmptyData from "../test-configs/true-config-empty-data";
import trueConfigTestData from "../test-configs/true-config-test-data";
import { startTheApp } from "./helpers";

let testConfig;
let isFirstTest = true;

describe( "The Search pages option set to false", () => {
	afterEach( cleanup );
	beforeEach( () => {
		// Render the target element.
		render( <div id="app" /> );

		// Reset the test config.
		testConfig = merge( {}, falseConfig );

		// Reset the route.
		window.location.hash = "#/";

		startTheApp( testConfig );
	} );
	it( "cannot be navigated to", () => {
		expect( () => navigateByNavText( "Search pages", "Advanced settings" ) ).toThrowError(
			"Unable to find an element with the text: Advanced settings. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.",
		);
	} );
} );

describe( "The Search pages without data", () => {
	afterEach( cleanup );
	beforeEach( () => {
		// Render the target element.
		render( <div id="app" /> );

		// Reset the test config.
		testConfig = merge( {}, trueConfigEmptyData );

		// Reset the route.
		window.location.hash = "#/";

		startTheApp( testConfig, "Search pages", "Advanced settings" );

		isFirstTest = testReplaceVarConsoleOutputOnce( isFirstTest, console );
	} );
	it( "can be navigated to", () => {
		const currentH1 = screen.getByRole( "heading", { level: 1 } );
		expect( currentH1.innerHTML ).toEqual( "Search pages" );
	} );
	it( "has no Search appearance section", () => {
		expect( screen.getByText( "Choose how your Search pages should look in search engines." ) ).not.toBe();

		expect( screen.getByLabelText( "SEO title" ) ).not.toBe();
	} );
} );

describe( "The Search pages screen", () => {
	afterEach( cleanup );
	beforeEach( () => {
		// Render the target element.
		render( <div id="app" /> );

		// Reset the test config.
		testConfig = merge( {}, trueConfigTestData );

		// Reset the route.
		window.location.hash = "#/";

		startTheApp( testConfig, "Search pages", "Advanced settings" );

		isFirstTest = testReplaceVarConsoleOutputOnce( isFirstTest, console );
	} );
	it( "can be navigated to", () => {
		const currentH1 = screen.getByRole( "heading", { level: 1 } );
		expect( currentH1.innerHTML ).toEqual( "Search pages" );
	} );
	it( "has a Search appearance section", () => {
		screen.getByText( "Choose how your Search pages should look in search engines." );

		screen.getByLabelText( "SEO title" );
	} );
	it( "has a Schema section", () => {
		screen.getByText( "Choose how your Search pages should be described by default in your site's Schema.org markup." );
		const schemaAlert = screen.getByText( "For Search pages we automatically output ", { exact: false } );
		expect( schemaAlert.textContent ).toBe( "For Search pages we automatically output CollectionPage and SearchResultsPage Schema. Learn more about our Schema output." );
		expect( within( schemaAlert ).getByRole( "link" ).href ).toEqual( "https://example.com/learn-more" );
	} );
} );
