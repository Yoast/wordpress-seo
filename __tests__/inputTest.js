jest.unmock('../Input');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Input from '../Input';

describe( 'Input', () => {
	it( 'generates an input, based on the props', () => {
		let renderer = TestUtils.createRenderer();
		renderer.render( <Input type="text" name="testinput" /> );

		let result = renderer.getRenderOutput();

		expect( result.props.name ).toBe( "testinput" );
	} );

	it( 'generates an input, based on the props', () => {
		let renderer = TestUtils.createRenderer();
		renderer.render( <Input name="testinput" /> );

		let result = renderer.getRenderOutput();

		console.log( result );

		expect( result.props.type ).toBe( "text" );
	} );
} );


