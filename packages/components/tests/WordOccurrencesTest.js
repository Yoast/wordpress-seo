import React from "react";
import renderer from "react-test-renderer";

import WordOccurrences from "../src/WordOccurrences";

const showBeforeList = <p>{ "I'm a before list paragraph" }</p>;
const showAfterList = <p>{ "I'm an after list paragraph" }</p>;
const words = [
	{ _word: "reviewing", _stem: "review", _occurrences: 13 },
	{ _word: "code", _stem: "code", _occurrences: 8 },
	{ _word: "fun", _stem: "fun", _occurrences: 6 },
];
const noWords = [];

describe( "WordOccurrences", function() {
	it( "renders WordOccurrences as list items", () => {
		const wordOccurrences = renderer.create(
			<WordOccurrences words={ words } showBeforeList={ showBeforeList } showAfterList={ showAfterList } />
		);

		const tree = wordOccurrences.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "renders correctly without items", () => {
		const wordOccurrences = renderer.create(
			<WordOccurrences words={ noWords } showBeforeList={ showBeforeList } showAfterList={ showAfterList } />
		);

		const tree = wordOccurrences.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "renders correctly without before and after elements", () => {
		const wordOccurrences = renderer.create(
			<WordOccurrences words={ words } />
		);

		const tree = wordOccurrences.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "renders correctly without words and without before and after elements", () => {
		const wordOccurrences = renderer.create(
			<WordOccurrences words={ noWords } />
		);

		const tree = wordOccurrences.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
} );
