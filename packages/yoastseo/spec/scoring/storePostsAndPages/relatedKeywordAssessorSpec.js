import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher";
import Assessor from "../../../src/scoring/storePostsAndPages/relatedKeywordAssessor";
import Paper from "../../../src/values/Paper";
import getResults from "../../specHelpers/getListOfAssessmentResults";

const assessor = new Assessor( new EnglishResearcher() );

describe( "running assessments in the assessor", function() {
	it( "runs assessments without any specific requirements", function() {
		assessor.assess( new Paper( "" ) );
		const assessments = getResults( assessor.getValidResults() );

		expect( assessments ).toEqual( [
			"keyphraseLength",
		] );
	} );

	it( "runs assessments that only require a keyword", function() {
		assessor.assess( new Paper( "", { keyword: "keyword" } ) );
		const assessments = getResults( assessor.getValidResults() );

		expect( assessments ).toEqual( [
			"keyphraseLength",
		] );
	} );

	it( "runs assessments that only require a keyword that contains function words only", function() {
		assessor.assess( new Paper( "", { keyword: "a" } ) );
		const assessments = getResults( assessor.getValidResults() );

		expect( assessments ).toEqual( [
			"keyphraseLength",
			"functionWordsInKeyphrase",
		] );
	} );

	it( "additionally runs assessments that require a text and a keyword", function() {
		assessor.assess( new Paper( "text", { keyword: "keyword" } ) );
		const assessments = getResults( assessor.getValidResults() );

		expect( assessments ).toEqual( [
			"introductionKeyword",
			"keyphraseLength",
		] );
	} );

	it( "additionally runs assessments that require a text, a keyword, and a meta description", function() {
		assessor.assess( new Paper( "text", { keyword: "keyword", description: "description" } ) );
		const assessments = getResults( assessor.getValidResults() );

		expect( assessments ).toEqual( [
			"introductionKeyword",
			"keyphraseLength",
			"metaDescriptionKeyword",
		] );
	} );

	it( "additionally runs assessments that require a text of at least 100 words and a keyword", function() {
		assessor.assess( new Paper( "This is a text about the keyword. Lorem ipsum dolor sit amet, fugit" +
			"munere consulatu an est, ex eruditi gloriatur reformidans vim. At ius falli laboramus, ei" +
			"euripidis dissentiet vix. Pro novum eligendi repudiare no, in vix stet hinc. Mollis qualisque" +
			"iudicabit id mei, legimus aliquando democritum duo cu. Id eripuit omnesque appellantur pro," +
			"vim ne menandri appellantur. Usu omnes timeam tritani et, an falli consectetuer vix. Vel" +
			"ne enim constituam. Et summo mentitum mea. Cu his nusquam civibus officiis, vix tota appellantur" +
			"no, fuisset invenire molestiae pro ne. Ne case essent mei, ut quo ferri malorum albucius. Id nonumes" +
			"inimicus vix. Ei duo prompta electram, iudico.", { keyword: "keyword" } ) );
		const assessments = getResults( assessor.getValidResults() );

		expect( assessments ).toEqual( [
			"introductionKeyword",
			"keyphraseLength",
			"keywordDensity",
		] );
	} );
} );

describe( "has configuration overrides", () => {
	test( "IntroductionKeyword", () => {
		const assessment = assessor.getAssessment( "introductionKeyword" );

		expect( assessment ).toBeDefined();
		expect( assessment._config ).toBeDefined();
		expect( assessment._config.urlTitle ).toBe( "<a href='https://yoa.st/shopify8' target='_blank'>" );
		expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoa.st/shopify9' target='_blank'>" );
	} );

	test( "KeyphraseLength", () => {
		const assessment = assessor.getAssessment( "keyphraseLength" );

		expect( assessment ).toBeDefined();
		expect( assessment._config ).toBeDefined();
		expect( assessment._config.urlTitle ).toBe( "<a href='https://yoa.st/shopify10' target='_blank'>" );
		expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoa.st/shopify11' target='_blank'>" );
	} );

	test( "MetaDescriptionKeyword", () => {
		const assessment = assessor.getAssessment( "metaDescriptionKeyword" );

		expect( assessment ).toBeDefined();
		expect( assessment._config ).toBeDefined();
		expect( assessment._config.urlTitle ).toBe( "<a href='https://yoa.st/shopify14' target='_blank'>" );
		expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoa.st/shopify15' target='_blank'>" );
	} );

	test( "KeywordDensity", () => {
		const assessment = assessor.getAssessment( "keywordDensity" );

		expect( assessment ).toBeDefined();
		expect( assessment._config ).toBeDefined();
		expect( assessment._config.urlTitle ).toBe( "<a href='https://yoa.st/shopify12' target='_blank'>" );
		expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoa.st/shopify13' target='_blank'>" );
	} );

	test( "TextCompetingLinks", () => {
		const assessment = assessor.getAssessment( "textCompetingLinks" );

		expect( assessment ).toBeDefined();
		expect( assessment._config ).toBeDefined();
		expect( assessment._config.urlTitle ).toBe( "<a href='https://yoa.st/shopify18' target='_blank'>" );
		expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoa.st/shopify19' target='_blank'>" );
	} );

	test( "ImageKeyphrase", () => {
		const assessment = assessor.getAssessment( "imageKeyphrase" );

		expect( assessment ).toBeDefined();
		expect( assessment._config ).toBeDefined();
		expect( assessment._config.urlTitle ).toBe( "<a href='https://yoa.st/shopify22' target='_blank'>" );
		expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoa.st/shopify23' target='_blank'>" );
	} );

	test( "FunctionWordsInKeyphrase", () => {
		const assessment = assessor.getAssessment( "functionWordsInKeyphrase" );

		expect( assessment ).toBeDefined();
		expect( assessment._config ).toBeDefined();
		expect( assessment._config.urlTitle ).toBe( "<a href='https://yoa.st/shopify50' target='_blank'>" );
		expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoa.st/shopify51' target='_blank'>" );
	} );
} );

