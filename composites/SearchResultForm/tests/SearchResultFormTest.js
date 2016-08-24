jest.unmock("../SearchResultForm");
jest.unmock("i18n-calypso");

import React from "react";
import TestUtils from "react-addons-test-utils";
import SearchResultForm from "../SearchResultForm";

describe( "A SearchResultForm component", () => {
	var renderer = TestUtils.createRenderer();

	it( "generates a SearchResultForm based on the props", () => {
		renderer.render( <SearchResultForm name="customTextArea" label="Custom Textarea" onChange={() => {}} /> );

		let result = renderer.getRenderOutput();

		expect(result.props.label).toBe( "Custom Textarea" );
	} );

} );
