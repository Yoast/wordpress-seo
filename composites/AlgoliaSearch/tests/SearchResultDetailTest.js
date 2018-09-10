import React from "react";

import { createComponentWithIntl } from "../../../utils/intlProvider";
import SearchResultDetail from "../SearchResultDetail.js";
const post = { permalink: "https://kb.yoast.com/kb/passive-voice/", postTitle: "Post Title", objectID: 1 };

test( "the SearchResultDetail component matches the snapshot", () => {
	const component = createComponentWithIntl(
		<SearchResultDetail post={ post } showDetail={ () => {} } onBackButtonClicked={ () => {} } iframeTitle="Title" />
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
