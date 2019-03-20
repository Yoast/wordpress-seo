import React from "react";

import { createComponentWithIntl } from "@yoast/components";
import SearchResultDetail from "../src/SearchResultDetail.js";
const post = { permalink: "https://kb.yoast.com/kb/passive-voice/", postTitle: "Post Title", objectID: 1 };

test( "the SearchResultDetail component matches the snapshot", () => {
	const component = createComponentWithIntl(
		<SearchResultDetail post={ post } showDetail={ () => {} } onBackButtonClicked={ () => {} } iframeTitle="Title" />
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
