jest.unmock( "../SearchResultPreview" );
jest.unmock( "i18n-calypso" );

import React from "react";
import TestUtils from "react-addons-test-utils";
import SearchResultPreview from "../SearchResultPreview";

describe( "A SearchResultPreview component", () => {
	var renderer = TestUtils.createRenderer();

	it( "generates a SearchResultPreview based on the props", () => {
		renderer.render( <SearchResultPreview label="SearchResultPreview" translate={{}}/> );

		let result = renderer.getRenderOutput();

		expect( result.props.label ).toBe( "SearchResultPreview" );
	} );
} );
