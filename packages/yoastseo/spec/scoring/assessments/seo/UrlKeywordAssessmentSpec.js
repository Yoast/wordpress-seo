import { SlugKeywordAssessment, UrlKeywordAssessment } from "../../../../src/scoring/assessments/seo/UrlKeywordAssessment";
import Paper from "../../../../src/values/Paper.js";
import JapaneseResearcher from "../../../../src/languageProcessing/languages/ja/Researcher";
import DefaultResearcher from "../../../../src/languageProcessing/languages/_default/Researcher";
import Factory from "../../../specHelpers/factory.js";

const keywordCountInSlug = new SlugKeywordAssessment();

describe( "A keyword in slug count assessment", function() {
	const mockPaper = new Paper( "sample", {
		slug: "sample-with-keyword",
		keyword: "kéyword",
	} );

	it( "assesses no keyword was found in the slug: short keyphrase", function() {
		const assessment = keywordCountInSlug.getResult(
			mockPaper,
			Factory.buildMockResearcher( { keyphraseLength: 1, percentWordMatches: 0 } )
		);

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33o' target='_blank'>Keyphrase in slug</a>: " +
			"(Part of) your keyphrase does not appear in the slug. <a href='https://yoa.st/33p' target='_blank'>Change that</a>!" );
	} );

	it( "assesses a keyword was found in the slug: short keyphrase", function() {
		const assessment = keywordCountInSlug.getResult(
			mockPaper,
			Factory.buildMockResearcher( { keyphraseLength: 1, percentWordMatches: 100 } )
		);

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33o' target='_blank'>Keyphrase in slug</a>: Great work!" );
	} );

	it( "assesses no keyword was found in the slug: long keyphrase", function() {
		const assessment = keywordCountInSlug.getResult(
			mockPaper,
			Factory.buildMockResearcher( { keyphraseLength: 3, percentWordMatches: 0 } )
		);

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33o' target='_blank'>Keyphrase in slug</a>: " +
			"(Part of) your keyphrase does not appear in the slug. <a href='https://yoa.st/33p' target='_blank'>Change that</a>!" );
	} );

	it( "assesses a keyword was found in the slug: long keyphrase", function() {
		const assessment = keywordCountInSlug.getResult(
			mockPaper,
			Factory.buildMockResearcher( { keyphraseLength: 3, percentWordMatches: 100 } )
		);

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33o' target='_blank'>Keyphrase in slug</a>: " +
			"More than half of your keyphrase appears in the slug. That's great!" );
	} );

	it( "assesses part of the keyphrase was found in the slug: long keyphrase", function() {
		const assessment = keywordCountInSlug.getResult(
			mockPaper,
			Factory.buildMockResearcher( { keyphraseLength: 3, percentWordMatches: 67 } )
		);

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33o' target='_blank'>Keyphrase in slug</a>: " +
			"More than half of your keyphrase appears in the slug. That's great!" );
	} );

	it( "assesses a keyword was found in the slug: in double quotes", function() {
		const assessment = keywordCountInSlug.getResult(
			mockPaper,
			Factory.buildMockResearcher( { keyphraseLength: 1, percentWordMatches: 100 } )
		);

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33o' target='_blank'>Keyphrase in slug</a>: Great work!" );
	} );

	it( "assesses part of the keyphrase was not found in the slug: in double quotes", function() {
		const assessment = keywordCountInSlug.getResult(
			mockPaper,
			Factory.buildMockResearcher( { keyphraseLength: 1, percentWordMatches: 0 } )
		);

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33o' target='_blank'>Keyphrase in slug</a>: " +
			"(Part of) your keyphrase does not appear in the slug. <a href='https://yoa.st/33p' target='_blank'>Change that</a>!" );
	} );
} );

describe( "tests for the assessment applicability.", function() {
	it( "returns false when there is no keyword and slug found.", function() {
		const paper = new Paper( "sample keyword" );
		const researcher = new DefaultResearcher( paper );

		expect( keywordCountInSlug.isApplicable( paper, researcher ) ).toBe( false );
	} );

	it( "returns true when the paper has keyword and slug.", function() {
		const paper = new Paper( "sample keyword", {
			slug: "sample-with-keyword",
			keyword: "kéyword",
		} );
		const researcher = new DefaultResearcher( paper );

		expect( keywordCountInSlug.isApplicable( paper, researcher ) ).toBe( true );
	} );

	it( "returns false when the researcher doesn't have the keywordCountInSlug research.", function() {
		const paper = new Paper( "sample keyword", {
			slug: "sample-with-keyword",
			keyword: "keyword",
		} );

		// The Japanese researcher doesn't have the keywordCountInSlug research.
		const researcher = new JapaneseResearcher( paper );

		expect( keywordCountInSlug.isApplicable( paper, researcher ) ).toBe( false );
	} );

	it( "returns true when the researcher has the keywordCountInSlug research.", function() {
		const paper = new Paper( "sample keyword", {
			slug: "sample-with-keyword",
			keyword: "keyword",
		} );

		// The default researcher has the keywordCountInSlug research.
		const researcher = new DefaultResearcher( paper );

		expect( keywordCountInSlug.isApplicable( paper, researcher ) ).toBe( true );
	} );
} );


describe( "tests proper deprecation of UrlKeywordAssessment.", function() {
	it( "should return true when the paper has a keyword and a slug, but should throw a console warning for deprecation.", function() {
		const paper = new Paper( "sample keyword", {
			slug: "sample-with-keyword",
			keyword: "keyword",
		} );
		const researcher = new DefaultResearcher( paper );

		const consoleSpy = jest.spyOn( console, "warn" ).mockImplementation();
		expect( new UrlKeywordAssessment().isApplicable( paper, researcher ) ).toBe( true );
		expect( consoleSpy ).toHaveBeenCalled();
	} );
} );
