import React from "react";
import renderer from "react-test-renderer";
import SearchBar from "../src/SearchBar";

test( "the SearchBar component with headingText matches the snapshot", () => {
	const component = renderer.create(
		<SearchBar headingText="Headingtext" searchButtonText="Search" searchString="" submitAction={ () => {} } />
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the SearchBar component without headingText matches the snapshot", () => {
	const component = renderer.create(
		<SearchBar searchButtonText="Search" searchString="" submitAction={ () => {} } />
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
