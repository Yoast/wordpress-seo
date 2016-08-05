jest.unmock('../forms/Input');

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Input from '../forms/Input';

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

		expect( result.props.type ).toBe( "text" );
	} );
} );


