import checkTextFormality from "../../../../../src/languageProcessing/languages/en/helpers/checkTextFormality";
import Paper from "../../../../../src/values/Paper";
import Researcher from "../../../../../src/languageProcessing/languages/en/Researcher";
import { informalText1, informalText2 } from "./testPapers/en/informalTexts";
import { formalText1, formalText2 } from "./testPapers/en/formalTexts";
import { semiFormalText1, semiFormalText2 } from "./testPapers/en/semiFormalTexts";

describe( "a test for checking the formality level of a text in English", () => {
	xit( "returns an informal label if the text is recognized as informal", () => {
		const paper = new Paper( informalText1 );
		const researcher = new Researcher( paper );
		expect( checkTextFormality( paper, researcher ) ).toEqual( "informal" );
	} );

	it( "returns an informal label if the text is recognized as informal", () => {
		const paper = new Paper( informalText2 );
		const researcher = new Researcher( paper );
		expect( checkTextFormality( paper, researcher ) ).toEqual( "informal" );
	} );

	it( "returns an informal label for semi-formal/semi-informal text", () => {
		const paper = new Paper( semiFormalText1 );
		const researcher = new Researcher( paper );
		expect( checkTextFormality( paper, researcher ) ).toEqual( "informal" );
	} );

	it( "returns an informal label for semi-formal/semi-informal text", () => {
		const paper = new Paper( semiFormalText2 );
		const researcher = new Researcher( paper );
		expect( checkTextFormality( paper, researcher ) ).toEqual( "informal" );
	} );

	it( "returns a formal label if the text is recognized as formal", () => {
		const paper = new Paper( formalText1 );
		const researcher = new Researcher( paper );
		expect( checkTextFormality( paper, researcher ) ).toEqual( "formal" );
	} );

	it( "returns a formal label if the text is recognized as formal", () => {
		const paper = new Paper( formalText2 );
		const researcher = new Researcher( paper );
		expect( checkTextFormality( paper, researcher ) ).toEqual( "formal" );
	} );
} );

