import React from "react";
import renderer from "react-test-renderer";

import IFrame from "../IFrame.js";

test( "the IFrame without props matches the snapshot", () => {
	const component = renderer.create(
		<IFrame title="IFrame title" />
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the IFrame with props matches the snapshot", () => {
	const component = renderer.create(
		<IFrame title="IFrame title" className="test-class-name" />
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
