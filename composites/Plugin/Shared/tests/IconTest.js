import React from "react";
import renderer from "react-test-renderer";

import edit from "../../../../style-guide/svg/edit.svg";
import { Icon } from "../components/Icon";
import { IconWithAriaLabel } from "../components/Icon";

test( "the Icon matches the snapshot", () => {
	const component = renderer.create(
		<Icon icon={ edit } color="black" size="16px" />
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the IconWithAriaLabel matches the snapshot", () => {
	const component = renderer.create(
		<IconWithAriaLabel icon={ edit } color="black" size="16px" ariaLabel="This is an aria label" />
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
