import UrlKeywordAssessment from "../../../../src/scoring/assessments/seo/UrlKeywordAssessment";
import Paper from "../../../../src/values/Paper.js";
import Factory from "../../../specHelpers/factory.js";
const i18n = Factory.buildJed();

const keywordInUrl = new UrlKeywordAssessment();

describe( "A keyword in url count assessment", function() {
	const mockPaper = new Paper( "sample", {
		url: "sample-with-keyword",
		keyword: "kéyword",
	} );

	it( "assesses no keyword was found in the url: short keyphrase", function() {
		const assessment = keywordInUrl.getResult(
			mockPaper,
			Factory.buildMockResearcher( { keyphraseLength: 1, percentWordMatches: 0 } ),
			i18n
		);

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33o' target='_blank'>Keyphrase in slug</a>: " +
			"(Part of) your keyphrase does not appear in the slug. <a href='https://yoa.st/33p' target='_blank'>Change that</a>!" );
	} );

	it( "assesses a keyword was found in the url: short keyphrase", function() {
		const assessment = keywordInUrl.getResult(
			mockPaper,
			Factory.buildMockResearcher( { keyphraseLength: 1, percentWordMatches: 100 } ),
			i18n
		);

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33o' target='_blank'>Keyphrase in slug</a>: Great work!" );
	} );

	it( "assesses no keyword was found in the url: long keyphrase", function() {
		const assessment = keywordInUrl.getResult(
			mockPaper,
			Factory.buildMockResearcher( { keyphraseLength: 3, percentWordMatches: 0 } ),
			i18n
		);

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33o' target='_blank'>Keyphrase in slug</a>: " +
			"(Part of) your keyphrase does not appear in the slug. <a href='https://yoa.st/33p' target='_blank'>Change that</a>!" );
	} );

	it( "assesses a keyword was found in the url: long keyphrase", function() {
		const assessment = keywordInUrl.getResult(
			mockPaper,
			Factory.buildMockResearcher( { keyphraseLength: 3, percentWordMatches: 100 } ),
			i18n
		);

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33o' target='_blank'>Keyphrase in slug</a>: " +
			"More than half of your keyphrase appears in the slug. That's great!" );
	} );

	it( "assesses part of the keyphrase was found in the url: long keyphrase", function() {
		const assessment = keywordInUrl.getResult(
			mockPaper,
			Factory.buildMockResearcher( { keyphraseLength: 3, percentWordMatches: 67 } ),
			i18n
		);

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33o' target='_blank'>Keyphrase in slug</a>: " +
			"More than half of your keyphrase appears in the slug. That's great!" );
	} );

	it( "assesses a keyword was found in the url: in double quotes", function() {
		const assessment = keywordInUrl.getResult(
			mockPaper,
			Factory.buildMockResearcher( { keyphraseLength: 1, percentWordMatches: 100 } ),
			i18n
		);

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33o' target='_blank'>Keyphrase in slug</a>: Great work!" );
	} );

	it( "assesses part of the keyphrase was not found in the url: in double quotes", function() {
		const assessment = keywordInUrl.getResult(
			mockPaper,
			Factory.buildMockResearcher( { keyphraseLength: 1, percentWordMatches: 0 } ),
			i18n
		);

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33o' target='_blank'>Keyphrase in slug</a>: " +
			"(Part of) your keyphrase does not appear in the slug. <a href='https://yoa.st/33p' target='_blank'>Change that</a>!" );
	} );
} );

describe( "tests for the assessment applicability.", function() {
	it( "returns false when there is no keyword and url found.", function() {
		const paper = new Paper( "sample keyword" );
		expect( keywordInUrl.isApplicable( paper ) ).toBe( false );
	} );

	it( "returns true when the paper has keyword and url.", function() {
		const paper = new Paper( "sample keyword", {
			url: "sample-with-keyword",
			keyword: "kéyword",
		} );
		expect( keywordInUrl.isApplicable( paper ) ).toBe( true );
	} );
} );

