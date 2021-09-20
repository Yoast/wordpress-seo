import { cleanup, render, screen } from "@testing-library/react";
import { forEach, merge } from "lodash";
import falseConfig from "../../test-configs/false-config";

import trueConfigTestData from "../../test-configs/true-config-test-data";
import { startTheApp } from "../helpers";

/* eslint-disable max-statements */
let testConfig;

const SCHEMA = {
	ALL: "all",
	ORGANIZATION: "organization",
	WEBSITE: "website",
	WEBPAGE: "webpage",
	ARTICLE: "article",
	PRODUCT: "product",
	BREADCRUMB: "breadcrumb",
};

/**
 * @param {string} schema The schema name.
 * @returns {HTMLElement|null} The requested switch or null.
 */
const getSchemaSwitch = schema => {
	switch ( schema ) {
		case SCHEMA.ALL:
			return screen.getByLabelText( "All Schema" );
		case SCHEMA.ORGANIZATION:
			return screen.getByLabelText( screen.getByText( "Organization" ).parentElement.textContent );
		case SCHEMA.WEBSITE:
			return screen.getByLabelText( "Website" );
		case SCHEMA.WEBPAGE:
			return screen.getByLabelText( screen.getByText( "Web Page" ).parentElement.textContent );
		case SCHEMA.ARTICLE:
			return screen.getByLabelText( "Article" );
		case SCHEMA.PRODUCT:
			return screen.getByLabelText( "Product" );
		case SCHEMA.BREADCRUMB:
			return screen.getByLabelText( "Breadcrumb" );
	}

	return null;
};

/**
 * Tests the cascading of switches.
 * @param {string} main The schema name of the switch to toggle.
 * @param {string[]} disableAlso The schema names of the switches that are expected to follow the deactivation of the main switch.
 * @param {string[]} [disabledBy] The schema names of the switches that are expected to be disabled by the main switch.
 * @returns {Object} The elements.
 */
const testSwitchCascadeFor = ( main, disableAlso, disabledBy = [] ) => {
	const mainElement = getSchemaSwitch( main );
	const disableAlsoElements = disableAlso.reduce( ( acc, schema ) => {
		acc[ schema ] = getSchemaSwitch( schema );
		return acc;
	}, {} );
	const disabledByElements = disabledBy.reduce( ( acc, schema ) => {
		acc[ schema ] = getSchemaSwitch( schema );
		return acc;
	}, {} );

	// Check the main switch state, it should be on.
	expect( mainElement.getAttribute( "aria-checked" ) ).toBe( "true" );
	// Change the main switch state, it should be off.
	mainElement.click();
	expect( mainElement.getAttribute( "aria-checked" ) ).toBe( "false" );
	// Check the disableAlso switches, they should be off.
	forEach( disableAlsoElements, element => {
		expect( element.getAttribute( "aria-checked" ) ).toBe( "false" );
	} );
	// Check the disabledBy switches, they should be disabled.
	forEach( disabledByElements, element => {
		expect( element.getAttribute( "aria-disabled" ) ).toBe( "true" );
	} );

	return {
		main: mainElement,
		disableAlso: disableAlsoElements,
		disabledBy: disabledByElements,
	};
};

describe( "The Schema output screen with all options set to false", () => {
	afterEach( cleanup );
	beforeEach( () => {
		// Render the target element.
		render( <div id="app" /> );

		// Reset the test config.
		testConfig = merge( {}, falseConfig );

		// Reset the route.
		window.location.hash = "#/";
	} );
} );

describe( "The Schema output screen", () => {
	afterEach( cleanup );
	beforeEach( () => {
		// Render the target element.
		render( <div id="app" /> );

		// Reset the test config.
		testConfig = merge( {}, trueConfigTestData );

		// Reset the route.
		window.location.hash = "#/";

		startTheApp( testConfig, "Schema output" );
	} );

	it( "can be navigated to", () => {
		const currentH1 = screen.getByRole( "heading", { level: 1 } );
		expect( currentH1.innerHTML ).toBe( "Schema output" );
	} );
	it( "has a Schema output section", () => {
		screen.getByText( "Choose which parts of Schema.org markup you would like to disable for your site. Changing these settings can have impact on other parts of the Schema.org markup." );
	} );

	it( "has an All Schema switch that is enabled", () => {
		const allSchema = screen.getByLabelText( "All Schema" );
		expect( allSchema.getAttribute( "aria-checked" ) ).toBe( "true" );
	} );
	it( "has an Organization switch that is enabled", () => {
		const organization = screen.getByText( "Organization" );
		const organizationLabel = screen.getByLabelText( organization.parentElement.textContent );
		expect( organizationLabel.getAttribute( "aria-checked" ) ).toBe( "true" );
	} );
	it( "has an Website switch that is enabled", () => {
		const website = screen.getByLabelText( "Website" );
		expect( website.getAttribute( "aria-checked" ) ).toBe( "true" );
	} );
	it( "has an WebPage switch that is enabled", () => {
		const webpage = screen.getByText( "Web Page" );
		const webpageLabel = screen.getByLabelText( webpage.parentElement.textContent );
		expect( webpageLabel.getAttribute( "aria-checked" ) ).toBe( "true" );
	} );
	it( "has an Article switch that is enabled", () => {
		const article = screen.getByLabelText( "Article" );
		expect( article.getAttribute( "aria-checked" ) ).toBe( "true" );
	} );
	it( "has an Product switch that is enabled", () => {
		const product = screen.getByLabelText( "Product" );
		expect( product.getAttribute( "aria-checked" ) ).toBe( "true" );
	} );
	it( "has an Breadcrumb switch that is enabled", () => {
		const breadcrumb = screen.getByLabelText( "Breadcrumb" );
		expect( breadcrumb.getAttribute( "aria-checked" ) ).toBe( "true" );
	} );

	it( "deactivating All Schema will deactivate all other schema toggles", () => {
		const elements = testSwitchCascadeFor( SCHEMA.ALL, [
			SCHEMA.ORGANIZATION,
			SCHEMA.WEBSITE,
			SCHEMA.WEBPAGE,
			SCHEMA.ARTICLE,
			SCHEMA.PRODUCT,
			SCHEMA.BREADCRUMB,
		] );

		// Change the main switch state, it should be on again.
		elements.main.click();
		expect( elements.main.getAttribute( "aria-checked" ) ).toBe( "true" );
		// Check the disableAlso switches, they should be on too.
		forEach( elements.disableAlso, element => {
			expect( element.getAttribute( "aria-checked" ) ).toBe( "true" );
		} );
	} );
	it( "deactivating Organization will deactivate and disable WebSite, WebPage, Article and Breadcrumb", () => {
		const dependencies = [ SCHEMA.WEBSITE, SCHEMA.WEBPAGE, SCHEMA.ARTICLE, SCHEMA.BREADCRUMB ];
		const elements = testSwitchCascadeFor( SCHEMA.ORGANIZATION, dependencies, dependencies );

		// Change the main switch state, it should be on again.
		elements.main.click();
		expect( elements.main.getAttribute( "aria-checked" ) ).toBe( "true" );
		// Check the disableAlso switches, they should be off still.
		forEach( elements.disableAlso, element => {
			expect( element.getAttribute( "aria-checked" ) ).toBe( "false" );
		} );
		// Check the disabledBy switches, they should not be disabled anymore.
		expect( elements.disabledBy[ SCHEMA.WEBSITE ].getAttribute( "aria-disabled" ) ).toBe( "false" );
		expect( elements.disabledBy[ SCHEMA.WEBPAGE ].getAttribute( "aria-disabled" ) ).toBe( "false" );
		// Except for the article and breadcrumb, due to webpage being deactivated.
		expect( elements.disabledBy[ SCHEMA.ARTICLE ].getAttribute( "aria-disabled" ) ).toBe( "true" );
		expect( elements.disabledBy[ SCHEMA.BREADCRUMB ].getAttribute( "aria-disabled" ) ).toBe( "true" );
	} );
	it( "deactivating WebPage will deactivate and disable Article and Breadcrumb", () => {
		const dependencies = [ SCHEMA.ARTICLE, SCHEMA.BREADCRUMB ];
		const elements = testSwitchCascadeFor( SCHEMA.WEBPAGE, dependencies, dependencies );

		// Change the main switch state, it should be on again.
		elements.main.click();
		expect( elements.main.getAttribute( "aria-checked" ) ).toBe( "true" );
		// Check the disableAlso switches, they should be off still.
		forEach( elements.disableAlso, element => {
			expect( element.getAttribute( "aria-checked" ) ).toBe( "false" );
		} );
		// Check the disabledBy switches, they should not be disabled anymore.
		forEach( elements.disabledBy, element => {
			expect( element.getAttribute( "aria-disabled" ) ).toBe( "false" );
		} );
	} );
} );
