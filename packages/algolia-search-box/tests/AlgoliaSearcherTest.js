import React from "react";
import renderer from "react-test-renderer";
import AlgoliaSearcher from "../src/index";

test( "the AlgoliaSearcher component with headingText matches the snapshot", () => {
	const component = renderer.create(
		<AlgoliaSearcher />
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
