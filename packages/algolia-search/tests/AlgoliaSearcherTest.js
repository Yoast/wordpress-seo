import React from "react";
import { createComponentWithIntl } from "yoast-components/utils/intlProvider";
import AlgoliaSearcher from "../index.js";

test( "the AlgoliaSearcher component with headingText matches the snapshot", () => {
	const component = createComponentWithIntl(
		<AlgoliaSearcher />
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
