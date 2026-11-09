import React, { act } from "react";
import renderer from "react-test-renderer";

import { ListTable, ZebrafiedListTable } from "../src/table/ListTable";

test( "the ListTable component matches the snapshot", () => {
	let component;
	act( () => {
		component = renderer.create(
			<ListTable />
		);
	} );

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the ZebrafiedListTable component with one child matches the snapshot", () => {
	let component;
	act( () => {
		component = renderer.create(
			<ZebrafiedListTable>
				<li />
			</ZebrafiedListTable>
		);
	} );

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the ZebrafiedListTable component with multiple children matches the snapshot", () => {
	let component;
	act( () => {
		component = renderer.create(
			<ZebrafiedListTable>
				<li />
				<li />
			</ZebrafiedListTable>
		);
	} );

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
