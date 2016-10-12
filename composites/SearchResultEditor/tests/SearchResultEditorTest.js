jest.unmock( "../SearchResultEditor" );
jest.unmock( "i18n-calypso" );

import React from "react";
import TestUtils from "react-addons-test-utils";
import SearchResultEditor from "../SearchResultEditor";

describe( "A SearchResultEditor component", () => {
	var renderer = TestUtils.createRenderer();

	it( "generates a SearchResultEditor based on the props", () => {
		renderer.render( <SearchResultEditor baseUrl="google.com/" /> );
	} );
} );
