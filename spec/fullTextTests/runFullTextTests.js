// SEO assessments
//import * as introductionKeyword from "../../js/assessments/seo/introductionKeywordAssessment";
const introductionKeyword = require( "../../js/assessments/seo/introductionKeywordAssessment" );
/*
import KeyphraseLengthAssessment from "../../js/assessments/seo/KeyphraseLengthAssessment";
import KeywordDensityAssessment from "../../js/assessments/seo/KeywordDensityAssessment";
import * as keywordStopWords from "../../js/assessments/seo/keywordStopWordsAssessment";
import * as metaDescriptionKeyword from "../../js/assessments/seo/metaDescriptionKeywordAssessment";
import * as MetaDescriptionLength from "../../js/assessments/seo/metaDescriptionLengthAssessment";
import * as SubheadingsKeyword from "../../js/assessments/seo/subheadingsKeywordAssessment";
import * as textCompetingLinks from "../../js/assessments/seo/textCompetingLinksAssessment";
import * as TextImages from "../../js/assessments/seo/textImagesAssessment";
import * as TextLength from "../../js/assessments/seo/textLengthAssessment";
import * as OutboundLinks from "../../js/assessments/seo/outboundLinksAssessment";
import InternalLinksAssessment from "../../js/assessments/seo/InternalLinksAssessment";
import * as titleKeyword from "../../js/assessments/seo/titleKeywordAssessment";
import * as TitleWidth from "../../js/assessments/seo/pageTitleWidthAssessment";
import UrlKeywordAssessment from "../../js/assessments/seo/UrlKeywordAssessment";
import * as UrlLength from "../../js/assessments/seo/urlLengthAssessment";
import * as urlStopWords from "../../js/assessments/seo/urlStopWordsAssessment";
import LargestKeywordDistance from "../../js/assessments/seo/LargestKeywordDistanceAssessment";
 */
// Content assessments
const FleschReadingEase = require( "../../js/assessments/readability/fleschReadingEaseAssessment" );
/*
const paragraphTooLong = require( "../../js/assessments/readability/paragraphTooLongAssessment" );
const SentenceLengthInText = require( "../../sjsrc/assessments/readability/sentenceLengthInTextAssessment" );
const SubheadingDistributionTooLong = require( "../../js/assessments/readability/subheadingDistributionTooLongAssessment" );
const transitionWords = require( "../../js/assessments/readability/transitionWordsAssessment" );
const passiveVoice = require( "../../js/assessments/readability/passiveVoiceAssessment" );
const sentenceBeginnings = require( "../../js/assessments/readability/sentenceBeginningsAssessment" );
const textPresence = require( "../../js/assessments/readability/textPresenceAssessment" );
 */

// Researches
const findKeywordInFirstParagraph = require( "../../js/researches/findKeywordInFirstParagraph.js" );

const contentConfiguration = require( "../../src/config/content/combinedConfig" );
const researcher = require( "../../src/researcher" );
const factory = require( "../helpers/factory.js" );
const i18n = factory.buildJed();

// Collection of test papers
const englishPaper1 = require( "./englishPaper1" );

// Create a list of all test papers
const testPapers = [
	englishPaper1
];

testPapers.forEach( function( testPaper ) {
	describe( "Full-text test for paper " + testPaper.name, function() {
		const locale = testPaper.paper.getLocale();
		let result = {};

		// Create a list of all assessments to be run
		/*const assessments = [
			introductionKeyword,
			new KeyphraseLengthAssessment(),
			new KeywordDensityAssessment(),
			keywordStopWords,
			metaDescriptionKeyword,
			new MetaDescriptionLength(),
			new SubheadingsKeyword(),
			textCompetingLinks,
			new TextImages(),
			new TextLength(),
			new OutboundLinks(),
			new InternalLinksAssessment(),
			titleKeyword,
			new TitleWidth(),
			new UrlKeywordAssessment(),
			new UrlLength(),
			urlStopWords,
			new FleschReadingEase( contentConfiguration( locale ).fleschReading ),
			new SubheadingDistributionTooLong(),
			paragraphTooLong,
			new SentenceLengthInText( contentConfiguration( locale ).sentenceLength ),
			transitionWords,
			passiveVoice,
			textPresence,
			sentenceBeginnings,
		];*/

		it( "returns a score and the associated feedback text for the introductionKeyword assessment", function () {
			result.introductionKeyword = introductionKeyword.getResult( testPaper.paper, factory.buildMockResearcher( "findKeywordInFirstParagraph" ), i18n );
			expect( result.introductionKeyword.getScore() ).toBe( testPaper.expectedResults.introductionKeyword.score );
			expect( result.introductionKeyword.getText() ).toBe( testPaper.expectedResults.introductionKeyword.resultText );
		} );

		it( "returns a score and the associated feedback text for the introductionKeyword assessment", function () {
			result.fleschReadingEase = new FleschReadingEase( contentConfiguration( locale ).fleschReading ).getResult( testPaper.paper, factory.buildMockResearcher( "calculateFleschReading" ), i18n );
			expect( result.fleschReadingEase.getScore() ).toBe( testPaper.expectedResults.fleschReadingEase.score );
			expect( result.fleschReadingEase.getText() ).toBe( testPaper.expectedResults.fleschReadingEase.resultText );
		} )
	} )
} );