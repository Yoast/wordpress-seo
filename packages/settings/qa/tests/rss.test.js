import { cleanup, render, screen } from "@testing-library/react";
import { navigateByNavText } from "@yoast/admin-ui-toolkit/helpers";
import { merge } from "lodash";

import falseConfig from "../test-configs/false-config";
import trueConfigEmptyData from "../test-configs/true-config-empty-data";
import trueConfigTestData from "../test-configs/true-config-test-data";
import { startTheApp } from "./helpers";

let testConfig;

describe( "The RSS screen option set to false", () => {
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
		expect( () => navigateByNavText( "RSS", "Advanced settings" ) ).toThrowError(
			"Unable to find an element with the text: Advanced settings. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.",
		);
	} );
} );

describe( "The RSS screen without data", () => {
	afterEach( cleanup );
	beforeEach( () => {
		// Render the target element.
		render( <div id="app" /> );

		// Reset the test config.
		testConfig = merge( {}, trueConfigEmptyData );

		// Reset the route.
		window.location.hash = "#/";

		startTheApp( testConfig, "RSS", "Advanced settings" );
	} );
	it( "can be navigated to", () => {
		const currentH1 = screen.getByRole( "heading", { level: 1 } );
		expect( currentH1.innerHTML ).toEqual( "RSS" );
	} );
	it( "has an RSS section", () => {
		screen.getByText( "Automatically add content to your RSS.", { exact: false } );
		const ContentBeforePost = screen.getByLabelText( "Content to put before each post in the feed" );
		expect( ContentBeforePost.tagName ).toEqual( "TEXTAREA" );
		expect( ContentBeforePost.value ).toEqual( "" );

		const ContentAfterPost = screen.getByLabelText( "Content to put after each post in the feed" );
		expect( ContentAfterPost.tagName ).toEqual( "TEXTAREA" );
		expect( ContentAfterPost.value ).toEqual( "The post %%POSTLINK%% appeared first on %%BLOGLINK%%." );
	} );
	it( "has an available variables section", () => {
		screen.getByText( "You can use the following variables within the content, they will be replaced by the value on the right." );
	} );
} );

describe( "The RSS screen", () => {
	afterEach( cleanup );
	beforeEach( () => {
		// Render the target element.
		render( <div id="app" /> );

		// Reset the test config.
		testConfig = merge( {}, trueConfigTestData );

		// Reset the route.
		window.location.hash = "#/";

		startTheApp( testConfig, "RSS", "Advanced settings" );
	} );
	it( "can be navigated to", () => {
		const currentH1 = screen.getByRole( "heading", { level: 1 } );
		expect( currentH1.innerHTML ).toEqual( "RSS" );
	} );
	it( "has an RSS section", () => {
		screen.getByText( "Automatically add content to your RSS.", { exact: false } );
		const ContentBeforePost = screen.getByLabelText( "Content to put before each post in the feed" );
		expect( ContentBeforePost.tagName ).toEqual( "TEXTAREA" );
		expect( ContentBeforePost.value ).toEqual( testConfig.data.advancedSettings.rss.contentBeforePost );

		const ContentAfterPost = screen.getByLabelText( "Content to put after each post in the feed" );
		expect( ContentAfterPost.tagName ).toEqual( "TEXTAREA" );
		expect( ContentAfterPost.value ).toEqual( testConfig.data.advancedSettings.rss.contentAfterPost );
	} );
	it( "has an available variables section", () => {
		screen.getByText( "You can use the following variables within the content, they will be replaced by the value on the right." );
	} );
} );
