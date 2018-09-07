import React from "react";
import { createComponentWithIntl } from "../../../utils/intlProvider";
import SearchBar from "../SearchBar.js";

test( "the SearchBar component with headingText matches the snapshot", () => {
	const component = createComponentWithIntl(
		<SearchBar headingText="Headingtext" searchButtonText="Search" searchString="" submitAction={ () => {} } />
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the SearchBar component without headingText matches the snapshot", () => {
	const component = createComponentWithIntl(
		<SearchBar searchButtonText="Search" searchString="" submitAction={ () => {} } />
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
