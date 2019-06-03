import React from "react";

import renderer from "react-test-renderer";
import SearchResultDetail from "../src/SearchResultDetail";
const post = { permalink: "https://kb.yoast.com/kb/passive-voice/", postTitle: "Post Title", objectID: 1 };

test( "the SearchResultDetail component matches the snapshot", () => {
	const component = renderer.create(
		<SearchResultDetail post={ post } showDetail={ () => {} } onBackButtonClicked={ () => {} } iframeTitle="Title" />
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
