import UrlKeywordAssessment from "../../src/assessments/seo/UrlKeywordAssessment";
import Paper from "../../src/values/Paper.js";
import Factory from "../specHelpers/factory.js";
const i18n = Factory.buildJed();

const keywordInUrl = new UrlKeywordAssessment();

describe( "A keyword in url count assessment", function() {
	it( "assesses no keyword was found in the url", function() {
		const mockPaper = new Paper( "sample", {
			url: "sample-with-keyword",
			keyword: "kéyword",
		} );

		const assessment = keywordInUrl.getResult( mockPaper, Factory.buildMockResearcher( "okay" ), i18n );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "Not enough words from your keyphrase appear in the <a href='https://yoa.st/2pp' target='_blank'>URL</a> for this page. If you decide to rename the URL be sure to check the old URL 301 redirects to the new one!"

	it( "assesses a keyword was found in the url", function() {
		const mockPaper = new Paper( "sample", {
			url: "sample-with-keyword",
			keyword: "keyword",
		} );
		const assessment = keywordInUrl.getResult( mockPaper, Factory.buildMockResearcher( "good" ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "All or most of the words from your keyphrase appear in the <a href='https://yoa.st/2pp' target='_blank'>URL</a> for this page." );
	} );
} );
