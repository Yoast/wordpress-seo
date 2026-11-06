import React, { act } from "react";
import renderer from "react-test-renderer";

import Heading from "../src/Heading.js";

test( "the Heading without props matches the snapshot", () => {
	let component;
	act( () => {
		component = renderer.create(
			<Heading>Text</Heading>
		);
	} );

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the Heading with props matches the snapshot", () => {
	let component;
	act( () => {
		component = renderer.create(
			<Heading level={ 2 } className="some-class">Text</Heading>
		);
	} );

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
