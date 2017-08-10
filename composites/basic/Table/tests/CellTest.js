import React from "react";
import renderer from "react-test-renderer";

import { PrimaryCell, FixedWidthCell, MinWidthCell, IconCell, responsiveHeaders } from "../../Table/Cell";

test( "the PrimaryCell component matches the snapshot", () => {
	const component = renderer.create(
		<PrimaryCell headerLabel="PrimaryCell">
			This is a primary cell
		</PrimaryCell>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the FixedWidthCell component matches the snapshot", () => {
	const component = renderer.create(
		<FixedWidthCell headerLabel="FixedWidthCell">
			This is a cell with a fixed width
		</FixedWidthCell>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the MinWidthCell component matches the snapshot", () => {
	const component = renderer.create(
		<MinWidthCell headerLabel="MinWidthCell">
			This is a call with a min width
		</MinWidthCell>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the IconCell component matches the snapshot", () => {
	const component = renderer.create(
		<IconCell headerLabel="IconCell">
			Icon
		</IconCell>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the PrimaryCell with responsiveHeaders matches the snapshot", () => {
	let PrimaryCellResponsive = responsiveHeaders( PrimaryCell );
	const component = renderer.create(
		<PrimaryCellResponsive headerLabel="responsiveHeaders">
			This is a primary cell with responsive headers
		</PrimaryCellResponsive>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
