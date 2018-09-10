import React from "react";
import renderer from "react-test-renderer";

import { A11yNotice } from "../components/A11yNotice";

test( "the A11yNotice matches the snapshot", () => {
	const component = renderer.create(
		<A11yNotice>A11yNoticeValue</A11yNotice>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );


test( "the A11yNotice can be changed to a different element", () => {
	const H2A11yNotice = A11yNotice.withComponent( "h2" );

	const component = renderer.create(
		<H2A11yNotice>H2A11yNoticeValue</H2A11yNotice>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
	expect( tree.type ).toEqual( "h2" );
} );
