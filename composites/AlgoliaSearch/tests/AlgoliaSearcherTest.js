import React from "react";
import { createComponentWithIntl } from "../../../utils/intlProvider";
import AlgoliaSearcher from "../AlgoliaSearcher.js";
jest.mock( "svg-url-loader!../../icons/search.svg", () => {
	return "mockedSvg";
} );


test( "the AlgoliaSearcher component with headingText matches the snapshot", () => {
	const component = createComponentWithIntl(
		<AlgoliaSearcher />
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
