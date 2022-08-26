import checkTextFormality from "../../../../../src/languageProcessing/languages/en/helpers/checkTextFormality";
import Paper from "../../../../../src/values/Paper";
import Researcher from "../../../../../src/languageProcessing/languages/en/Researcher";
import { informalText1, informalText2, informalText3 } from "./testPapers/en/informalTexts";
import { semiFormalText1, semiFormalText2 } from "./testPapers/en/semiFormalTexts";
import { formalText1, formalText2 } from "./testPapers/en/formalTexts";

describe( "a test for checking the formality level of a text in English", () => {
	/**
	 * Checks whether the given text matches the given formality.
	 * @param {string} text The text.
	 * @param {string} formality The formality level ("formal" or "informal").
	 * @returns {void}
	 */
	function checkFormality( text, formality ) {
		const paper = new Paper( text );
		const researcher = new Researcher( paper );
		expect( checkTextFormality( paper, researcher ) ).toEqual( formality );
	}

	it( "returns an informal label if the text is recognized as informal", () => {
		checkFormality( informalText1, "informal" );
		checkFormality( informalText2, "informal" );
		checkFormality( informalText3, "informal" );
	} );

	it( "returns an informal label for semi-formal/semi-informal text", () => {
		checkFormality( semiFormalText1, "informal" );
		checkFormality( semiFormalText2, "informal" );
	} );

	it( "returns a formal label if the text is recognized as formal", () => {
		checkFormality( formalText1, "formal" );
		checkFormality( formalText2, "formal" );
	} );
} );

