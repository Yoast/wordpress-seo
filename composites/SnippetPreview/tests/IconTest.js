import React from "react";
import renderer from "react-test-renderer";

import Edit from "../../../style-guide/svg/edit.svg";
import { Icon } from "../components/Icon";

test( "the Icon matches the snapshot", () => {
	const component = renderer.create(
		<Icon icon={ Edit } color="black"  />
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
