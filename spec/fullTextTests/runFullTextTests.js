// SEO assessments
const introductionKeyword = require( "../../js/assessments/seo/introductionKeywordAssessment" );
import KeyphraseLengthAssessment from "../../js/assessments/seo/KeyphraseLengthAssessment";
import KeywordDensityAssessment from  "../../js/assessments/seo/KeywordDensityAssessment";
const keywordStopWords = require( "../../js/assessments/seo/keywordStopWordsAssessment" );
const metaDescriptionKeywordAssessment = require( "../../js/assessments/seo/metaDescriptionKeywordAssessment" );
const MetaDescriptionLengthAssessment = require( "../../js/assessments/seo/metaDescriptionLengthAssessment" );
const SubheadingsKeywordAssessment = require( "../../js/assessments/seo/subheadingsKeywordAssessment" );
const textCompetingLinksAssessment = require( "../../js/assessments/seo/textCompetingLinksAssessment" );
const TextImagesAssessment = require( "../../js/assessments/seo/textImagesAssessment" );
const TextLengthAssessment = require( "../../js/assessments/seo/textLengthAssessment" );
const OutboundLinksAssessment = require( "../../js/assessments/seo/outboundLinksAssessment" );
import InternalLinksAssessment from "../../js/assessments/seo/InternalLinksAssessment";
const titleKeywordAssessment = require( "../../js/assessments/seo/titleKeywordAssessment" );
const TitleWidthAssessment = require( "../../js/assessments/seo/pageTitleWidthAssessment" );
import UrlKeywordAssessment from "../../js/assessments/seo/UrlKeywordAssessment";
const UrlLengthAssessment = require( "../../js/assessments/seo/urlLengthAssessment" );
const urlStopWordsAssessment = require( "../../js/assessments/seo/urlStopWordsAssessment" );
import LargestKeywordDistanceAssessment from "../../js/assessments/seo/LargestKeywordDistanceAssessment";

// Content assessments
const FleschReadingAssessment = require( "../../js/assessments/readability/fleschReadingEaseAssessment" );
/*
const paragraphTooLong = require( "../../js/assessments/readability/paragraphTooLongAssessment" );
const SentenceLengthInText = require( "../../js/assessments/readability/sentenceLengthInTextAssessment" );
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
const metaDescriptionKeyword = require( "../../js/researches/metaDescriptionKeyword.js" );
const metaDescriptionLength = require( "../../js/researches/metaDescriptionLength.js" );
const matchKeywordInSubheadings = require( "../../js/researches/matchKeywordInSubheadings.js" );
const getLinkStatistics = require( "../../js/researches/getLinkStatistics.js" );
const imageCount = require( "../../js/researches/imageCountInText.js" );
const altTagCount = require( "../../js/researches/imageAltTags.js" );
const wordCountInText = require( "../../js/researches/wordCountInText.js" );
const findKeywordInPageTitle = require( "../../js/researches/findKeywordInPageTitle.js" );
const pageTitleWidth = require( "../../js/researches/pageTitleWidth.js" );
const keywordCountInUrl = require( "../../js/researches/keywordCountInUrl" );
const urlLength = require( "../../js/researches/urlIsTooLong.js" );
const stopWordsInUrl = require( "../../js/researches/stopWordsInUrl" );
const largestKeywordDistance = require( "../../js/researches/largestKeywordDistance" );

const calculateFleschReading = require( "../../js/researches/calculateFleschReading.js" );


const linkCount = require( "../../js/researches/countLinks.js" );
const getLinks = require( "../../js/researches/getLinks.js" );
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

const contentConfiguration = require( "../../src/config/content/combinedConfig" );
const researcher = require( "../../src/researcher" );
const factory = require( "../helpers/factory.js" );
const i18n = factory.buildJed();

// Collection of test papers
const englishPaper1 = require( "./englishPaper1" );

// Create a list of all test papers
const testPapers = [
	englishPaper1,
];

testPapers.forEach( function( testPaper ) {
	describe( "Full-text test for paper " + testPaper.name, function() {
		const paper = testPaper.paper;
		const locale = paper.getLocale();
		const expectedResults = testPaper.expectedResults;
		let result = {};

		/* Create a list of all assessments to be run
		 const assessments = [
			new FleschReadingEase( contentConfiguration( locale ).fleschReading ),
			new SubheadingDistributionTooLong(),
			paragraphTooLong,
			new SentenceLengthInText( contentConfiguration( locale ).sentenceLength ),
			transitionWords,
			passiveVoice,
			textPresence,
			sentenceBeginnings,
		];*/

		it( "returns a score and the associated feedback text for the introductionKeyword assessment", function() {
			result.introductionKeyword = introductionKeyword.getResult(
				paper,
				factory.buildMockResearcher( findKeywordInFirstParagraph( paper ) ),
				i18n
			);
			expect( result.introductionKeyword.getScore() ).toBe( expectedResults.introductionKeyword.score );
			expect( result.introductionKeyword.getText() ).toBe( expectedResults.introductionKeyword.resultText );
		} );

		it( "returns a score and the associated feedback text for the keyphraseLength assessment", function() {
			result.keyphraseLength = new KeyphraseLengthAssessment().getResult(
				paper,
				factory.buildMockResearcher( keyphraseLength( paper ) ),
				i18n
			);
			expect( result.keyphraseLength.getScore() ).toBe( expectedResults.keyphraseLength.score );
			expect( result.keyphraseLength.getText() ).toBe( expectedResults.keyphraseLength.resultText );
		} );

		it( "returns a score and the associated feedback text for the keywordDensity assessment", function() {
			result.keywordDensity = new KeywordDensityAssessment().getResult(
				paper,
				factory.buildMockResearcher(
					{
						getKeywordDensity: getKeywordDensity(
							paper,
							factory.buildMockResearcher( keywordCount( paper ) )
						),
						keywordCount: keywordCount( paper ),
					},
					true
				),
				i18n
			);
			expect( result.keywordDensity.getScore() ).toBe( expectedResults.keywordDensity.score );
			expect( result.keywordDensity.getText() ).toBe( expectedResults.keywordDensity.resultText );
		} );

		it( "returns a score and the associated feedback text for the keywordStopWords assessment", function() {
			result.keywordStopWords = keywordStopWords.getResult(
				paper,
				factory.buildMockResearcher( stopWordsInKeyword( paper ) ),
				i18n
			);
			expect( result.keywordStopWords.getScore() ).toBe( expectedResults.keywordStopWords.score );
			expect( result.keywordStopWords.getText() ).toBe( expectedResults.keywordStopWords.resultText );
		} );

		it( "returns a score and the associated feedback text for the metaDescriptionKeyword assessment", function() {
			result.metaDescriptionKeyword = metaDescriptionKeywordAssessment.getResult(
				paper,
				factory.buildMockResearcher( metaDescriptionKeyword( paper ) ),
				i18n
			);
			expect( result.metaDescriptionKeyword.getScore() ).toBe( expectedResults.metaDescriptionKeyword.score );
			expect( result.metaDescriptionKeyword.getText() ).toBe( expectedResults.metaDescriptionKeyword.resultText );
		} );

		it( "returns a score and the associated feedback text for the metaDescriptionLength assessment", function() {
			result.metaDescriptionLength = new MetaDescriptionLengthAssessment().getResult(
				paper,
				factory.buildMockResearcher( metaDescriptionLength( paper ) ),
				i18n
			);
			expect( result.metaDescriptionLength.getScore() ).toBe( expectedResults.metaDescriptionLength.score );
			expect( result.metaDescriptionLength.getText() ).toBe( expectedResults.metaDescriptionLength.resultText );
		} );

		it( "returns a score and the associated feedback text for the subheadingsKeyword assessment", function() {
			result.subheadingsKeyword = new SubheadingsKeywordAssessment().getResult(
				paper,
				factory.buildMockResearcher( matchKeywordInSubheadings( paper ) ),
				i18n
			);
			expect( result.subheadingsKeyword.getScore() ).toBe( expectedResults.subheadingsKeyword.score );
			expect( result.subheadingsKeyword.getText() ).toBe( expectedResults.subheadingsKeyword.resultText );
		} );

		it( "returns a score and the associated feedback text for the textCompetingLinks assessment", function() {
			result.textCompetingLinks = textCompetingLinksAssessment.getResult(
				paper,
				factory.buildMockResearcher( getLinkStatistics( paper ) ),
				i18n
			);
			expect( result.textCompetingLinks.getScore() ).toBe( expectedResults.textCompetingLinks.score );
			expect( result.textCompetingLinks.getText() ).toBe( expectedResults.textCompetingLinks.resultText );
		} );

		it( "returns a score and the associated feedback text for the textImages assessment", function() {
			result.textImages = new TextImagesAssessment().getResult(
				paper,
				factory.buildMockResearcher(
					{
						imageCount: imageCount( paper ),
						altTagCount: altTagCount( paper ),
					},
					true
				),
				i18n
			);
			expect( result.textImages.getScore() ).toBe( expectedResults.textImages.score );
			expect( result.textImages.getText() ).toBe( expectedResults.textImages.resultText );
		} );

		it( "returns a score and the associated feedback text for the textLength assessment", function() {
			result.textLength = new TextLengthAssessment().getResult(
				paper,
				factory.buildMockResearcher( wordCountInText( paper ) ),
				i18n
			);
			expect( result.textLength.getScore() ).toBe( expectedResults.textLength.score );
			expect( result.textLength.getText() ).toBe( expectedResults.textLength.resultText );
		} );

		it( "returns a score and the associated feedback text for the externalLinks assessment", function() {
			result.externalLinks = new OutboundLinksAssessment().getResult(
				paper,
				factory.buildMockResearcher( getLinkStatistics( paper ) ),
				i18n
			);
			expect( result.externalLinks.getScore() ).toBe( expectedResults.externalLinks.score );
			expect( result.externalLinks.getText() ).toBe( expectedResults.externalLinks.resultText );
		} );

		it( "returns a score and the associated feedback text for the internalLinks assessment", function() {
			result.internalLinks = new InternalLinksAssessment().getResult(
				paper,
				factory.buildMockResearcher( getLinkStatistics( paper ) ),
				i18n
			);
			expect( result.internalLinks.getScore() ).toBe( expectedResults.internalLinks.score );
			expect( result.internalLinks.getText() ).toBe( expectedResults.internalLinks.resultText );
		} );

		it( "returns a score and the associated feedback text for the titleKeyword assessment", function() {
			result.titleKeyword = titleKeywordAssessment.getResult(
				paper,
				factory.buildMockResearcher( findKeywordInPageTitle( paper ) ),
				i18n
			);
			expect( result.titleKeyword.getScore() ).toBe( expectedResults.titleKeyword.score );
			expect( result.titleKeyword.getText() ).toBe( expectedResults.titleKeyword.resultText );
		} );

		it( "returns a score and the associated feedback text for the titleWidth assessment", function() {
			result.titleWidth = new TitleWidthAssessment().getResult(
				paper,
				factory.buildMockResearcher( pageTitleWidth( paper ) ),
				i18n
			);
			expect( result.titleWidth.getScore() ).toBe( expectedResults.titleWidth.score );
			expect( result.titleWidth.getText() ).toBe( expectedResults.titleWidth.resultText );
		} );

		it( "returns a score and the associated feedback text for the urlKeyword assessment", function() {
			result.urlKeyword = new UrlKeywordAssessment().getResult(
				paper,
				factory.buildMockResearcher( keywordCountInUrl( paper ) ),
				i18n
			);
			expect( result.urlKeyword.getScore() ).toBe( expectedResults.urlKeyword.score );
			expect( result.urlKeyword.getText() ).toBe( expectedResults.urlKeyword.resultText );
		} );

		it( "returns a score and the associated feedback text for the urlLength assessment", function() {
			result.urlLength = new UrlLengthAssessment().getResult(
				paper,
				factory.buildMockResearcher( urlLength( paper ) ),
				i18n
			);
			expect( result.urlLength.getScore() ).toBe( expectedResults.urlLength.score );
			expect( result.urlLength.getText() ).toBe( expectedResults.urlLength.resultText );
		} );

		it( "returns a score and the associated feedback text for the urlStopWords assessment", function() {
			result.urlStopWords = urlStopWordsAssessment.getResult(
				paper,
				factory.buildMockResearcher( stopWordsInUrl( paper ) ),
				i18n
			);
			expect( result.urlStopWords.getScore() ).toBe( expectedResults.urlStopWords.score );
			expect( result.urlStopWords.getText() ).toBe( expectedResults.urlStopWords.resultText );
		} );

		it( "returns a score and the associated feedback text for the largestKeywordDistance assessment", function() {
			result.largestKeywordDistance = new LargestKeywordDistanceAssessment().getResult(
				paper,
				factory.buildMockResearcher( largestKeywordDistance( paper ) ),
				i18n
			);
			expect( result.largestKeywordDistance.getScore() ).toBe( expectedResults.largestKeywordDistance.score );
			expect( result.largestKeywordDistance.getText() ).toBe( expectedResults.largestKeywordDistance.resultText );
		} );


		it( "returns a score and the associated feedback text for the fleschReadingEase assessment", function() {
			result.fleschReadingEase = new FleschReadingAssessment( contentConfiguration( locale ).fleschReading ).getResult(
				paper,
				factory.buildMockResearcher( calculateFleschReading( paper ) ),
				i18n
			);
			expect( result.fleschReadingEase.getScore() ).toBe( expectedResults.fleschReadingEase.score );
			expect( result.fleschReadingEase.getText() ).toBe( expectedResults.fleschReadingEase.resultText );
		} );
	} );
} );
