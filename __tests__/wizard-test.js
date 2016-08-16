jest.unmock( "../js/wizard" );

import React from "react";
import TestUtils from "react-addons-test-utils";
import Wizard from "../js/wizard";
import Config from "../js/config";
import ProgressIndicator from "../js/progressIndicator";
import Step from "../js/step";
import { shallow, mount, render } from 'enzyme';

//jest.dontMock( "../js/wizard" );

/**
 *
 * Test user events
 * Test the response to those events
 * Make sure the right things render at the right time
 * Re-run tests on file changes
 *
 */
describe( "a wizard component", () => {

	it( "receives the props", () => {
		const wrapper = shallow(<Wizard {...Config} />);
		expect(wrapper.find('button').length).toBe(2);

		let nextButton = wrapper.find('button').last().simulate('click');

//		console.log(nextButton);
		nextButton.simulate('click');
		console.log(wrapper.find('button').first());
		let previousButton = wrapper.find('button').nodes[0];

		expect(nextButton)
	} );
	/*	it( "has correct initial state", () => {

	 } );
	 it( "contains a step object", () => {

	 } );
	 it( "goes to the next step", () => {

	 } );
	 it( "goes to the previous step", () => {

	 } );
	 it( "saves the current step, when moving to another step", () => {

	 } );
	 it( "does not go to another step, when saving the current progress fails", () => {

	 } );
	 it( "does not go to the next step, when saving the progress fails", () => {

	 } );*/


	//TODO test the step parser (parseSteps)

	//TODO test parseFields

	//TODO test postStep (saving the fields)

	//TODO test get current step number

	//TODO test progress

	//TODO test render output contains <div><button><ProgressIndicator><Step><Button>
} );