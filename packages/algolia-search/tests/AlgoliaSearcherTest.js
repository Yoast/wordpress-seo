import React from "react";
import { createComponentWithIntl } from "@yoast/components";
import AlgoliaSearcher from "../src/index";

test( "the AlgoliaSearcher component with headingText matches the snapshot", () => {
	const component = createComponentWithIntl(
		<AlgoliaSearcher />
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
