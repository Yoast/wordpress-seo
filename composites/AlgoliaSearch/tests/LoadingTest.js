import React from "react";
import renderer from "react-test-renderer";

import Loading from "../Loading.js";

test( "the Loading component matches the snapshot", () => {
	const component = renderer.create(
		<Loading placeholder="Loading..." />
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
