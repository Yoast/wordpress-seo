import Paper from "../../../src/values/Paper";
import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher";
import { formalText2 } from "../languages/en/helpers/testPapers/en/formalTexts";
import { informalText2 } from "../languages/en/helpers/testPapers/en/informalTexts";
import getTextFormalityLevel from "../../../src/languageProcessing/researches/getTextFormalityLevel";

describe( "a test for a research to get the formality level of a text", () => {
	it( "returns 'formal' label when the text is recognized as formal in English", () => {
		const paper = new Paper( formalText2 );
		const researcher = new EnglishResearcher( paper );
		expect( getTextFormalityLevel( paper, researcher ) ).toEqual( "formal" );
	} );
	it( "returns 'informal' label when the text is recognized as informal in English", () => {
		const paper = new Paper( informalText2 );
		const researcher = new EnglishResearcher( paper );
		expect( getTextFormalityLevel( paper, researcher ) ).toEqual( "informal" );
	} );
} );

