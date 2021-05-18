import React from "react";
import renderer from "react-test-renderer";

import WordOccurrences from "../src/WordOccurrences";
import ProminentWord from "yoastseo/src/values/ProminentWord";

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
		const wordOccurrences = renderer.create(
			<WordOccurrences words={ words } header={ showBeforeList } introduction={ introductionText } footer={ showAfterList } />
		);

		const tree = wordOccurrences.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "renders correctly without items", () => {
		const wordOccurrences = renderer.create(
			<WordOccurrences words={ noWords } header={ showBeforeList } introduction={ introductionText } footer={ showAfterList } />
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
