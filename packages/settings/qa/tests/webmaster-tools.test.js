import { cleanup, render, screen, within } from "@testing-library/react";
import { navigateByNavText } from "@yoast/admin-ui-toolkit/helpers";
import { merge } from "lodash";

import falseConfig from "../test-configs/false-config";
import trueConfigEmptyData from "../test-configs/true-config-empty-data";
import trueConfigTestData from "../test-configs/true-config-test-data";
import { startTheApp } from "./helpers";

let testConfig;

describe( "The webmaster tools screen with options on false", () => {
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
		expect( () => navigateByNavText( "Webmaster tools" ) ).toThrowError(
			"Unable to find an element with the text: Webmaster tools. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.",
		);
	} );
} );

describe( "The webmaster tools screen without data", () => {
	afterEach( cleanup );
	beforeEach( () => {
		// Render the target element.
		render( <div id="app" /> );

		// Reset the test config.
		testConfig = merge( {}, trueConfigEmptyData );

		// Reset the route.
		window.location.hash = "#/";

		startTheApp( testConfig, "Webmaster tools" );
	} );

	it( "can be navigated to", () => {
		// Did we navigate to the Webmaster Tools page? There should be an H1 with Webmaster tools at the top.
		const currentH1 = screen.getByRole( "heading", { level: 1 } );
		expect( currentH1.innerHTML ).toEqual( "Webmaster tools" );
	} );

	it( "has a correct description", () => {
		screen.getByText( "Verify your site with different webmaster tools.", { exact: false } );
	} );

	it( "has a Baidu section", () => {
		const BaiduVerificationCode = screen.getByLabelText( "Baidu verification code" );
		expect( BaiduVerificationCode.tagName ).toEqual( "INPUT" );

		const BaiduDescription = screen.getByText( "Get your Baidu verification code in", { exact: false } );
		expect( within( BaiduDescription ).getByRole( "link" ).href ).toEqual( "https://ziyuan.baidu.com/login/index?u=/site/siteadd" );
	} );

	it( "has a Bing section", () => {
		const BingVerificationCode = screen.getByLabelText( "Bing verification code" );
		expect( BingVerificationCode.tagName ).toEqual( "INPUT" );

		const BingDescription = screen.getByText( "Get your Bing verification code in", { exact: false } );
		expect( within( BingDescription ).getByRole( "link" ).href ).toEqual( "https://www.bing.com/toolbox/webmaster/#/Dashboard/?url=" );
	} );

	it( "has a Google section", () => {
		const GoogleVerificationCode = screen.getByLabelText( "Google verification code" );
		expect( GoogleVerificationCode.tagName ).toEqual( "INPUT" );

		const GoogleDescription = screen.getByText( "Get your Google verification code in", { exact: false } );
		expect( within( GoogleDescription ).getByRole( "link" ).href )
			.toEqual( "https://www.google.com/webmasters/verification/verification?hl=en&tid=alternate&siteUrl=" );
	} );

	it( "has a Pinterest section", () => {
		const PinterestVerificationCode = screen.getByLabelText( "Pinterest meta tag" );
		expect( PinterestVerificationCode.tagName ).toEqual( "INPUT" );

		const PinterestDescription = screen.getByText( "Claim your site", { exact: false } );
		expect( within( PinterestDescription ).getByRole( "link" ).href ).toEqual( "https://www.pinterest.com/settings/claim/" );
	} );

	it( "has a Yandex section", () => {
		const YandexVerificationCode = screen.getByLabelText( "Yandex verification code" );
		expect( YandexVerificationCode.tagName ).toEqual( "INPUT" );

		const YandexDescription = screen.getByText( "Get your Yandex verification code in", { exact: false } );
		expect( within( YandexDescription ).getByRole( "link" ).href ).toEqual( "https://webmaster.yandex.com/sites/add" );
	} );
} );

describe( "The webmaster tools screen with options on true", () => {
	afterEach( cleanup );
	beforeEach( () => {
		// Render the target element.
		render( <div id="app" /> );

		// Reset the test config.
		testConfig = merge( {}, trueConfigTestData );

		// Reset the route.
		window.location.hash = "#/";

		// Start the app
		startTheApp( testConfig, "Webmaster tools" );
	} );

	it( "can be navigated to", () => {
		// Did we navigate to the Webmaster Tools page? There should be an H1 with Webmaster tools at the top.
		const currentH1 = screen.getByRole( "heading", { level: 1 } );
		expect( currentH1.innerHTML ).toEqual( "Webmaster tools" );
	} );

	it( "has a correct description", () => {
		screen.getByText( "Verify your site with different webmaster tools.", { exact: false } );
	} );

	it( "has a Baidu section", () => {
		const BaiduVerificationCode = screen.getByLabelText( "Baidu verification code" );
		expect( BaiduVerificationCode.tagName ).toEqual( "INPUT" );

		const BaiduDescription = screen.getByText( "Get your Baidu verification code in", { exact: false } );
		expect( within( BaiduDescription ).getByRole( "link" ).href ).toEqual( testConfig.options.integrations.webmasterVerification.baiduLink );
	} );

	it( "has a Bing section", () => {
		const BingVerificationCode = screen.getByLabelText( "Bing verification code" );
		expect( BingVerificationCode.tagName ).toEqual( "INPUT" );

		const BingDescription = screen.getByText( "Get your Bing verification code in", { exact: false } );
		expect( within( BingDescription ).getByRole( "link" ).href ).toEqual( testConfig.options.integrations.webmasterVerification.bingLink );
	} );

	it( "has a Google section", () => {
		const GoogleVerificationCode = screen.getByLabelText( "Google verification code" );
		expect( GoogleVerificationCode.tagName ).toEqual( "INPUT" );

		const GoogleDescription = screen.getByText( "Get your Google verification code in", { exact: false } );
		expect( within( GoogleDescription ).getByRole( "link" ).href ).toEqual( testConfig.options.integrations.webmasterVerification.googleLink );
	} );

	it( "has a Pinterest section", () => {
		const PinterestVerificationCode = screen.getByLabelText( "Pinterest meta tag" );
		expect( PinterestVerificationCode.tagName ).toEqual( "INPUT" );

		const PinterestDescription = screen.getByText( "Claim your site", { exact: false } );
		expect( within( PinterestDescription ).getByRole( "link" ).href )
			.toEqual( testConfig.options.integrations.webmasterVerification.pinterestLink );
	} );

	it( "has a Yandex section", () => {
		const YandexVerificationCode = screen.getByLabelText( "Yandex verification code" );
		expect( YandexVerificationCode.tagName ).toEqual( "INPUT" );

		const YandexDescription = screen.getByText( "Get your Yandex verification code in", { exact: false } );
		expect( within( YandexDescription ).getByRole( "link" ).href ).toEqual( testConfig.options.integrations.webmasterVerification.yandexLink );
	} );
} );
