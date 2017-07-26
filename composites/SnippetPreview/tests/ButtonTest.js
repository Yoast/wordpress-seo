import React from "react";
import renderer from "react-test-renderer";

import Button from "../components/Button";

test( "the button matches the snapshot", () => {
	const component = renderer.create(
		<Button>ButtonValue</Button>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "button executes callback", () => {
	const component = renderer.create(
		<Button onClick={
			() => {
				return "clicked";
			}
		}>ButtonValue</Button>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();

	tree.props.onClick();

	tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
