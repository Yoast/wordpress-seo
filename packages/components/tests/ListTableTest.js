import React from "react";
import { render } from "@testing-library/react";

import { ListTable, ZebrafiedListTable } from "../src/table/ListTable";

test( "the ListTable component matches the snapshot", () => {
	const { container } = render(
		<ListTable />
	);

	expect( container.firstChild ).toMatchSnapshot();
} );

test( "the ZebrafiedListTable component with one child matches the snapshot", () => {
	const { container } = render(
		<ZebrafiedListTable>
			<li />
		</ZebrafiedListTable>
	);

	expect( container.firstChild ).toMatchSnapshot();
} );

test( "the ZebrafiedListTable component with multiple children matches the snapshot", () => {
	const { container } = render(
		<ZebrafiedListTable>
			<li />
			<li />
		</ZebrafiedListTable>
	);

	expect( container.firstChild ).toMatchSnapshot();
} );
