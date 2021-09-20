import { cleanup, render, screen } from "@testing-library/react";
import { navigateByNavText, testReplaceVarConsoleOutputOnce } from "@yoast/admin-ui-toolkit//helpers";
import { merge } from "lodash";

import falseConfig from "../test-configs/false-config";
import trueConfigEmptyData from "../test-configs/true-config-empty-data";
import trueConfigTestData from "../test-configs/true-config-test-data";
import { startTheApp } from "./helpers";

let testConfig;
let isFirstTest = true;

describe( "The 404 pages option set to false", () => {
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
		expect( () => navigateByNavText( "404 pages", "Advanced settings" ) ).toThrowError(
			"Unable to find an element with the text: Advanced settings. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.",
		);
	} );
} );

describe( "The 404 pages without data", () => {
	afterEach( cleanup );
	beforeEach( () => {
		// Render the target element.
		render( <div id="app" /> );

		// Reset the test config.
		testConfig = merge( {}, trueConfigEmptyData );

		// Reset the route.
		window.location.hash = "#/";

		startTheApp( testConfig, "404 pages", "Advanced settings" );

		isFirstTest = testReplaceVarConsoleOutputOnce( isFirstTest, console );
	} );
	it( "can be navigated to", () => {
		const currentH1 = screen.getByRole( "heading", { level: 1 } );
		expect( currentH1.innerHTML ).toEqual( "404 pages" );
	} );
	it( "has no Search appearance section", () => {
		expect( screen.getByText( "Choose how your 404 pages should look in search engines." ) ).not.toBe();

		expect( screen.getByLabelText( "SEO title" ) ).not.toBe();
	} );
} );

describe( "The 404 pages screen", () => {
	afterEach( cleanup );
	beforeEach( () => {
		// Render the target element.
		render( <div id="app" /> );

		// Reset the test config.
		testConfig = merge( {}, trueConfigTestData );

		// Reset the route.
		window.location.hash = "#/";

		startTheApp( testConfig, "404 pages", "Advanced settings" );

		isFirstTest = testReplaceVarConsoleOutputOnce( isFirstTest, console );
	} );
	it( "can be navigated to", () => {
		const currentH1 = screen.getByRole( "heading", { level: 1 } );
		expect( currentH1.innerHTML ).toEqual( "404 pages" );
	} );
	it( "has a Search appearance section", () => {
		screen.getByText( "Choose how your 404 pages should look in search engines." );

		screen.getByLabelText( "SEO title" );
	} );
} );
