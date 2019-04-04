import React from "react";
import renderer from "react-test-renderer";

import Icon from "../src/Icon";
import SeoIcon from "../src/SeoIcon";

test( "the Icon without props matches the snapshot", () => {
	const component = renderer.create(
		<Icon icon={ SeoIcon } />
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the Icon with props matches the snapshot", () => {
	const component = renderer.create(
		<Icon icon={ SeoIcon } color="red" width="200px" height="200px" />
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
