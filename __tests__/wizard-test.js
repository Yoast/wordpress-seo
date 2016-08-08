jest.unmock( '../js/step' );

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Wizard from '../js/wizard';
import Config from '../js/config';

describe( 'step component', () => {

	let inputProps = {
		endpoint: "",
		steps: {},
		currentStepId: "",
		components: {},
		customComponents: {},
		fields: {}
	};

	let renderer = TestUtils.createRenderer();
	renderer.render( <Wizard {...Config} /> );

	let wizard = renderer.getRenderOutput();

	//TODO add real test.
	it( ' fails on missing required parameters ', () => {
		//todo required params: steps, endpoint, fields
		expect(true);
	} );

	//TODO add real test.
	it( 'fails on incorrect parameter types', () => {
		expect(true);
	} );

	//TODO add real test.
	it( 'fails on empty required values', () => {
		//todo throw error when steps(array) is empty.
		expect(true);
	} );

} )
;