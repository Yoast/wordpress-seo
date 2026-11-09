import React from "react";
import { render } from "@testing-library/react";

import { Row, RowResponsiveWrap } from "../src/table/Row";

test( "the Row component matches the snapshot", () => {
	const { container } = render(
		<Row rowHeight="48px" />
	);

	expect( container.firstChild ).toMatchSnapshot();
} );

test( "the RowResponsiveWrap component matches the snapshot", () => {
	const { container } = render(
		<RowResponsiveWrap />
	);

	expect( container.firstChild ).toMatchSnapshot();
} );

