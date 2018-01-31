import React from "react";
import renderer from "react-test-renderer";

import SvgIcon from "../components/SvgIcon";

test( "the SvgIcon matches the snapshot", () => {
	const component = renderer.create(
		<SvgIcon icon="edit" color="black" size="32px" className="my-icon" />
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
