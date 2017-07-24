jest.unmock( "../SearchResultPreview" );
jest.unmock( "../../../utils/i18n" );
jest.unmock( "prop-types" );

import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import SearchResultPreview from "../SearchResultPreview";

describe( "A SearchResultPreview component", () => {
	let renderer = new ReactShallowRenderer();

	it( "generates a SearchResultPreview based on the props", () => {
		renderer.render( <SearchResultPreview label="SearchResultPreview" translate={{}}/> );

		let result = renderer.getRenderOutput();

		expect( result.props.label ).toBe( "SearchResultPreview" );
	} );
} );
