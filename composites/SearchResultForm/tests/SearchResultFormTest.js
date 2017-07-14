jest.unmock( "../SearchResultForm" );
jest.unmock( "../../../utils/i18n" );
jest.unmock( "prop-types" );

import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import SearchResultForm from "../SearchResultForm";

describe( "A SearchResultForm component", () => {
	let renderer = new ReactShallowRenderer();

	it( "generates a SearchResultForm based on the props", () => {
		renderer.render( <SearchResultForm name="SearchResultForm" label="SearchResultForm" translate={{}} eventHandler={() => {}} /> );

		let result = renderer.getRenderOutput();

		expect( result.props.label ).toBe( "SearchResultForm" );
	} );
} );
