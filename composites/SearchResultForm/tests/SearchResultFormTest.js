jest.unmock("../SearchResultForm");

import React from "react";
import TestUtils from "react-addons-test-utils";
import SearchResultForm from "../SearchResultForm";

describe( "A SearchResultForm component", () => {
	var renderer = TestUtils.createRenderer();

	it( "generates a SearchResultForm based on the props", () => {
		renderer.render( <SearchResultForm /> );

		let result = renderer.getRenderOutput();
	} );

} );
