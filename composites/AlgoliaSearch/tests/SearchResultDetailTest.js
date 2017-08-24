import React from "react";
import renderer from "react-test-renderer";

import SearchResultDetail from "../SearchResultDetail.js";
let post = { permalink: "https://kb.yoast.com/kb/passive-voice/", post_title: "Post Title", objectID: 1 };

test( "the SearchResultDetail component matches the snapshot", () => {
	const component = renderer.create(
		<SearchResultDetail post={ post } showDetail={ () => {} } onClick={ () => {} } iframeTitle="Title"/>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
