import React, { act } from "react";
import renderer from "react-test-renderer";

import Paper from "../src/Paper.js";

test( "the Paper without props matches the snapshot", () => {
	let component;
	act( () => {
		component = renderer.create(
			<Paper />
		);
	} );

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the Paper with props matches the snapshot", () => {
	let component;
	act( () => {
		component = renderer.create(
			<Paper backgroundColor="#eee" minHeight="10em" />
		);
	} );

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
