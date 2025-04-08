import getResults from "../getAssessorResults";
import Paper from "../../../src/values/Paper";
import KeyphraseDistributionAssessment from "../../../src/scoring/assessments/seo/KeyphraseDistributionAssessment";
import keyphraseDistribution from "../../../src/languageProcessing/researches/keyphraseDistribution";

/* eslint-disable complexity */

/**
 * Checks which assessment are available for an SEO assessor, given a certain Paper.
 * @param {Assessor} assessor The SEO assessor.
 * @param {boolean} isProductAssessor Whether this assessor is used for products.
 * @returns {void}
 */
export function checkAssessmentAvailability( assessor, isProductAssessor = false ) {
	/**
	 * Finds all assessments that have valid results for a given Paper.
	 * @param {Paper} paper The paper.
	 * @returns {string[]} The assessments with valid results.
	 */
	function assess( paper ) {
		assessor.assess( paper );
		return getResults( assessor.getValidResults() );
	}

	const isStoreBlog = assessor.type.startsWith( "storeBlog" );
	const isCollection = assessor.type.startsWith( "collection" );
	const isProduct = assessor.type.startsWith( "product" );
	const isTaxonomy = assessor.type.startsWith( "taxonomy" );

	if ( isProductAssessor && ! isStoreBlog ) {
		// Add the Keyphrase distribution assessment to the assessor, which is available in these assessors in Shopify.
		assessor._researcher.addResearch( "keyphraseDistribution", keyphraseDistribution );
		assessor.addAssessment( "keyphraseDistribution", new KeyphraseDistributionAssessment( {
			urlTitle: isProduct ? "https://yoast.com/33" : "https://yoa.st/shopify30",
			urlCallToAction: isProduct ? "https://yoast.com/34" : "https://yoa.st/shopify31",
		} ) );
	}

	const defaultAssessments = [ "keyphraseLength", "metaDescriptionLength", "titleWidth", "textLength" ];
	if ( isStoreBlog ) {
		defaultAssessments.pop();
	}

	let requiresTextAssessments = [ "images", "externalLinks", "internalLinks" ];
	if ( isCollection || isStoreBlog || isTaxonomy ) {
		requiresTextAssessments = [];
	}
	if ( isProduct ) {
		requiresTextAssessments = [ "images" ];
	}

	const requiresKeyphraseAssessments = [ "introductionKeyword" ];
	if ( isStoreBlog ) {
		requiresKeyphraseAssessments.pop();
	}

	const mostAssessments = [ ...defaultAssessments, ...requiresTextAssessments, ...requiresKeyphraseAssessments ];

	it( "runs assessments without any specific requirements", function() {
		const paper = new Paper( "" );
		const assessments = assess( paper );

		expect( assessments.sort() ).toEqual( defaultAssessments.sort() );
	} );

	it( "additionally runs assessments that only require a text", function() {
		const paper = new Paper( "text" );
		const assessments = assess( paper );

		expect( assessments.sort() ).toEqual( [ ...defaultAssessments, ...requiresTextAssessments ].sort() );
	} );

	it( "additionally runs singleH1assessment if the text contains two H1s", function() {
		const paper = new Paper( "<h1>First title</h1><h1>Second title</h1>" );
		const assessments = assess( paper );

		const expected = isStoreBlog ? defaultAssessments : [ ...defaultAssessments, ...requiresTextAssessments ].concat( "singleH1" );
		expect( assessments.sort() ).toEqual( expected.sort() );
	} );

	it( "additionally runs assessments that only require a text and a keyword", function() {
		const paper = new Paper( "text", { keyword: "keyword" } );
		const assessments = assess( paper );

		expect( assessments.sort() ).toEqual( mostAssessments.sort() );
	} );

	it( "additionally runs assessments that only require a keyword that contains function words only", function() {
		const paper = new Paper( "", { keyword: "a" } );
		const assessments = assess( paper );

		expect( assessments.sort() ).toEqual( defaultAssessments.concat( "functionWordsInKeyphrase" ).sort() );
	} );

	it( "additionally runs assessments that require text and a keyword", function() {
		const paper = new Paper( "text", { keyword: "keyword" } );
		const assessments = assess( paper );

		expect( assessments.sort() ).toEqual( mostAssessments.sort() );
	} );

	it( "additionally runs assessments that require a long enough text and a keyword and a synonym", function() {
		const text = "a ".repeat( 200 );
		const paper = new Paper( text, { keyword: "keyword", synonyms: "synonym" } );
		const assessments = assess( paper );

		const expected = isStoreBlog ? mostAssessments : mostAssessments.concat( "keyphraseDensity" );
		expect( assessments.sort() ).toEqual( expected.sort() );
	} );

	it( "additionally runs assessments that require a text and a super-long slug with stop words", function() {
		const paper = new Paper( "text",
			{ slug: "a-sample-slug-a-sample-slug-a-sample-slug-a-sample-slug-a-sample-slug-a-sample-slug-a-sample-slug-a-sample-slug" } );
		const assessments = assess( paper );

		expect( assessments.sort() ).toEqual( [ ...defaultAssessments, ...requiresTextAssessments ].sort() );
	} );

	it( "additionally runs assessments that require a text, a slug and a keyword", function() {
		const paper = new Paper( "text", { keyword: "keyword", slug: "sample-slug" } );
		const assessments = assess( paper );

		expect( assessments.sort() ).toEqual( mostAssessments.concat( "slugKeyword" ).sort() );
	} );

	// These specifications will additionally trigger the largest keyword distance assessment.
	it( "additionally runs assessments that require a long enough text and two keyword occurrences", function() {
		const paper = new Paper( "This is a keyword and a keyword. Lorem ipsum dolor sit amet, vim illum aeque" +
			" constituam at. Id latine tritani alterum pro. Ei quod stet affert sed. Usu putent fabellas suavitate id." +
			" Quo ut stet recusabo torquatos. Eum ridens possim expetenda te. Ex per putant comprehensam. At vel utinam" +
			" cotidieque, at erat brute eum, velit percipit ius et. Has vidit accusata deterruisset ea, quod facete te" +
			" vis. Vix ei duis dolor, id eum sonet fabulas. Id vix imperdiet efficiantur. Percipit probatus pertinax te" +
			" sit. Putant intellegebat eu sit. Vix reque tation prompta id, ea quo labore viderer definiebas." +
			" Oratio vocibus offendit an mei, est esse pericula liberavisse. Lorem ipsum dolor sit amet, vim illum aeque" +
			" constituam at. Id latine tritani alterum pro. Ei quod stet affert sed. Usu putent fabellas suavitate id." +
			" Quo ut stet recusabo torquatos. Eum ridens possim expetenda te. Ex per putant comprehensam. At vel utinam" +
			" cotidieque, at erat brute eum, velit percipit ius et. Has vidit accusata deterruisset ea, quod facete te" +
			" vis. Vix ei duis dolor, id eum sonet fabulas. Id vix imperdiet efficiantur. Percipit probatus pertinax te" +
			" sit. Putant intellegebat eu sit. Vix reque tation prompta id, ea quo labore viderer definiebas." +
			" Oratio vocibus offendit an mei, est esse pericula liberavisse.", { keyword: "keyword" } );
		const assessments = assess( paper );

		const keyphraseAssessments = isProductAssessor ? [ "keyphraseDistribution", "keyphraseDensity" ] : [ "keyphraseDensity" ];
		const expected = isStoreBlog ? mostAssessments : [ ...mostAssessments, ...keyphraseAssessments ];
		expect( assessments.sort() ).toEqual( expected.sort() );
	} );

	it( "additionally runs assessments that require a long enough text and one keyword occurrence and one synonym occurrence", function() {
		const paper = new Paper( "This is a keyword. Lorem ipsum dolor sit amet, vim illum aeque" +
			" constituam at. Id latine tritani alterum pro. Ei quod stet affert sed. Usu putent fabellas suavitate id." +
			" Quo ut stet recusabo torquatos. Eum ridens possim expetenda te. Ex per putant comprehensam. At vel utinam" +
			" cotidieque, at erat brute eum, velit percipit ius et. Has vidit accusata deterruisset ea, quod facete te" +
			" vis. Vix ei duis dolor, id eum sonet fabulas. Id vix imperdiet efficiantur. Percipit probatus pertinax te" +
			" sit. Putant intellegebat eu sit. Vix reque tation prompta id, ea quo labore viderer definiebas." +
			" Oratio vocibus offendit an mei, est esse pericula liberavisse. Lorem ipsum dolor sit amet, vim illum aeque" +
			" constituam at. Id latine tritani alterum pro. Ei quod stet affert sed. Usu putent fabellas suavitate id." +
			" Quo ut stet recusabo torquatos. Eum ridens possim expetenda te. Ex per putant comprehensam. At vel utinam" +
			" cotidieque, at erat brute eum, velit percipit ius et. Has vidit accusata deterruisset ea, quod facete te" +
			" vis. Vix ei duis dolor, id eum sonet fabulas. Id vix imperdiet efficiantur. Percipit probatus pertinax te" +
			" sit. Putant intellegebat eu sit. Vix reque tation prompta id, ea quo labore viderer definiebas synonym." +
			" Oratio vocibus offendit an mei, est esse pericula liberavisse.", { keyword: "keyword", synonyms: "synonym" } );
		const assessments = assess( paper );

		const keyphraseAssessments = isProductAssessor ? [ "keyphraseDistribution", "keyphraseDensity" ] : [ "keyphraseDensity" ];
		const expected = isStoreBlog ? mostAssessments : [ ...mostAssessments, ...keyphraseAssessments ];
		expect( assessments.sort() ).toEqual( expected.sort() );
	} );
}
/* eslint-enable complexity */

/**
 * Checks the config overrides for a given SEO assessor.
 * @param {Assessor} assessor The SEO assessor.
 * @returns {void}
 */
export function checkConfigOverrides( assessor ) {
	test( "MetaDescriptionLengthAssessment", () => {
		const assessment = assessor.getAssessment( "metaDescriptionLength" );

		expect( assessment ).toBeDefined();
		expect( assessment._config ).toBeDefined();
		expect( assessment._config.scores ).toBeDefined();
		expect( assessment._config.scores.tooLong ).toBe( 3 );
		expect( assessment._config.scores.tooShort ).toBe( 3 );
	} );

	test( "ImageKeyphrase", () => {
		const assessment = assessor.getAssessment( "imageKeyphrase" );

		expect( assessment ).toBeDefined();
		expect( assessment._config ).toBeDefined();
		expect( assessment._config.scores ).toBeDefined();
		expect( assessment._config.scores.withAltNonKeyword ).toBe( 3 );
		expect( assessment._config.scores.withAlt ).toBe( 3 );
		expect( assessment._config.scores.noAlt ).toBe( 3 );
	} );

	test( "TextLengthAssessment", () => {
		const assessment = assessor.getAssessment( "textLength" );

		expect( assessment ).toBeDefined();
		expect( assessment._config ).toBeDefined();
		expect( assessment._config.recommendedMinimum ).toBe( 900 );
		expect( assessment._config.slightlyBelowMinimum ).toBe( 400 );
		expect( assessment._config.belowMinimum ).toBe( 300 );
		expect( assessment._config.scores ).toBeDefined();
		expect( assessment._config.scores.belowMinimum ).toBe( -20 );
		expect( assessment._config.scores.farBelowMinimum ).toBe( -20 );
		expect( assessment._config.cornerstoneContent ).toBeDefined();
		expect( assessment._config.cornerstoneContent ).toBeTruthy();
	} );

	test( "OutboundLinksAssessment", () => {
		const assessment = assessor.getAssessment( "externalLinks" );

		expect( assessment ).toBeDefined();
		expect( assessment._config ).toBeDefined();
		expect( assessment._config.scores ).toBeDefined();
		expect( assessment._config.scores.noLinks ).toBe( 3 );
	} );

	test( "PageTitleWidthAssessment", () => {
		const assessment = assessor.getAssessment( "titleWidth" );

		expect( assessment ).toBeDefined();
		expect( assessment._config ).toBeDefined();
		expect( assessment._config.scores ).toBeDefined();
		expect( assessment._config.scores.widthTooShort ).toBe( 9 );
	} );

	test( "SlugKeywordAssessment", () => {
		const assessment = assessor.getAssessment( "slugKeyword" );

		expect( assessment ).toBeDefined();
		expect( assessment._config ).toBeDefined();
		expect( assessment._config.scores ).toBeDefined();
		expect( assessment._config.scores.okay ).toBe( 3 );
	} );
}

/**
 * Checks the URLs for a given SEO assessor.
 * @param {Assessor} assessor The SEO assessor.
 * @param {boolean} isProductAssessor Whether this assessor is used for products.
 * @returns {void}
 */
export function checkUrls( assessor, isProductAssessor = false ) {
	/**
	 * Checks the URLs for a given assessment.
	 * @param {Assessment} assessment The assessment.
	 * @param {string} urlTitle The URL of the assessment title.
	 * @param {string} urlCallToAction The URL of the call-to-action.
	 * @returns {void}
	 */
	function checkAssessmentUrls( assessment, urlTitle, urlCallToAction ) {
		if ( assessment ) {
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.urlTitle ).toBe( `<a href='${urlTitle}' target='_blank'>` );
			expect( assessment._config.urlCallToAction ).toBe( `<a href='${urlCallToAction}' target='_blank'>` );
		}
	}

	const isTaxonomy = assessor.type.startsWith( "taxonomy" );

	test( "IntroductionKeywordAssessment", () => {
		const assessment = assessor.getAssessment( "introductionKeyword" );
		const urlTitle = isProductAssessor ? "https://yoa.st/shopify8" : "https://yoa.st/33e";
		const urlCallToAction = isProductAssessor ? "https://yoa.st/shopify9" : "https://yoa.st/33f";

		checkAssessmentUrls( assessment, urlTitle, urlCallToAction );
	} );

	test( "KeyphraseLengthAssessment", () => {
		const assessment = assessor.getAssessment( "keyphraseLength" );
		const urlTitle = isProductAssessor ? "https://yoa.st/shopify10" : "https://yoa.st/33i";
		const urlCallToAction = isProductAssessor ? "https://yoa.st/shopify11" : "https://yoa.st/33j";

		checkAssessmentUrls( assessment, urlTitle, urlCallToAction );
	} );

	test( "keyphraseDensityAssessment", () => {
		const assessment = assessor.getAssessment( "keyphraseDensity" );
		const urlTitle = isProductAssessor ? "https://yoa.st/shopify12" : "https://yoa.st/33v";
		const urlCallToAction = isProductAssessor ? "https://yoa.st/shopify13" : "https://yoa.st/33w";

		checkAssessmentUrls( assessment, urlTitle, urlCallToAction );
	} );

	test( "MetaDescriptionKeywordAssessment", () => {
		const assessment = assessor.getAssessment( "metaDescriptionKeyword" );
		const urlTitle = isProductAssessor ? "https://yoa.st/shopify14" : "https://yoa.st/33k";
		const urlCallToAction = isProductAssessor ? "https://yoa.st/shopify15" : "https://yoa.st/33l";

		checkAssessmentUrls( assessment, urlTitle, urlCallToAction );
	} );

	test( "MetaDescriptionLengthAssessment", () => {
		const assessment = assessor.getAssessment( "metaDescriptionLength" );
		const urlTitle = isProductAssessor ? "https://yoa.st/shopify46" : "https://yoa.st/34d";
		const urlCallToAction = isProductAssessor ? "https://yoa.st/shopify47" : "https://yoa.st/34e";

		checkAssessmentUrls( assessment, urlTitle, urlCallToAction );
	} );

	test( "SubheadingsKeyword", () => {
		const assessment = assessor.getAssessment( "subheadingsKeyword" );
		const urlTitle = isProductAssessor ? "https://yoa.st/shopify16" : "https://yoa.st/33m";
		const urlCallToAction = isProductAssessor ? "https://yoa.st/shopify17" : "https://yoa.st/33n";

		checkAssessmentUrls( assessment, urlTitle, urlCallToAction );
	} );

	test( "TextCompetingLinksAssessment", () => {
		const assessment = assessor.getAssessment( "textCompetingLinks" );
		const urlTitle = isProductAssessor ? "https://yoa.st/shopify18" : "https://yoa.st/34l";
		const urlCallToAction = isProductAssessor ? "https://yoa.st/shopify19" : "https://yoa.st/34m";

		checkAssessmentUrls( assessment, urlTitle, urlCallToAction );
	} );

	test( "TextLengthAssessment", () => {
		const assessment = assessor.getAssessment( "textLength" );
		let urlTitle;
		if ( isProductAssessor ) {
			urlTitle = "https://yoa.st/shopify58";
		} else {
			urlTitle = isTaxonomy ? "https://yoa.st/34j" : "https://yoa.st/34n";
		}
		let urlCallToAction;
		if ( isProductAssessor ) {
			urlCallToAction = "https://yoa.st/shopify59";
		} else {
			urlCallToAction = isTaxonomy ? "https://yoa.st/34k" : "https://yoa.st/34o";
		}

		checkAssessmentUrls( assessment, urlTitle, urlCallToAction );
	} );

	test( "KeyphraseInSEOTitleAssessment", () => {
		const assessment = assessor.getAssessment( "keyphraseInSEOTitle" );
		const urlTitle = isProductAssessor ? "https://yoa.st/shopify24" : "https://yoa.st/33g";
		const urlCallToAction = isProductAssessor ? "https://yoa.st/shopify25" : "https://yoa.st/33h";

		checkAssessmentUrls( assessment, urlTitle, urlCallToAction );
	} );

	test( "PageTitleWidthAssessment", () => {
		const assessment = assessor.getAssessment( "titleWidth" );
		const urlTitle = isProductAssessor ? "https://yoa.st/shopify52" : "https://yoa.st/34h";
		const urlCallToAction = isProductAssessor ? "https://yoa.st/shopify53" : "https://yoa.st/34i";

		checkAssessmentUrls( assessment, urlTitle, urlCallToAction );
	} );

	test( "SlugKeywordAssessment", () => {
		const assessment = assessor.getAssessment( "slugKeyword" );
		const urlTitle = isProductAssessor ? "https://yoa.st/shopify26" : "https://yoa.st/33o";
		const urlCallToAction = isProductAssessor ? "https://yoa.st/shopify27" : "https://yoa.st/33p";

		checkAssessmentUrls( assessment, urlTitle, urlCallToAction );
	} );

	test( "FunctionWordsInKeyphrase", () => {
		const assessment = assessor.getAssessment( "functionWordsInKeyphrase" );
		const urlTitle = isProductAssessor ? "https://yoa.st/shopify50" : "https://yoa.st/functionwordskeyphrase-1";
		const urlCallToAction = isProductAssessor ? "https://yoa.st/shopify51" : "https://yoa.st/functionwordskeyphrase-2";

		checkAssessmentUrls( assessment, urlTitle, urlCallToAction );
	} );

	test( "SingleH1Assessment", () => {
		const assessment = assessor.getAssessment( "singleH1" );
		const urlTitle = isProductAssessor ? "https://yoa.st/shopify54" : "https://yoa.st/3a6";
		const urlCallToAction = isProductAssessor ? "https://yoa.st/shopify55" : "https://yoa.st/3a7";

		checkAssessmentUrls( assessment, urlTitle, urlCallToAction );
	} );

	test( "ImageCount", () => {
		const assessment = assessor.getAssessment( "images" );
		const urlTitle = isProductAssessor ? "https://yoa.st/shopify20" : "https://yoa.st/4f4";
		const urlCallToAction = isProductAssessor ? "https://yoa.st/shopify21" : "https://yoa.st/4f5";

		checkAssessmentUrls( assessment, urlTitle, urlCallToAction );
	} );

	test( "ImageKeyphrase", () => {
		const assessment = assessor.getAssessment( "imageKeyphrase" );
		const urlTitle = isProductAssessor ? "https://yoa.st/shopify22" : "https://yoa.st/4f7";
		const urlCallToAction = isProductAssessor ? "https://yoa.st/shopify23" : "https://yoa.st/4f6";

		checkAssessmentUrls( assessment, urlTitle, urlCallToAction );
	} );

	test( "KeyphraseDistribution", () => {
		const assessment = assessor.getAssessment( "keyphraseDistribution" );
		const urlTitle = isProductAssessor ? "https://yoa.st/shopify30" : "https://yoa.st/33q";
		const urlCallToAction = isProductAssessor ? "https://yoa.st/shopify31" : "https://yoa.st/33u";
		// Only test this for product assessors, as the product specific/premium assessments have different URLs: they are not transformed into anchor opening tags.
		if ( assessment ) {
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.urlTitle ).toBe( urlTitle );
			expect( assessment._config.urlCallToAction ).toBe( urlCallToAction );
		}
	} );

	test( "OutboundLinks", () => {
		const assessment = assessor.getAssessment( "externalLinks" );
		const urlTitle = isProductAssessor ? "https://yoa.st/shopify62" : "https://yoa.st/34f";
		const urlCallToAction = isProductAssessor ? "https://yoa.st/shopify63" : "https://yoa.st/34g";

		checkAssessmentUrls( assessment, urlTitle, urlCallToAction );
	} );

	test( "InternalLinksAssessment", () => {
		const assessment = assessor.getAssessment( "internalLinks" );
		const urlTitle = isProductAssessor ? "https://yoa.st/shopify60" : "https://yoa.st/33z";
		const urlCallToAction = isProductAssessor ? "https://yoa.st/shopify61" : "https://yoa.st/34a";

		checkAssessmentUrls( assessment, urlTitle, urlCallToAction );
	} );
}
