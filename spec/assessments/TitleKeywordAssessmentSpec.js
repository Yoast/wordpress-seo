import TitleKeywordAssessment from "../../src/assessments/seo/TitleKeywordAssessment";
import Paper from "../../src/values/Paper";
import Factory from "../specHelpers/factory";

const i18n = Factory.buildJed();

describe( "an assessment to check if the keyword is in the pageTitle", function() {
	it( "returns an assementresult with keyword not found", function() {
		const paper = new Paper( "", {
			keyword: "keyword",
			title: "a non-empty title",
		} );
		const assessment = new TitleKeywordAssessment().getResult(
			paper,
			Factory.buildMockResearcher( { exactMatch: false, allWordsFound: false, position: -1 } ),
			i18n );

		expect( assessment.getScore() ).toBe( 2 );
		expect( assessment.getText() ).toBe(
			"<a href='https://yoa.st/33g' target='_blank'>Keyphrase in title</a>: Not all the words from your " +
			"keyphrase \"keyword\" appear in the SEO title. <a href='https://yoa.st/33h' target='_blank'>Try to " +
			"use the exact match of your keyphrase in the SEO title</a>."
		);
	} );

	it( "returns an assementresult with an exact match of the keyword found at start", function() {
		const paper = new Paper( "", {
			keyword: "keyword",
			title: "keyword and the rest of this non-empty title",
		} );
		const assessment = new TitleKeywordAssessment().getResult(
			paper,
			Factory.buildMockResearcher( { exactMatch: true, allWordsFound: true, position: 0 } ),
			i18n );

		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe(
			"<a href='https://yoa.st/33g' target='_blank'>Keyphrase in title</a>: The exact match of the focus " +
			"keyphrase appears at the beginning of the SEO title. Good job!"
		);
	} );

	it( "returns an assementresult with an exact match of the keyword found not at start", function() {
		const paper = new Paper( "", {
			keyword: "keyword",
			title: "the rest of this non-empty title and the keyword",
		} );
		const assessment = new TitleKeywordAssessment().getResult(
			paper,
			Factory.buildMockResearcher( { exactMatch: true, allWordsFound: true, position: 41 } ),
			i18n );

		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe(
			"<a href='https://yoa.st/33g' target='_blank'>Keyphrase in title</a>: The exact match of the focus " +
			"keyphrase appears in the SEO title, but not at the beginning. " +
			"<a href='https://yoa.st/33h' target='_blank'>Try move it to the beginning</a>."
		);
	} );

	it( "returns an assementresult with keyword not found at all", function() {
		const paper = new Paper( "", {
			keyword: "keyword",
			title: "a non-empty title",
		} );
		const assessment = new TitleKeywordAssessment().getResult(
			paper,
			Factory.buildMockResearcher( { exactMatch: false, allWordsFound: true, position: -1 } ),
			i18n );

		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe(
			"<a href='https://yoa.st/33g' target='_blank'>Keyphrase in title</a>: Does not contain the exact match. " +
			"<a href='https://yoa.st/33h' target='_blank'>Try to write the exact match of your keyphrase in the SEO title</a>."
		);
	} );

	it( "returns false isApplicable for a paper without title", function() {
		const isApplicableResult = new TitleKeywordAssessment().isApplicable( new Paper( "", { keyword: "some keyword", title: "" } ) );
		expect( isApplicableResult ).toBe( false );
	} );

	it( "returns false isApplicable for a paper without keyword", function() {
		const isApplicableResult = new TitleKeywordAssessment().isApplicable( new Paper( "", { keyword: "", title: "some title" } ) );
		expect( isApplicableResult ).toBe( false );
	} );
} );
