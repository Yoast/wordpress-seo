jest.unmock( "../SearchResultEditor" );
jest.unmock( "../../../utils/i18n" );
jest.unmock( "prop-types" );

import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import SearchResultEditor from "../SearchResultEditor";

describe( "A SearchResultEditor component", () => {
	let renderer = new ReactShallowRenderer();

	it( "generates a SearchResultEditor based on the props", () => {
		renderer.render( <SearchResultEditor baseUrl="google.com/" /> );
	} );
} );
