import getResults from "../getAssessorResults";
import Paper from "../../../src/values/Paper";

/**
 * Checks which assessment are available for a related keyphrase assessor, given a certain Paper.
 * @param {Assessor} assessor The related keyphrase assessor.
 * @returns {void}
 */
export function checkAssessmentAvailability( assessor ) {
	it( "runs assessments without any specific requirements", function() {
		assessor.assess( new Paper( "" ) );
		const assessments = getResults( assessor.getValidResults() );

		let defaultAssessments = [ "introductionKeyword",
			"keyphraseLength", "metaDescriptionKeyword", "textCompetingLinks", "imageKeyphrase" ];

		// The introduction keyword, single title and text length assessments are not available on store blogs.
		if ( /(collectionRelatedKeywordAssessor|relatedKeywordsTaxonomyAssessor)/ig.test( assessor.type ) ) {
			defaultAssessments = defaultAssessments.slice( 0, 3 );
		}
		expect( assessments ).toEqual( defaultAssessments );
	} );

	it( "additionally runs assessments that only require a keyword that consists of function words only", function() {
		assessor.assess( new Paper( "", { keyword: "a" } ) );
		const assessments = getResults( assessor.getValidResults() );

		let defaultAssessments = [
			"introductionKeyword",
			"keyphraseLength",
			"metaDescriptionKeyword",
			"functionWordsInKeyphrase",
			"textCompetingLinks",
			"imageKeyphrase",
		];
		if ( /(collectionRelatedKeywordAssessor|relatedKeywordsTaxonomyAssessor)/ig.test( assessor.type ) ) {
			defaultAssessments = defaultAssessments.slice( 0, 4 );
		}
		expect( assessments ).toEqual( defaultAssessments );
	} );

	it( "additionally runs assessments that require a text of at least 100 words and a keyword", function() {
		const paper = new Paper( "This is a text about the keyword. Lorem ipsum dolor sit amet, fugit" +
			"munere consulatu an est, ex eruditi gloriatur reformidans vim. At ius falli laboramus, ei" +
			"euripidis dissentiet vix. Pro novum eligendi repudiare no, in vix stet hinc. Mollis qualisque" +
			"iudicabit id mei, legimus aliquando democritum duo cu. Id eripuit omnesque appellantur pro," +
			"vim ne menandri appellantur. Usu omnes timeam tritani et, an falli consectetuer vix. Vel" +
			"ne enim constituam. Et summo mentitum mea. Cu his nusquam civibus officiis, vix tota appellantur" +
			"no, fuisset invenire molestiae pro ne. Ne case essent mei, ut quo ferri malorum albucius. Id nonumes" +
			"inimicus vix. Ei duo prompta electram, iudico.", { keyword: "keyword" } );
		assessor.assess( paper );
		const assessments = getResults( assessor.getValidResults() );

		let defaultAssessments = [
			"introductionKeyword",
			"keyphraseLength",
			"keyphraseDensity",
			"metaDescriptionKeyword",
			"textCompetingLinks",
			"imageKeyphrase",
		];
		if ( /(collectionRelatedKeywordAssessor|relatedKeywordsTaxonomyAssessor)/ig.test( assessor.type ) ) {
			defaultAssessments = defaultAssessments.slice( 0, 4 );
		}
		expect( assessments ).toEqual( defaultAssessments );
	} );
}

/**
 * Checks the URLs for a given relatedKeyphraseAssessor.
 * @param {Assessor} assessor The related keyphrase assessor.
 * @returns {void}
 */
export function checkUrls( assessor ) {
	const isCollection = assessor.type.startsWith( "collection" );
	const isTaxonomy = assessor.type.startsWith( "taxonomy" );

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

	test( "keyphraseDensity", () => {
		const assessment = assessor.getAssessment( "keyphraseDensity" );

		expect( assessment ).toBeDefined();
		expect( assessment._config ).toBeDefined();
		expect( assessment._config.urlTitle ).toBe( "<a href='https://yoa.st/shopify12' target='_blank'>" );
		expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoa.st/shopify13' target='_blank'>" );
	} );

	test( "TextCompetingLinks", () => {
		const assessment = assessor.getAssessment( "textCompetingLinks" );

		if ( isCollection || isTaxonomy ) {
			expect( assessment ).toBeUndefined();
		} else {
			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.urlTitle ).toBe( "<a href='https://yoa.st/shopify18' target='_blank'>" );
			expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoa.st/shopify19' target='_blank'>" );
		}
	} );

	test( "FunctionWordsInKeyphrase", () => {
		const assessment = assessor.getAssessment( "functionWordsInKeyphrase" );

		expect( assessment ).toBeDefined();
		expect( assessment._config ).toBeDefined();
		expect( assessment._config.urlTitle ).toBe( "<a href='https://yoa.st/shopify50' target='_blank'>" );
		expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoa.st/shopify51' target='_blank'>" );
	} );

	test( "ImageKeyphrase", () => {
		const assessment = assessor.getAssessment( "imageKeyphrase" );

		if ( isCollection ) {
			expect( assessment ).toBeUndefined();
		} else {
			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.urlTitle ).toBe( "<a href='https://yoa.st/shopify22' target='_blank'>" );
			expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoa.st/shopify23' target='_blank'>" );
		}
	} );
}
