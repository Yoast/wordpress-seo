jest.unmock( '../js/components/input' );

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Input from '../js/components/input';

describe( 'input-object-test', () => {

	it( 'has correct props', () => {

		let inputProps = {
			label: 'label',
			placeholder: 'text here..',
			type: 'radio',
			name: 'text_input',
			data: 'test data',
			properties: {
				label: 'title'
			}
		}

		let renderer = TestUtils.createRenderer();
		renderer.render( <Input {...inputProps} /> );

		let result = renderer.getRenderOutput();

		console.log( result.props );

		expect( true );
	} )

} );