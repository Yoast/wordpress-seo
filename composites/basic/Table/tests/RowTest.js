import React from "react";
import renderer from "react-test-renderer";

import { Row, RowResponsiveWrap } from "../../Table/Row";

test( "the Row component matches the snapshot", () => {
	const component = renderer.create(
		<Row rowHeight="48px"/>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the RowResponsiveWrap component matches the snapshot", () => {
	const component = renderer.create(
		<RowResponsiveWrap />
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

