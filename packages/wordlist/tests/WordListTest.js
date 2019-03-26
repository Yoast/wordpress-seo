import React from "react";
import renderer from "react-test-renderer";

import WordList from "../src/WordList";

describe( "WordList", function() {
	it( "renders wordlist as list items", () => {
		var words = [];

		let keywordSuggestions = renderer.create(
			<WordList title="Wordlist" words={ words } />
		);

		let tree = keywordSuggestions.toJSON();
		expect( tree ).toMatchSnapshot();

		words = [ "word1", "word2", "word3" ];

		keywordSuggestions = renderer.create(
			<WordList title="Wordlist" words={ words } />
		);

		tree = keywordSuggestions.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "renders correctly without items", () => {
		const words = [];

		const keywordSuggestions = renderer.create(
			<WordList title="Wordlist" words={ words } />
		);

		const tree = keywordSuggestions.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
} );
