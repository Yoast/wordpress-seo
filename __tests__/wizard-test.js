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

	it( ' fails on missing required parameters ', () => {
		//todo required params: steps, endpoint, fields
		return false;
	} );

	it( 'fails on incorrect parameter types', () => {
		return false;
	} );

	it( 'fails on empty required values', () => {
		//todo throw error when steps(array) is empty.
		return false;
	} );

} )
;