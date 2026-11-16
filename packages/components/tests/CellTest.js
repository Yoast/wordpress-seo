import React from "react";
import { render } from "@testing-library/react";

import { CellPrimary, CellFixedWidth, CellMinWidth, CellIcon, responsiveHeaders } from "../src/table/Cell";

test( "the CellPrimary component matches the snapshot", () => {
	const { container } = render(
		<CellPrimary headerLabel="PrimaryCell">
			This is a primary cell
		</CellPrimary>
	);

	expect( container.firstChild ).toMatchSnapshot();
} );

test( "the CellFixedWidth component matches the snapshot", () => {
	const { container } = render(
		<CellFixedWidth headerLabel="FixedWidthCell">
			This is a cell with a fixed width
		</CellFixedWidth>
	);

	expect( container.firstChild ).toMatchSnapshot();
} );

test( "the CellMinWidth component matches the snapshot", () => {
	const { container } = render(
		<CellMinWidth headerLabel="MinWidthCell">
			This is a call with a min width
		</CellMinWidth>
	);

	expect( container.firstChild ).toMatchSnapshot();
} );

test( "the CellIcon component matches the snapshot", () => {
	const { container } = render(
		<CellIcon headerLabel="IconCell">
			Icon
		</CellIcon>
	);

	expect( container.firstChild ).toMatchSnapshot();
} );

test( "the CellPrimary with responsiveHeaders matches the snapshot", () => {
	const CellPrimaryResponsive = responsiveHeaders( CellPrimary );
	const { container } = render(
		<CellPrimaryResponsive headerLabel="responsiveHeaders">
			This is a primary cell with responsive headers
		</CellPrimaryResponsive>
	);

	expect( container.firstChild ).toMatchSnapshot();
} );
