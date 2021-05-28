import React from "react";
import renderer from "react-test-renderer";

import { Select } from "../src/select/Select";

describe( "Select", () => {
	it( "should render a select", () => {
		const mockChange = jest.fn();
		const component = renderer.create(
			<Select
				label="Nice label"
				options={ [ { name: "hi", value: "hi" }, { name: "ho", value: "ho" } ] }
				id="my-awesome-multiselect"
				name="my-selection"
				selected="hi"
				onChange={ mockChange }
			/>
		);
		const json = component.toJSON();
		const tree = component.toTree();
		const select = tree.rendered.rendered.rendered[ 1 ];

		expect( json ).toMatchSnapshot();
		expect( select.props.value ).toBe( "hi" );
		select.props.onBlur( { target: { value: "hi" } } );
		expect( mockChange ).toHaveBeenCalledTimes( 1 );
	} );
} );
