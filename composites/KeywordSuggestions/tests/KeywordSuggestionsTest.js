import KeywordSuggestions from "../KeywordSuggestions";
import React from "react";
import renderer from "react-test-renderer";

/* eslint-disable require-jsdoc */
function createWord( word ) {
	return {
		getCombination: () => {
			return word;
		},
	};
}

function createWords( words ) {
	return words.map( createWord );
}
/* eslint-enable require-jsdoc */

describe( "KeywordSuggestions", function() {
	it( "renders keyword suggestions as list items", () => {
		var words = [];

		let keywordSuggestions = renderer.create(
			<KeywordSuggestions relevantWords={words} />
		);

		let tree = keywordSuggestions.toJSON();
		expect( tree ).toMatchSnapshot();

		words = createWords( [ "word1", "word2", "word3" ] );

		keywordSuggestions = renderer.create(
			<KeywordSuggestions relevantWords={words} />
		);

		tree = keywordSuggestions.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "renders correctly without items", () => {
		let words = [];

		let keywordSuggestions = renderer.create(
			<KeywordSuggestions relevantWords={words} />
		);

		let tree = keywordSuggestions.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
} );
