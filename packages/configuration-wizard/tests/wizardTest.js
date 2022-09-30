/* External dependencies */
import React from "react";
import Enzyme from "enzyme";
import EnzymeAdapter from "enzyme-adapter-react-16";
import cloneDeep from "lodash/cloneDeep";

/* Internal dependencies */
import Config from "../tools/config/production-config";
import Wizard from "../src/ConfigurationWizard";
import ApiConfig from "../tools/config/api-config";

Enzyme.configure( { adapter: new EnzymeAdapter() } );

jest.mock( "@yoast/helpers", () => {
	/**
	 * An ajaxHelper for testing purposes.
	 *
	 * @returns {promise} A test promise.
	 */
	const ajaxHelper = () => {
		return new Promise( ( resolve ) => {
			resolve( "test" );
		} );
	};

	return { ...jest.requireActual( "@yoast/helpers" ), ajaxHelper };
} );

/**
 * Test user events
 * Test the response to those events
 * Make sure the right things render at the right time
 * Re-run tests on file changes
 */
describe( "a wizard component", () => {
	let renderedWizard;
	let config;

	beforeEach( () => {
		config = cloneDeep( Config );
		config.endpoint = ApiConfig;
		renderedWizard = Enzyme.mount( <Wizard { ...config } /> );
	} );

	it( "loads props from config correctly", () => {
		// Compare the properties from the config with the properties in the properties.
		expect( renderedWizard.props().endpoint ).toEqual( config.endpoint );
		expect( renderedWizard.props().steps.count ).toEqual( config.steps.count );
		expect( renderedWizard.props().fields.count ).toEqual( config.fields.count );
		expect( renderedWizard.props().customComponents ).toEqual( config.customComponents );
	} );
} );
