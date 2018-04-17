import React from "react";
import renderer from "react-test-renderer";

import Checkbox from "../components/Checkbox";

describe( Checkbox, () => {
	it( "matches the snapshot", () => {
		const component = renderer.create(
			<Checkbox id="test-id" onChange={() => {
			}} label="test label"/>
		);

		let tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	});

	it( "matches the snapshot when an array is provided as a label", () => {
		const component = renderer.create(
			<Checkbox id="test-id" onChange={() => {
			}} label={["test label ", "using arrays"]}/>
		);

		let tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	});

	it( "executes callback once", () => {
		let event = {
			target: {
				checked: false,
			},
		};
		let onChange = jest.fn();
		const component = renderer.create(
			<Checkbox
				id="testCallback"
				onChange={onChange}
				label="testCallbackLabel"
			/>
		);

		let tree = component.toJSON();
		tree[0].props.onChange(event);

		expect(onChange).toHaveBeenCalledTimes(1);
	});
} );
