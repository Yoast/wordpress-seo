jest.unmock( '../js/progressIndicator' );

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ProgressIndicator from '../js/progressIndicator';

describe( 'processIndicator component', () => {

	console.error = jest.genMockFn();

	let inputProps = {
		currentStepNumber: 1,
		totalSteps: 1
	};

	it( 'has a div container', () => {
		let processIndicator = new ProgressIndicator( {
			currentStepNumber: '',
			totalSteps: ''
		} );
		console.log(processIndicator);

		expect( processIndicator.type ).toEqual( 'div' );
	} );

	it( 'shows a paragraph with the progress', () => {
		let processIndicator = new ProgressIndicator( {
			currentStepNumber: '',
			totalSteps: ''
		} );
		console.log(processIndicator.props.children);

		expect( processIndicator.props.children.type ).toEqual( 'p' );
	} );

	//todo check default props with component initialization.

	//todo check required params

	//todo check wrong parameter(prop) types
} );