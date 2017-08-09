import React from "react";
import renderer from "react-test-renderer";

import { ListTable, ZebrafiedListTable } from "../Table/ListTable";

test( "the ListTable component matches the snapshot", () => {
	const component = renderer.create(
		<ListTable/>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the ZebrafiedListTable component matches the snapshot", () => {
	const component = renderer.create(
		<ZebrafiedListTable>
			<li><span/></li>
		</ZebrafiedListTable>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
