import React from "react";
import renderer from "react-test-renderer";

import Loading from "../src/Loading";

test( "the Loading component matches the snapshot", () => {
	const component = renderer.create(
		<Loading placeholder="Loading..." />
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
