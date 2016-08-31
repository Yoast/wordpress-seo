jest.unmock( "../composites/ConditionalTextField" );
jest.unmock( "../composites/Textfield" );
jest.unmock( "../Label" );
jest.unmock( "../Input" );

import React from "react";
import ConditionalTextField from "../composites/ConditionalTextField";
import {mount, shallow, render} from "enzyme";

describe( "A ConditionalTextField component", () => {
	let wrapper;
	let props;

	beforeEach( ()=> {
		props = {
			requires: {
				field: "fieldName",
				value: "testValue",
			},
			requiredFieldValue: "testValue",
			name: "testField",
			label: "testField",

			onChange: ()=> {
				return
			},
			optionalAttributes: {
				class: "test-class",
			}
		};
	} );

	it( "renders nothing if required field does not have the required value", () => {
		props.requiredFieldValue = "otherThanValue";

		wrapper = mount( <ConditionalTextField {...props} /> );

		expect( wrapper.find('Input').length ).toBe(0);
		expect( wrapper.find('Label').length ).toBe(0);
	} );

	it( "renders the conditional field if required field does have the required value", () => {
		wrapper = mount( <ConditionalTextField {...props} /> );

		expect( wrapper.find('Input').length ).toBe(1);
		expect( wrapper.find('Label').length ).toBe(1);
	} );

	it( "it fails with invalid required props", () => {
		props.requires = "";
		console.error = jest.genMockFn();

		wrapper = mount( <ConditionalTextField {...props} /> );

		expect( console.error ).toBeCalled();
		expect( console.error.mock.calls[0][0] )
			.toContain( "Warning: Failed prop type: Invalid prop `requires` of type `string` supplied to `ConditionalTextfield`, expected `object`." );
	} );

	it( "it renders correctly with valid props", () => {
		console.error = jest.genMockFn();

		wrapper = mount( <ConditionalTextField {...props} /> );

		expect( console.error.mock.calls.length ).toBe(0);
	} );
} );
