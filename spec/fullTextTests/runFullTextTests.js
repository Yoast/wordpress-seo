import contentConfiguration from "../../src/config/content/combinedConfig";
import factory from "../helpers/factory.js";
const i18n = factory.buildJed();
import morphologyData from "../../src/morphology/morphologyData.json";
import Researcher from "../../src/researcher";

// Import SEO assessments
import IntroductionKeywordAssessment from "../../src/assessments/seo/IntroductionKeywordAssessment";
import KeyphraseLengthAssessment from "../../src/assessments/seo/KeyphraseLengthAssessment";
import KeywordDensityAssessment from  "../../src/assessments/seo/KeywordDensityAssessment";
import keywordStopWordsAssessment from "../../src/assessments/seo/keywordStopWordsAssessment";
import MetaDescriptionKeywordAssessment from "../../src/assessments/seo/MetaDescriptionKeywordAssessment";
import MetaDescriptionLengthAssessment from "../../src/assessments/seo/metaDescriptionLengthAssessment";
import SubheadingsKeywordAssessment from "../../src/assessments/seo/subheadingsKeywordAssessment";
import TextCompetingLinksAssessment from "../../src/assessments/seo/TextCompetingLinksAssessment";
import TextImagesAssessment from "../../src/assessments/seo/textImagesAssessment";
import TextLengthAssessment from "../../src/assessments/seo/textLengthAssessment";
import OutboundLinksAssessment from "../../src/assessments/seo/outboundLinksAssessment";
import InternalLinksAssessment from "../../src/assessments/seo/InternalLinksAssessment";
import TitleKeywordAssessment from "../../src/assessments/seo/TitleKeywordAssessment";
import TitleWidthAssessment from "../../src/assessments/seo/pageTitleWidthAssessment";
import UrlKeywordAssessment from "../../src/assessments/seo/UrlKeywordAssessment";
import UrlLengthAssessment from "../../src/assessments/seo/urlLengthAssessment";
import urlStopWordsAssessment from "../../src/assessments/seo/urlStopWordsAssessment";
import LargestKeywordDistanceAssessment from "../../src/assessments/seo/LargestKeywordDistanceAssessment";

// Import content assessments
import FleschReadingAssessment from "../../src/assessments/readability/fleschReadingEaseAssessment";
import SubheadingDistributionTooLongAssessment from "../../src/assessments/readability/subheadingDistributionTooLongAssessment";
import paragraphTooLongAssessment from "../../src/assessments/readability/paragraphTooLongAssessment";
import SentenceLengthInTextAssessment from "../../src/assessments/readability/sentenceLengthInTextAssessment";
import transitionWordsAssessment from "../../src/assessments/readability/transitionWordsAssessment";
import passiveVoiceAssessment from "../../src/assessments/readability/passiveVoiceAssessment";
import textPresenceAssessment from "../../src/assessments/readability/textPresenceAssessment";
import sentenceBeginningsAssessment from "../../src/assessments/readability/sentenceBeginningsAssessment";

// Import researches
import findKeywordInFirstParagraph from "../../src/researches/findKeywordInFirstParagraph.js";
import keyphraseLength from "../../src/researches/keyphraseLength";
import keywordCount from "../../src/researches/keywordCount";
import getKeywordDensity from "../../src/researches/getKeywordDensity.js";
import stopWordsInKeyword from "../../src/researches/stopWordsInKeyword";
import metaDescriptionKeyword from "../../src/researches/metaDescriptionKeyword.js";
import metaDescriptionLength from "../../src/researches/metaDescriptionLength.js";
import matchKeywordInSubheadings from "../../src/researches/matchKeywordInSubheadings.js";
import getLinkStatistics from "../../src/researches/getLinkStatistics.js";
import imageCount from "../../src/researches/imageCountInText.js";
import altTagCount from "../../src/researches/imageAltTags.js";
import wordCountInText from "../../src/researches/wordCountInText.js";
import findKeywordInPageTitle from "../../src/researches/findKeywordInPageTitle.js";
import pageTitleWidth from "../../src/researches/pageTitleWidth.js";
import keywordCountInUrl from "../../src/researches/keywordCountInUrl";
import urlLength from "../../src/researches/urlIsTooLong.js";
import stopWordsInUrl from "../../src/researches/stopWordsInUrl";
import largestKeywordDistance from "../../src/researches/largestKeywordDistance";
import calculateFleschReading from "../../src/researches/calculateFleschReading.js";
import getSubheadingTextLengths from "../../src/researches/getSubheadingTextLengths.js";
import getParagraphLength from "../../src/researches/getParagraphLength.js";
import countSentencesFromText from "../../src/researches/countSentencesFromText.js";
import findTransitionWords from "../../src/researches/findTransitionWords.js";
import passiveVoice from "../../src/researches/getPassiveVoice.js";
import getSentenceBeginnings from "../../src/researches/getSentenceBeginnings.js";
import sentences from "../../src/researches/sentences";

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
				factory.buildMockResearcher( findKeywordInFirstParagraph( paper, researcher ) ),
				i18n
			);
			expect( result.introductionKeyword.getScore() ).toBe( expectedResults.introductionKeyword.score );
			expect( result.introductionKeyword.getText() ).toBe( expectedResults.introductionKeyword.resultText );
		} );

		it( "returns a score and the associated feedback text for the keyphraseLength assessment", function() {
			result.keyphraseLength = new KeyphraseLengthAssessment().getResult(
				paper,
				factory.buildMockResearcher( keyphraseLength( paper, researcher ) ),
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
							factory.buildMockResearcher( keywordCount( paper, factory.buildMockResearcher( {
								keyphraseForms: [ [ "voice", "voices" ], [ "search", "searches" ] ],
							} ) ) )
						),
						keywordCount: keywordCount( paper, factory.buildMockResearcher( {
							keyphraseForms: [ [ "voice", "voices" ], [ "search", "searches" ] ],
						} ) ),
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
