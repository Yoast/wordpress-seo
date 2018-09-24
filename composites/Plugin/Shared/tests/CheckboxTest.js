import React from "react";
import renderer from "react-test-renderer";

import Checkbox from "../components/Checkbox";

describe( Checkbox, () => {
	it( "matches the snapshot", () => {
		const component = renderer.create(
			<Checkbox
				id="test-id" onChange={ () => {
				} } label="test label"
			/>
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "matches the snapshot when an array is provided as a label", () => {
		const component = renderer.create(
			<Checkbox
				id="test-id" onChange={ () => {
				} } label={ [ "test label ", "using arrays" ] }
			/>
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

		const tree = component.toJSON();
		tree[ 0 ].props.onChange( event );

		expect( onChange ).toHaveBeenCalledTimes( 1 );
	} );
} );
