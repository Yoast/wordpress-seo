import React from "react";
import renderer from "react-test-renderer";

import { Icon } from "../components/Icon";

test( "the Icon matches the snapshot", () => {
	const component = renderer.create(
		<Icon />
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
