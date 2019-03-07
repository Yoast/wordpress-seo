import React from "react";
import renderer from "react-test-renderer";

import Heading from "../Heading.js";

test( "the Heading without props matches the snapshot", () => {
	const component = renderer.create(
		<Heading>Text</Heading>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the Heading with props matches the snapshot", () => {
	const component = renderer.create(
		<Heading level={ 2 } className="some-class">Text</Heading>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
