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

		const checkbox = TestUtils.renderIntoDocument(
			<Input {...inputProps} />
		);

		const inputNode = ReactDOM.findDOMNode( checkbox );

		expect( true );
	} )

} );