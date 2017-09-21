import React from "react";
import { createComponentWithIntl } from "../../../utils/intlProvider";
import AlgoliaSearcher from "../AlgoliaSearcher.js";

test( "the AlgoliaSearcher component with headingText matches the snapshot", () => {
	const component = createComponentWithIntl(
		<AlgoliaSearcher />
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
