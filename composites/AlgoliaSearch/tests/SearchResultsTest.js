import React from "react";
import renderer from "react-test-renderer";

import SearchResults from "../SearchResults.js";

let post = { permalink: "https://kb.yoast.com/kb/passive-voice/", postTitle: "Post Title", objectID: 1 };

test( "the SearchResults component with results matches the snapshot", () => {
	const component = renderer.create(
		<SearchResults handler={ () => {} }
					   post={ post }
					   showDetail={ () => {} }
					   searchString="Test"
					   results={ [ post ] }
					   noResultsText="No Results"
					   foundResultsText="These are your %d results"
		/>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the SearchResults component without results matches the snapshot", () => {
	const component = renderer.create(
		<SearchResults handler={ () => {} }
					   post={ {} }
					   showDetail={ () => {} }
					   searchString="Test"
					   results={ [] }
					   noResultsText="No Results"
					   foundResultsText="These are your %d results"
		/>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
