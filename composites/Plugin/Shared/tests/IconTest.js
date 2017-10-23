import React from "react";
import renderer from "react-test-renderer";

import edit from "../../../../style-guide/svg/edit.svg";
import { Icon } from "../components/Icon";

test( "the Icon matches the snapshot", () => {
	const component = renderer.create(
		<Icon icon={ edit } color="black" size="16px" />
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
