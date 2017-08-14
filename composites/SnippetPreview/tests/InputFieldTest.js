import React from "react";
import renderer from "react-test-renderer";
import InputField from "../components/InputField";

jest.mock( "draft-js/lib/generateRandomKey", () => () => "test" );

test( "the input field matches the snapshot", () => {
	const component = renderer.create(
		<InputField placeholder="placeholder"/>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
