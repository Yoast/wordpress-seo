import React from "react";
import { render } from "@testing-library/react";

import WordList from "../src/WordList";

describe( "WordList", function() {
	it( "renders wordlist as list items", () => {
		const words = [ "word1", "word2", "word3" ];

		const { container } = render(
			<WordList title="Wordlist" words={ words } />
		);

		expect( container.firstChild ).toMatchSnapshot();
	} );

	it( "renders correctly without items", () => {
		const words = [];

		const { container } = render(
			<WordList title="Wordlist" words={ words } />
		);

		expect( container.firstChild ).toMatchSnapshot();
	} );
} );
