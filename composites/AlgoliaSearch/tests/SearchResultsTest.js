import React from "react";

import { createComponentWithIntl } from "../../../utils/intlProvider";
import SearchResults from "../SearchResults.js";

const post = { permalink: "https://kb.yoast.com/kb/passive-voice/", postTitle: "Post Title", objectID: 1 };

test( "the SearchResults component with results matches the snapshot", () => {
	const component = createComponentWithIntl(
		<SearchResults
			onClick={ () => {} }
			post={ post }
			showDetail={ () => {} }
			searchString="Test"
			results={ [ post ] }
			noResultsText="No Results"
			foundResultsText="These are your %d results"
		/>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the SearchResults component without results matches the snapshot", () => {
	const component = createComponentWithIntl(
		<SearchResults
			onClick={ () => {} }
			post={ {} }
			showDetail={ () => {} }
			searchString="Test"
			results={ [] }
			noResultsText="No Results"
			foundResultsText="These are your %d results"
		/>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
