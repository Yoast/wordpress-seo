import React from "react";
import renderer from "react-test-renderer";

import KeywordInput from "../components/KeywordInput";


describe( KeywordInput, () => {
	it( "matches the snapshot by default", () => {
		const component = renderer.create(
			<KeywordInput
				id="test-id"
				onChange={ () => {} }
				onRemoveKeyword={ () => {} }
				label="test label"
				ariaLabel="test"
			/>
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "does not display the error message for a single keyword", () => {

	} );

	it( "does not display the error message for two words separated by whitespace", () => {

	} );

	it( "does not displays the error message for comma-separated words", () => {

	} );

	it( "does displays the error message if submitted as prop", () => {

	} );
} );
