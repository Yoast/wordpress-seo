jest.unmock( "../OnboardingWizard" );
jest.unmock( "lodash/cloneDeep" );
jest.unmock( "../config/production-config" );
jest.unmock( "material-ui/utils/withWidth" );
jest.mock( '../helpers/ajaxHelper', () => {

	let ajaxHelper = ( url, data ) => {
		return new Promise( ( resolve, reject ) => {
			resolve( "test" );
		} );
	};

	return ajaxHelper;
} );

import React from "react";
import Wizard from "../OnboardingWizard";
import Config from "../config/production-config";
import {mount, shallow, render} from "enzyme";
import cloneDeep from "lodash/cloneDeep";
import ApiConfig from "../config/api-config";

/**
 *
 * Test user events
 * Test the response to those events
 * Make sure the right things render at the right time
 * Re-run tests on file changes
 *
 */
describe( "a wizard component", () => {
	let renderedWizard = undefined;
	let config = undefined;

	beforeEach( () => {
		config = cloneDeep( Config );
		config.endpoint = ApiConfig;
		renderedWizard = mount( <Wizard {...config} /> );
	} );

	it( "loads props from config correctly", () => {
		// Compare the properties from the config with the properties in the properties.
		expect( renderedWizard.props().endpoint ).toEqual( config.endpoint );
		expect( renderedWizard.props().steps.count ).toEqual( config.steps.count );
		expect( renderedWizard.props().fields.count ).toEqual( config.fields.count );
		expect( renderedWizard.props().customComponents ).toEqual( config.customComponents );
	} );

	it( "has correct initial state", () => {
		expect( renderedWizard.state().isLoading ).toBeFalsy();

		// Check if the current step is the same as the first step in the config.
		const StepNames = Object.keys( config.steps );
		expect( renderedWizard.state().currentStepId ).toEqual( StepNames[ 0 ] );

		// Check if the steps are parsed correctly
		const steps = renderedWizard.state().steps;
		expect( steps.intro.next ).toBe( StepNames[ 1 ] );
		expect( steps.intro.previous ).toBeUndefined();
		expect( steps[ StepNames[ 1 ] ].previous ).toBe( StepNames[ 0 ] );

		// Test step count.
		expect( renderedWizard.node.stepCount ).toEqual( Object.keys( steps ).length );
	} );

	it( "renders a wizard component based on the config", () => {
	} );

	it( "goes to the next step", () => {
		// check for isLoading
		// check for previous button rendered
	} );

	it( "goes to the previous step", () => {

	} );

	it( "does not render the next button when on the last step", () => {

	} );

	it( "renders the step correctly", () => {

	} );

	it( "saves the current step, when moving to another step", () => {

	} );

	it( "does not go to another step, when saving the current progress fails", () => {

	} );

	it( "does not go to the next step, when saving the progress fails", () => {

	} );
} );