import React from "react";
import { render } from "@testing-library/react";

import WordOccurrences from "../src/WordOccurrences";

/**
 * Dummy version of "yoastseo.languageProcessing.values.ProminentWord".
 *
 * @param {string} word             The word.
 * @param {string} [stem]           The stem / base form of the word, defaults to the word.
 * @param {number} [occurrences]    The number of occurrences, defaults to 0.
 * @constructor
 */
function ProminentWord( word, stem, occurrences ) {
	return {
		getWord: () => word,
		getOccurrences: () => occurrences,
	};
}

const showBeforeList = <p>{ "I'm a before list paragraph" }</p>;
const showAfterList = <p>{ "I'm an after list paragraph" }</p>;
const introductionText = <p>{ "I'm an introduction text" }</p>;
const words = [
	new ProminentWord( "reviewing", "review",  13 ),
	new ProminentWord( "code", "code",  8 ),
	new ProminentWord( "fun", "fun",  6 ),
];
const noWords = [];

describe( "WordOccurrences", function() {
	it( "renders WordOccurrences as list items", () => {
		const { container } = render(
			<WordOccurrences words={ words } header={ showBeforeList } introduction={ introductionText } footer={ showAfterList } />
		);

		expect( container.firstChild ).toMatchSnapshot();
	} );

	it( "renders correctly without items", () => {
		const { container } = render(
			<WordOccurrences words={ noWords } header={ showBeforeList } introduction={ introductionText } footer={ showAfterList } />
		);

		expect( container.firstChild ).toMatchSnapshot();
	} );

	it( "renders correctly without before and after elements", () => {
		const { container } = render(
			<WordOccurrences words={ words } />
		);

		expect( container.firstChild ).toMatchSnapshot();
	} );

	it( "renders correctly without words and without before and after elements", () => {
		const { container } = render(
			<WordOccurrences words={ noWords } />
		);

		expect( container.firstChild ).toMatchSnapshot();
	} );
} );
