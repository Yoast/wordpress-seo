import React from "react";
import renderer from "react-test-renderer";

import { Row, RowMobileCollapse } from "../Table/Row";

test( "the Row component matches the snapshot", () => {
	const component = renderer.create(
		<Row />
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the RowMobileCollapse component matches the snapshot", () => {
	const component = renderer.create(
		<RowMobileCollapse />
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

