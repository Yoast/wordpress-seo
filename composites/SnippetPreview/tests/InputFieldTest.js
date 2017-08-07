import React from "react";
import renderer from "react-test-renderer";
import InputField from "../components/InputField";

test( "the logo matches the snapshot", () => {
	const component = renderer.create(
			<InputField placeholder="placeholder"/>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
