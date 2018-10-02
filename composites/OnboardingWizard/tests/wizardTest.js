jest.unmock( "../OnboardingWizard" );
jest.unmock( "lodash/cloneDeep" );
jest.unmock( "../config/production-config" );
jest.unmock( "material-ui/utils/withWidth" );
jest.unmock( "../../../utils/i18n" );
jest.unmock( "prop-types" );

import React from "react";
import Wizard from "../OnboardingWizard";
import Config from "../config/production-config";
import Enzyme from "enzyme";
import EnzymeAdapter from "enzyme-adapter-react-16";
import cloneDeep from "lodash/cloneDeep";
import ApiConfig from "../config/api-config";
import injectTapEventPlugin from "react-tap-event-plugin";

Enzyme.configure( { adapter: new EnzymeAdapter() } );

jest.mock( "../helpers/ajaxHelper", () => {
	const ajaxHelper = () => {
		return new Promise( ( resolve ) => {
			resolve( "test" );
		} );
	};
	return ajaxHelper;
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

	beforeAll( () => {
		injectTapEventPlugin();
	} );

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
