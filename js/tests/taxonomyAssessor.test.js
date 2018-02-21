let Assessor = require( "../src/assessors/taxonomyAssessor.js" );
let Paper = require("yoastseo/js/values/Paper.js");
let factory = require( "yoastseo/spec/helpers/factory.js" );
let i18n = factory.buildJed();
let assessor = new Assessor( i18n );

describe ( "running assessments in the assessor", function() {
	/*
	 * Triggers the following assessments:
	 *
	 * keyphraseLength
	 * MetaDescriptionLength
	 * TitleWidth
	 * TextLength
	 */
	it( "runs assessments without any specific requirements", function() {
		assessor.assess( new Paper( "" ) );
		expect( assessor.getValidResults().length ).toBe( 4 );
	} );

	/*
	 * Triggers the following assessments:
	 *
	 * keyphraseLength
	 * MetaDescriptionLength
	 * TitleWidth
	 * TextLength
	 */
	it( "additionally runs assessments that only require a text", function() {
		assessor.assess( new Paper( "text" ) );
		expect( assessor.getValidResults().length ).toBe( 4 );
	} );

	/*
	 * Triggers the following assessments:
	 *
	 * introductionKeyword
	 * MetaDescriptionLength
	 * titleKeyword
	 * TitleWidth
	 * TextLength
	 */
	it( "additionally runs assessments that require a keyword", function() {
		assessor.assess( new Paper( "text", { keyword: "keyword" } ) );
		expect( assessor.getValidResults().length ).toBe( 5 );
	} );

	/*
	 * Triggers the following assessments:
	 *
	 * introductionKeyword
	 * MetaDescriptionLength
	 * titleKeyword
	 * TitleWidth
	 * TextLength
	 */
	it( "additionally runs assessments that require text and a keyword", function() {
		assessor.assess( new Paper( "text", { keyword: "keyword" } ) );
		expect( assessor.getValidResults().length ).toBe( 5 );
	} );

	/*
	 * Triggers the following assessments:
	 *
	 * introductionKeyword
	 * keywordStopWords
	 * MetaDescriptionLength
	 * titleKeyword
	 * TitleWidth
	 * TextLength
	 */
	it( "additionally runs assessments that require text and a keyword with a stopword", function() {
		assessor.assess( new Paper( "text", { keyword: "the keyword" } ) );
		expect( assessor.getValidResults().length ).toBe( 6 );
	} );

	/*
	 * Triggers the following assessments:
	 *
	 * keyphraseLength
	 * MetaDescriptionLength
	 * TitleWidth
	 * TextLength
	 */
	it( "additionally runs assessments that require a url", function() {
		assessor.assess( new Paper( "text", { url: "sample url" } ) );
		expect( assessor.getValidResults().length ).toBe( 4 );
	} );

	/*
	 * Triggers the following assessments:
	 *
	 * keyphraseLength
	 * MetaDescriptionLength
	 * TitleWidth
	 * UrlLength
	 * TextLength
	 */
	it( "additionally runs assessments that require a url that is too long", function() {
		assessor.assess( new Paper( "text", { url: "12345678901234567890123456789012345678901" } ) );
		expect( assessor.getValidResults().length ).toBe( 5 );
	} );

	/*
	 * Triggers the following assessments:
	 *
	 * keyphraseLength
	 * MetaDescriptionLength
	 * TitleWidth
	 * urlStopWords
	 * TextLength
	 */
	it( "additionally runs assessments that require a url with a stopword", function() {
		assessor.assess( new Paper( "text", { url: "the sample url" } ) );
		expect( assessor.getValidResults().length ).toBe( 5 );
	} );


	/*
	 * Triggers the following assessments:
	 *
	 * introductionKeyword
	 * MetaDescriptionLength
	 * titleKeyword
	 * TitleWidth
	 * UrlKeyword
	 * TextLength
	 */
	it( "additionally runs assessments that require a url and a keyword", function() {
		assessor.assess( new Paper( "text", { url: "sample url", keyword: "keyword" } ) );
		expect( assessor.getValidResults().length ).toBe( 6 );
	} );

	/*
	 * Triggers the following assessments:
	 *
	 * introductionKeyword
	 * keywordDensity
	 * MetaDescriptionLength
	 * titleKeyword
	 * TitleWidth
	 * TextLength
	 */
	it( "additionally runs assessments that require a text of at least 100 words and a keyword", function() {
		assessor.assess( new Paper( "This is a keyword. Lorem ipsum dolor sit amet, vim illum aeque constituam at. Id latine tritani alterum pro. Ei quod stet affert sed. Usu putent fabellas suavitate id. Quo ut stet recusabo torquatos. Eum ridens possim expetenda te. Ex per putant comprehensam. At vel utinam cotidieque, at erat brute eum, velit percipit ius et. Has vidit accusata deterruisset ea, quod facete te vis. Vix ei duis dolor, id eum sonet fabulas. Id vix imperdiet efficiantur. Percipit probatus pertinax te sit. Putant intellegebat eu sit. Vix reque tation prompta id, ea quo labore viderer definiebas. Oratio vocibus offendit an mei, est esse pericula liberavisse.", { keyword: "keyword" } ) );
		expect( assessor.getValidResults().length ).toBe( 6 );
	} );

	/*
	 * Triggers the following assessments:
	 *
	 * introductionKeyword
	 * metaDescriptionKeyword
	 * MetaDescriptionLength
	 * titleKeyword
	 * TitleWidth
	 * TextLength
	 */
	it( "additionally runs assessments that require a keyword and a meta description", function() {
		assessor.assess( new Paper( "text", { keyword: "keyword", description: "description" } ) );
		expect( assessor.getValidResults().length ).toBe( 6 );
	} );
} );
