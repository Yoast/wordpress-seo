import React, { act } from "react";
import renderer from "react-test-renderer";

import WordList from "../src/WordList";

describe( "WordList", function() {
	it( "renders wordlist as list items", () => {
		const words = [ "word1", "word2", "word3" ];

		let wordlist;
		act( () => {
			wordlist = renderer.create(
				<WordList title="Wordlist" words={ words } />
			);
		} );

		const tree = wordlist.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "renders correctly without items", () => {
		const words = [];

		let wordlist;
		act( () => {
			wordlist = renderer.create(
				<WordList title="Wordlist" words={ words } />
			);
		} );

		const tree = wordlist.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
} );
