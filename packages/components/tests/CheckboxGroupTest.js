import React from "react";
import renderer from "react-test-renderer";

import CheckboxGroup from "../src/checkbox/CheckboxGroup";

describe( "CheckboxGroup", () => {
	it( "should render with only the required props", () => {
		const component = renderer.create( <CheckboxGroup
			id="test-id"
			label="Nice label"
			options={ [ { label: "Hi", id: "hi" }, { label: "Hello", id: "hello" } ] }
		/> );
		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "should fire the onChange event when checkbox is changed", () => {
		const onChange = jest.fn();
		const component = renderer.create( <CheckboxGroup
			id="test-id-2"
			label="very nice"
			options={ [
				{
					label: "Hey",
					id: "id1",
				},
				{
					label: "Ho",
					id: "id2",
					checked: true,
				},
			] }
			onChange={ onChange }
		/> ).root;

		const checkbox = component.findByProps( { id: "id1" } );
		checkbox.props.onChange( { target: { id: "id1" } } );
		expect( onChange ).toHaveBeenCalledTimes( 1 );
	} );
} );
