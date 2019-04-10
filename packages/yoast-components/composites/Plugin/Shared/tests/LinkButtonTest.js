import React from "react";
import renderer from "react-test-renderer";

import { LinkButton } from "../components/LinkButton";

test( "the LinkButton matches the snapshot", () => {
	const component = renderer.create(
		<LinkButton>LinkButtonValue</LinkButton>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
