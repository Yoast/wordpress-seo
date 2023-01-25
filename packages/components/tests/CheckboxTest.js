import React from "react";
import renderer from "react-test-renderer";

import Checkbox from "../src/checkbox/Checkbox";

describe( "Checkbox", () => {
	it( "matches the snapshot", () => {
		const component = renderer.create(
			<Checkbox id="test-id" label="test label" />
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "matches the snapshot when an array is provided as a label", () => {
		const component = renderer.create(
			<Checkbox id="test-id" label={ [ "test label ", "using arrays" ] } />
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "executes callback once", () => {
		const event = {
			target: {
				checked: false,
			},
		};
		const onChange = jest.fn();
		const component = renderer.create(
			<Checkbox
				id="testCallback"
				onChange={ onChange }
				label="testCallbackLabel"
			/>
		);

		const tree = component.toTree();
		tree.props.onChange( event );

		expect( onChange ).toHaveBeenCalledTimes( 1 );
	} );
} );
