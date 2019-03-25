import React from "react";
import renderer from "react-test-renderer";

import { BaseLinkButton, LinkButton } from "../src/index";

test( "the BaseLinkButton matches the snapshot", () => {
	const component = renderer.create(
		<BaseLinkButton>LinkButtonValue</BaseLinkButton>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the LinkButton matches the snapshot", () => {
	const component = renderer.create(
		<LinkButton>LinkButtonValue</LinkButton>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
