const contentConfiguration = require( "../../js/config/content/combinedConfig" );
const factory = require( "../helpers/factory.js" );
const i18n = factory.buildJed();
const morphologyData = require( "../../js/morphology/english/englishMorphology.json" );
const Researcher = require( "../../js/researcher" );

// Import SEO assessments
import IntroductionKeywordAssessment from "../../js/assessments/seo/IntroductionKeywordAssessment";
import KeyphraseLengthAssessment from "../../js/assessments/seo/KeyphraseLengthAssessment";
import KeywordDensityAssessment from  "../../js/assessments/seo/KeywordDensityAssessment";
const keywordStopWordsAssessment = require( "../../js/assessments/seo/keywordStopWordsAssessment" );
import MetaDescriptionKeywordAssessment from "../../js/assessments/seo/MetaDescriptionKeywordAssessment";
const MetaDescriptionLengthAssessment = require( "../../js/assessments/seo/metaDescriptionLengthAssessment" );
const SubheadingsKeywordAssessment = require( "../../js/assessments/seo/subheadingsKeywordAssessment" );
import TextCompetingLinksAssessment from "../../js/assessments/seo/TextCompetingLinksAssessment";
const TextImagesAssessment = require( "../../js/assessments/seo/textImagesAssessment" );
const TextLengthAssessment = require( "../../js/assessments/seo/textLengthAssessment" );
const OutboundLinksAssessment = require( "../../js/assessments/seo/outboundLinksAssessment" );
import InternalLinksAssessment from "../../js/assessments/seo/InternalLinksAssessment";
import TitleKeywordAssessment from "../../js/assessments/seo/TitleKeywordAssessment";
const TitleWidthAssessment = require( "../../js/assessments/seo/pageTitleWidthAssessment" );
import UrlKeywordAssessment from "../../js/assessments/seo/UrlKeywordAssessment";
const UrlLengthAssessment = require( "../../js/assessments/seo/urlLengthAssessment" );
const urlStopWordsAssessment = require( "../../js/assessments/seo/urlStopWordsAssessment" );
import LargestKeywordDistanceAssessment from "../../js/assessments/seo/LargestKeywordDistanceAssessment";

// Import content assessments
const FleschReadingAssessment = require( "../../js/assessments/readability/fleschReadingEaseAssessment" );
const SubheadingDistributionTooLongAssessment = require( "../../js/assessments/readability/subheadingDistributionTooLongAssessment" );
const paragraphTooLongAssessment = require( "../../js/assessments/readability/paragraphTooLongAssessment" );
const SentenceLengthInTextAssessment = require( "../../js/assessments/readability/sentenceLengthInTextAssessment" );
const transitionWordsAssessment = require( "../../js/assessments/readability/transitionWordsAssessment" );
const passiveVoiceAssessment = require( "../../js/assessments/readability/passiveVoiceAssessment" );
const textPresenceAssessment = require( "../../js/assessments/readability/textPresenceAssessment" );
const sentenceBeginningsAssessment = require( "../../js/assessments/readability/sentenceBeginningsAssessment" );


// Import researches
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
const getSubheadingTextLengths = require( "../../js/researches/getSubheadingTextLengths.js" );
const getParagraphLength = require( "../../js/researches/getParagraphLength.js" );
const countSentencesFromText = require( "../../js/researches/countSentencesFromText.js" );
const findTransitionWords = require( "../../js/researches/findTransitionWords.js" );
const passiveVoice = require( "../../js/researches/getPassiveVoice.js" );
const getSentenceBeginnings = require( "../../js/researches/getSentenceBeginnings.js" );
import sentences from "../../js/researches/sentences";

// Import test papers
import testPapers from "./testTexts";

testPapers.forEach( function( testPaper ) {
	describe( "Full-text test for paper " + testPaper.name, function() {
		const paper = testPaper.paper;
		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", morphologyData );

		const locale = paper.getLocale();
		const expectedResults = testPaper.expectedResults;
		let result = {};

		// SEO assessments.
		it( "returns a score and the associated feedback text for the introductionKeyword assessment", function() {
			result.introductionKeyword = new IntroductionKeywordAssessment().getResult(
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
			result.keywordStopWords = keywordStopWordsAssessment.getResult(
				paper,
				factory.buildMockResearcher( stopWordsInKeyword( paper ) ),
				i18n
			);
			expect( result.keywordStopWords.getScore() ).toBe( expectedResults.keywordStopWords.score );
			expect( result.keywordStopWords.getText() ).toBe( expectedResults.keywordStopWords.resultText );
		} );

		it( "returns a score and the associated feedback text for the metaDescriptionKeyword assessment", function() {
			result.metaDescriptionKeyword = new MetaDescriptionKeywordAssessment().getResult(
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
			result.textCompetingLinks = new TextCompetingLinksAssessment().getResult(
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
						altTagCount: altTagCount( paper, researcher ),
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
			result.titleKeyword = new TitleKeywordAssessment().getResult(
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

		// Readability assessments.
		it( "returns a score and the associated feedback text for the fleschReadingEase assessment", function() {
			result.fleschReadingEase = new FleschReadingAssessment( contentConfiguration( locale ).fleschReading ).getResult(
				paper,
				factory.buildMockResearcher( calculateFleschReading( paper ) ),
				i18n
			);
			expect( result.fleschReadingEase.getScore() ).toBe( expectedResults.fleschReadingEase.score );
			expect( result.fleschReadingEase.getText() ).toBe( expectedResults.fleschReadingEase.resultText );
		} );

		it( "returns a score and the associated feedback text for the subheadingsTooLong assessment", function() {
			result.subheadingsTooLong = new SubheadingDistributionTooLongAssessment().getResult(
				paper,
				factory.buildMockResearcher( getSubheadingTextLengths( paper ) ),
				i18n
			);
			expect( result.subheadingsTooLong.getScore() ).toBe( expectedResults.subheadingsTooLong.score );
			expect( result.subheadingsTooLong.getText() ).toBe( expectedResults.subheadingsTooLong.resultText );
		} );

		it( "returns a score and the associated feedback text for the textParagraphTooLong assessment", function() {
			result.textParagraphTooLong = paragraphTooLongAssessment.getResult(
				paper,
				factory.buildMockResearcher( getParagraphLength( paper ) ),
				i18n
			);
			expect( result.textParagraphTooLong.getScore() ).toBe( expectedResults.textParagraphTooLong.score );
			expect( result.textParagraphTooLong.getText() ).toBe( expectedResults.textParagraphTooLong.resultText );
		} );

		it( "returns a score and the associated feedback text for the textSentenceLength assessment", function() {
			result.textSentenceLength = new SentenceLengthInTextAssessment().getResult(
				paper,
				factory.buildMockResearcher( countSentencesFromText( paper ) ),
				i18n
			);
			expect( result.textSentenceLength.getScore() ).toBe( expectedResults.textSentenceLength.score );
			expect( result.textSentenceLength.getText() ).toBe( expectedResults.textSentenceLength.resultText );
		} );

		it( "returns a score and the associated feedback text for the textTransitionWords assessment", function() {
			result.textTransitionWords = transitionWordsAssessment.getResult(
				paper,
				factory.buildMockResearcher( findTransitionWords( paper ) ),
				i18n
			);
			expect( result.textTransitionWords.getScore() ).toBe( expectedResults.textTransitionWords.score );
			expect( result.textTransitionWords.getText() ).toBe( expectedResults.textTransitionWords.resultText );
		} );

		it( "returns a score and the associated feedback text for the passiveVoice assessment", function() {
			result.passiveVoice = passiveVoiceAssessment.getResult(
				paper,
				factory.buildMockResearcher( passiveVoice( paper ) ),
				i18n
			);
			expect( result.passiveVoice.getScore() ).toBe( expectedResults.passiveVoice.score );
			expect( result.passiveVoice.getText() ).toBe( expectedResults.passiveVoice.resultText );
		} );

		it( "returns a score and the associated feedback text for the textPresence assessment", function() {
			result.textPresence = textPresenceAssessment.getResult(
				paper,
				null,
				i18n
			);
			expect( result.textPresence.getScore() ).toBe( expectedResults.textPresence.score );
			expect( result.textPresence.getText() ).toBe( expectedResults.textPresence.resultText );
		} );

		it( "returns a score and the associated feedback text for the sentenceBeginnings assessment", function() {
			result.sentenceBeginnings = sentenceBeginningsAssessment.getResult(
				paper,
				factory.buildMockResearcher(
					getSentenceBeginnings(
						paper,
						factory.buildMockResearcher( sentences( paper ) )
					)
				),
				i18n
			);
			expect( result.sentenceBeginnings.getScore() ).toBe( expectedResults.sentenceBeginnings.score );
			expect( result.sentenceBeginnings.getText() ).toBe( expectedResults.sentenceBeginnings.resultText );
		} );
	} );
} );
