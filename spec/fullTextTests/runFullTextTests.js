// SEO assessments
//import * as introductionKeyword from "../../js/assessments/seo/introductionKeywordAssessment";
const introductionKeyword = require( "../../js/assessments/seo/introductionKeywordAssessment" );
const KeyphraseLengthAssessment = require( "../../js/assessments/seo/KeyphraseLengthAssessment" );
const KeywordDensityAssessment = require( "../../js/assessments/seo/KeywordDensityAssessment" );
const keywordStopWords = require( "../../js/assessments/seo/keywordStopWordsAssessment" );
import * as metaDescriptionKeywordAssessment from "../../js/assessments/seo/metaDescriptionKeywordAssessment";
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

// Content assessments
const FleschReadingAssessment = require( "../../js/assessments/readability/fleschReadingEaseAssessment" );
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
const keyphraseLength = require( "../../js/researches/keyphraseLength" );
const keywordCount = require( "../../js/researches/keywordCount" );
const getKeywordDensity = require( "../../js/researches/getKeywordDensity.js" );
const stopWordsInKeyword = require( "../../js/researches/stopWordsInKeyword" );


const calculateFleschReading = require( "../../js/researches/calculateFleschReading.js" );


const wordCountInText = require( "../../js/researches/wordCountInText.js" );
const getLinkStatistics = require( "../../js/researches/getLinkStatistics.js" );
const linkCount = require( "../../js/researches/countLinks.js" );
const getLinks = require( "../../js/researches/getLinks.js" );
const urlLength = require( "../../js/researches/urlIsTooLong.js" );
const findKeywordInPageTitle = require( "../../js/researches/findKeywordInPageTitle.js" );
const matchKeywordInSubheadings = require( "../../js/researches/matchKeywordInSubheadings.js" );
const stopWordsInUrl = require( "../../js/researches/stopWordsInUrl" );
const metaDescriptionLength = require( "../../js/researches/metaDescriptionLength.js" );
const imageCount = require( "../../js/researches/imageCountInText.js" );
const altTagCount = require( "../../js/researches/imageAltTags.js" );
const metaDescriptionKeyword = require( "../../js/researches/metaDescriptionKeyword.js" );
const keywordCountInUrl = require( "../../js/researches/keywordCountInUrl" );
const pageTitleWidth = require( "../../js/researches/pageTitleWidth.js" );
const wordComplexity = require( "../../js/researches/getWordComplexity.js" );
const getParagraphLength = require( "../../js/researches/getParagraphLength.js" );
const countSentencesFromText = require( "../../js/researches/countSentencesFromText.js" );
const countSentencesFromDescription = require( "../../js/researches/countSentencesFromDescription.js" );
const getSubheadingTextLengths = require( "../../js/researches/getSubheadingTextLengths.js" );
const findTransitionWords = require( "../../js/researches/findTransitionWords.js" );
const passiveVoice = require( "../../js/researches/getPassiveVoice.js" );
const getSentenceBeginnings = require( "../../js/researches/getSentenceBeginnings.js" );
const relevantWords = require( "../../js/researches/relevantWords" );
const readingTime = require( "../../js/researches/readingTime" );
const getTopicDensity = require( "../../js/researches/getTopicDensity" );
const topicCount = require( "../../js/researches/topicCount" );
const largestKeywordDistance = require( "../../js/researches/largestKeywordDistance" );

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
		const paper = testPaper.paper;
		const locale = paper.getLocale();
		const expectedResults = testPaper.expectedResults;
		let result = {};

		// Create a list of all assessments to be run
		/*const assessments = [

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
			result.introductionKeyword = introductionKeyword.getResult(
				paper,
				factory.buildMockResearcher( findKeywordInFirstParagraph( paper) ),
				i18n
			);
			expect( result.introductionKeyword.getScore() ).toBe( expectedResults.introductionKeyword.score );
			expect( result.introductionKeyword.getText() ).toBe( expectedResults.introductionKeyword.resultText );
		} );

		it( "returns a score and the associated feedback text for the keyphraseLength assessment", function () {
			result.keyphraseLength = new KeyphraseLengthAssessment().getResult(
				paper,
				factory.buildMockResearcher( keyphraseLength( paper ) ),
				i18n
			);
			expect( result.keyphraseLength.getScore() ).toBe( expectedResults.keyphraseLength.score );
			expect( result.keyphraseLength.getText() ).toBe( expectedResults.keyphraseLength.resultText );
		} );

		it( "returns a score and the associated feedback text for the keywordDensity assessment", function () {
			result.keywordDensity = new KeywordDensityAssessment().getResult(
				paper,
				factory.buildMockResearcher( {
					keywordCount: { count: keywordCount( paper ) },
					keywordDensity: getKeywordDensity( paper, factory.buildMockResearcher( {
						keywordCount: { count: keywordCount( paper ) },
						} ) )
				} ),
				i18n
			);
			expect( result.keywordDensity.getScore() ).toBe( expectedResults.keywordDensity.score );
			expect( result.keywordDensity.getText() ).toBe( expectedResults.keywordDensity.resultText );
		} );

		it( "returns a score and the associated feedback text for the keywordStopWords assessment", function () {
			result.keywordStopWords = keywordStopWords.getResult(
				paper,
				factory.buildMockResearcher( stopWordsInKeyword( paper ) ),
				i18n
			);
			expect( result.keywordStopWords.getScore() ).toBe( expectedResults.keywordStopWords.score );
			expect( result.keywordStopWords.getText() ).toBe( expectedResults.keywordStopWords.resultText );
		} );




		/*it( "returns a score and the associated feedback text for the fleschReadingEase assessment", function () {
			result.fleschReadingEase = new FleschReadingAssessment( contentConfiguration( locale ).fleschReading ).getResult(
				paper,
				factory.buildMockResearcher( calculateFleschReading( paper ) ),
				i18n
			);
			//new FleschReadingAssessment( contentConfiguration( paper.getLocale() ).fleschReading ).getResult( paper, factory.buildMockResearcher( 100.0 ), i18n );
			expect( result.fleschReadingEase.getScore() ).toBe( expectedResults.fleschReadingEase.score );
			expect( result.fleschReadingEase.getText() ).toBe( expectedResults.fleschReadingEase.resultText );
		} )*/
	} )
} );