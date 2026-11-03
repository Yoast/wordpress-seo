import React, { act } from "react";
import renderer from "react-test-renderer";

import { Row, RowResponsiveWrap } from "../src/table/Row";

test( "the Row component matches the snapshot", () => {
	let component;
	act( () => {
		component = renderer.create(
			<Row rowHeight="48px" />
		);
	} );

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the RowResponsiveWrap component matches the snapshot", () => {
	let component;
	act( () => {
		component = renderer.create(
			<RowResponsiveWrap />
		);
	} );

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

