import { createAnchorOpeningTag } from "../../../../src/helpers/shortlinker";
import getLanguage from "../../../../src/languageProcessing/helpers/language/getLanguage";
import factory from "../../../../../yoastseo/spec/specHelpers/factory.js";
const i18n = factory.buildJed();
import getResearcher from "../../../../../yoastseo/spec/specHelpers/getResearcher";
import getMorphologyData from "../../../../../yoastseo/spec/specHelpers/getMorphologyData";

// Import SEO assessments
import IntroductionKeywordAssessment from "../../../../src/scoring/assessments/seo/IntroductionKeywordAssessment";
import KeyphraseLengthAssessment from "../../../../src/scoring/assessments/seo/KeyphraseLengthAssessment";
import KeywordDensityAssessment from "../../../../src/scoring/assessments/seo/KeywordDensityAssessment";
import MetaDescriptionKeywordAssessment from "../../../../src/scoring/assessments/seo/MetaDescriptionKeywordAssessment";
import MetaDescriptionLengthAssessment from "../../../../src/scoring/assessments/seo/MetaDescriptionLengthAssessment";
import SubHeadingsKeywordAssessment from "../../../../src/scoring/assessments/seo/SubHeadingsKeywordAssessment";
import TextCompetingLinksAssessment from "../../../../src/scoring/assessments/seo/TextCompetingLinksAssessment";
import TextLengthAssessment from "../../../../src/scoring/assessments/seo/TextLengthAssessment";
import TitleKeywordAssessment from "../../../../src/scoring/assessments/seo/TitleKeywordAssessment";
import TitleWidthAssessment from "../../../../src/scoring/assessments/seo/PageTitleWidthAssessment";
import UrlKeywordAssessment from "../../../../src/scoring/assessments/seo/UrlKeywordAssessment";
import FunctionWordsInKeyphrase from "../../../../src/scoring/assessments/seo/FunctionWordsInKeyphraseAssessment";
import SingleH1Assessment from "../../../../src/scoring/assessments/seo/SingleH1Assessment";
import ImageKeyphraseAssessment from "../../../../src/scoring/assessments/seo/KeyphraseInImageTextAssessment";
import ImageCountAssessment from "../../../../src/scoring/assessments/seo/ImageCountAssessment";
import ImageAltTags from "../../../../src/scoring/assessments/seo/ImageAltTagsAssessment";
import KeyphraseDistribution from "../../../../src/scoring/assessments/seo/KeyphraseDistributionAssessment";

// Import Readability assessments.
import SubheadingDistributionTooLongAssessment
	from "../../../../src/scoring/assessments/readability/SubheadingDistributionTooLongAssessment";
import ParagraphTooLongAssessment from "../../../../src/scoring/assessments/readability/ParagraphTooLongAssessment";
import SentenceLengthInTextAssessment
	from "../../../../src/scoring/assessments/readability/SentenceLengthInTextAssessment";
import TransitionWordsAssessment from "../../../../src/scoring/assessments/readability/TransitionWordsAssessment";
import PassiveVoiceAssessment from "../../../../src/scoring/assessments/readability/PassiveVoiceAssessment";
import TextPresenceAssessment from "../../../../src/scoring/assessments/readability/TextPresenceAssessment";
import ListAssessment from "../../../../src/scoring/assessments/readability/ListAssessment";
// Import test papers
import testPapers from "./testTexts";

testPapers.forEach( function( testPaper ) {
	// eslint-disable-next-line max-statements
	describe( "Full-text test for paper " + testPaper.name, function() {
		const paper = testPaper.paper;
		const locale = paper.getLocale();

		const LanguageResearcher = getResearcher( getLanguage( locale ) );
		const researcher = new LanguageResearcher( paper );
		researcher.addResearchData( "morphology", getMorphologyData( getLanguage( locale ) ) );

		const expectedResults = testPaper.expectedResults;
		const result = {};

		// Initialize all assessments
		const introductionKeywordAssessment = new IntroductionKeywordAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify8" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify9" ),
		} );
		const keyphraseLengthAssessment = new KeyphraseLengthAssessment( {
			parameters: {
				recommendedMinimum: 4,
				recommendedMaximum: 6,
				acceptableMaximum: 8,
				acceptableMinimum: 2,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify10" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify11" ),
		}, true );
		const keywordDensityAssessment = new KeywordDensityAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify12" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify13" ),
		} );
		const metaDescriptionKeywordAssessment = new MetaDescriptionKeywordAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify14" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify15" ),
		} );
		const metaDescriptionLengthAssessment = new MetaDescriptionLengthAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify46" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify47" ),
		} );
		const subheadingsKeywordAssessment = new SubHeadingsKeywordAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify16" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify17" ),
		} );
		const textCompetingLinksAssessment = new TextCompetingLinksAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify18" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify19" ),
		} );
		const textLengthAssessment = new TextLengthAssessment( {
			recommendedMinimum: 200,
			slightlyBelowMinimum: 150,
			belowMinimum: 100,
			veryFarBelowMinimum: 50,
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify58" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify59" ),
		} );
		const titleKeywordAssessment = new TitleKeywordAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify24" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify25" ),
		} );
		const titleWidthAssessment = new TitleWidthAssessment( {
			scores: {
				widthTooShort: 9,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify52" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify53" ),
		}, true );
		const urlKeywordAssessment = new UrlKeywordAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify26" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify27" ),
		} );
		const functionWordsInKeyphrase = new FunctionWordsInKeyphrase( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify50" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify51" ),
		} );
		const singleH1Assessment = new SingleH1Assessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify54" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify55" ),
		} );
		const imageKeyphraseAssessment = new ImageKeyphraseAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify22" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify23" ),
		} );
		const imageCountAssessment = new ImageCountAssessment( {
			scores: {
				okay: 6,
			},
			recommendedCount: 4,
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify20" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify21" ),
		}, true );
		const imageAltTagsAsessment = new ImageAltTags( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify40" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify41" ),
		} );
		const keyphraseDistributionAssessment = new KeyphraseDistribution( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify30" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify31" ),
		} );
		const subheadingDistributionTooLongAssessment = new SubheadingDistributionTooLongAssessment( {
			shouldNotAppearInShortText: true,
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify68" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify69" ),
		} );
		const sentenceLengthInTextAssessment = new SentenceLengthInTextAssessment( {
			slightlyTooMany: 20,
			farTooMany: 25,
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify48" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify49" ),
		}, false, true );
		const paragraphTooLongAssessment = new ParagraphTooLongAssessment( {
			parameters: {
				recommendedLength: 70,
				maximumRecommendedLength: 100,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify66" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify67" ),
		} );
		const transitionWordsAssessment = new TransitionWordsAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify44" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify45" ),
		} );
		const passiveVoiceAssessment = new PassiveVoiceAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify42" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify43" ),
		} );
		const textPresenceAssessment = new TextPresenceAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify56" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify57" ),
		} );
		const listPresenceAssessment = new ListAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify38" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify39" ),
		} );

		// SEO assessments.
		it( "returns a score and the associated feedback text for the introductionKeyword assessment", function() {
			const isApplicable = introductionKeywordAssessment.isApplicable( paper );
			expect( isApplicable ).toBe( expectedResults.introductionKeyword.isApplicable );

			if ( isApplicable ) {
				result.introductionKeyword = introductionKeywordAssessment.getResult( paper, researcher, i18n );
				expect( result.introductionKeyword.getScore() ).toBe( expectedResults.introductionKeyword.score );
				expect( result.introductionKeyword.getText() ).toBe( expectedResults.introductionKeyword.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the keyphraseLength assessment", function() {
			const isApplicable = keyphraseLengthAssessment.isApplicable( paper, researcher );
			expect( isApplicable ).toBe( expectedResults.keyphraseLength.isApplicable );

			if ( isApplicable ) {
				result.keyphraseLength = keyphraseLengthAssessment.getResult( paper, researcher, i18n );
				expect( result.keyphraseLength.getScore() ).toBe( expectedResults.keyphraseLength.score );
				expect( result.keyphraseLength.getText() ).toBe( expectedResults.keyphraseLength.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the keywordDensity assessment", function() {
			const isApplicable = keywordDensityAssessment.isApplicable( paper );
			expect( isApplicable ).toBe( expectedResults.keywordDensity.isApplicable );

			if ( isApplicable ) {
				result.keywordDensity = keywordDensityAssessment.getResult(
					paper,
					researcher,
					i18n
				);
				expect( result.keywordDensity.getScore() ).toBe( expectedResults.keywordDensity.score );
				expect( result.keywordDensity.getText() ).toBe( expectedResults.keywordDensity.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the metaDescriptionKeyword assessment", function() {
			const isApplicable = metaDescriptionKeywordAssessment.isApplicable( paper );
			expect( isApplicable ).toBe( expectedResults.metaDescriptionKeyword.isApplicable );

			if ( isApplicable ) {
				result.metaDescriptionKeyword = metaDescriptionKeywordAssessment.getResult( paper, researcher, i18n );
				expect( result.metaDescriptionKeyword.getScore() ).toBe( expectedResults.metaDescriptionKeyword.score );
				expect( result.metaDescriptionKeyword.getText() ).toBe( expectedResults.metaDescriptionKeyword.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the metaDescriptionLength assessment", function() {
			const isApplicable = metaDescriptionLengthAssessment.isApplicable( paper, researcher );
			expect( isApplicable ).toBe( expectedResults.metaDescriptionLength.isApplicable );

			if ( isApplicable ) {
				result.metaDescriptionLength = metaDescriptionLengthAssessment.getResult( paper, researcher, i18n );
				expect( result.metaDescriptionLength.getScore() ).toBe( expectedResults.metaDescriptionLength.score );
				expect( result.metaDescriptionLength.getText() ).toBe( expectedResults.metaDescriptionLength.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the subheadingsKeyword assessment", function() {
			const isApplicable = subheadingsKeywordAssessment.isApplicable( paper );
			expect( isApplicable ).toBe( expectedResults.subheadingsKeyword.isApplicable );

			if ( isApplicable ) {
				result.subheadingsKeyword = subheadingsKeywordAssessment.getResult( paper, researcher, i18n );
				expect( result.subheadingsKeyword.getScore() ).toBe( expectedResults.subheadingsKeyword.score );
				expect( result.subheadingsKeyword.getText() ).toBe( expectedResults.subheadingsKeyword.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the textCompetingLinks assessment", function() {
			const isApplicable = textCompetingLinksAssessment.isApplicable( paper );
			expect( isApplicable ).toBe( expectedResults.textCompetingLinks.isApplicable );

			if ( isApplicable ) {
				result.textCompetingLinks = textCompetingLinksAssessment.getResult( paper, researcher, i18n );
				expect( result.textCompetingLinks.getScore() ).toBe( expectedResults.textCompetingLinks.score );
				expect( result.textCompetingLinks.getText() ).toBe( expectedResults.textCompetingLinks.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the textLength assessment", function() {
			const isApplicable = textLengthAssessment.isApplicable( paper, researcher );
			expect( isApplicable ).toBe( expectedResults.textLength.isApplicable );

			if ( isApplicable ) {
				result.textLength = textLengthAssessment.getResult( paper, researcher, i18n );
				expect( result.textLength.getScore() ).toBe( expectedResults.textLength.score );
				expect( result.textLength.getText() ).toBe( expectedResults.textLength.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the titleKeyword assessment", function() {
			const isApplicable = titleKeywordAssessment.isApplicable( paper );
			expect( isApplicable ).toBe( expectedResults.titleKeyword.isApplicable );

			if ( isApplicable ) {
				result.titleKeyword = titleKeywordAssessment.getResult( paper, researcher, i18n );
				expect( result.titleKeyword.getScore() ).toBe( expectedResults.titleKeyword.score );
				expect( result.titleKeyword.getText() ).toBe( expectedResults.titleKeyword.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the titleWidth assessment", function() {
			const isApplicable = titleWidthAssessment.isApplicable( paper, researcher );
			expect( isApplicable ).toBe( expectedResults.titleWidth.isApplicable );

			if ( isApplicable ) {
				result.titleWidth = titleWidthAssessment.getResult( paper, researcher, i18n );
				expect( result.titleWidth.getScore() ).toBe( expectedResults.titleWidth.score );
				expect( result.titleWidth.getText() ).toBe( expectedResults.titleWidth.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the urlKeyword assessment", function() {
			const isApplicable = urlKeywordAssessment.isApplicable( paper );
			expect( isApplicable ).toBe( expectedResults.urlKeyword.isApplicable );

			if ( isApplicable ) {
				result.urlKeyword = urlKeywordAssessment.getResult( paper, researcher, i18n );
				expect( result.urlKeyword.getScore() ).toBe( expectedResults.urlKeyword.score );
				expect( result.urlKeyword.getText() ).toBe( expectedResults.urlKeyword.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the keyphraseDistribution assessment", function() {
			const isApplicable = functionWordsInKeyphrase.isApplicable( paper, researcher );
			expect( isApplicable ).toBe( expectedResults.functionWordsInKeyphrase.isApplicable );

			if ( isApplicable ) {
				result.functionWordsInKeyphrase = functionWordsInKeyphrase.getResult( paper, researcher, i18n );
				expect( result.functionWordsInKeyphrase.getScore() ).toBe( expectedResults.functionWordsInKeyphrase.score );
				expect( result.functionWordsInKeyphrase.getText() ).toBe( expectedResults.functionWordsInKeyphrase.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the singleH1 assessment", function() {
			const isApplicable = singleH1Assessment.isApplicable( paper );
			expect( isApplicable ).toBe( expectedResults.singleH1.isApplicable );

			if ( isApplicable ) {
				result.singleH1 = singleH1Assessment.getResult( paper, researcher, i18n );
				expect( result.singleH1.getScore() ).toBe( expectedResults.singleH1.score );
				expect( result.singleH1.getText() ).toBe( expectedResults.singleH1.resultText );
			}
		} );

		// Images-related assessments
		it( "returns a score and the associated feedback text for the imageKeyphrase assessment", function() {
			const isApplicable = imageKeyphraseAssessment.isApplicable( paper, researcher );
			expect( isApplicable ).toBe( expectedResults.imageKeyphrase.isApplicable );

			if ( isApplicable ) {
				result.imageKeyphrase = imageKeyphraseAssessment.getResult( paper, researcher, i18n );
				expect( result.imageKeyphrase.getScore() ).toBe( expectedResults.imageKeyphrase.score );
				expect( result.imageKeyphrase.getText() ).toBe( expectedResults.imageKeyphrase.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the imageCount assessment", function() {
			const isApplicable = imageCountAssessment.isApplicable( paper );
			expect( isApplicable ).toBe( expectedResults.imageCount.isApplicable );

			if ( isApplicable ) {
				result.imageCount = imageCountAssessment.getResult( paper, researcher, i18n );
				expect( result.imageCount.getScore() ).toBe( expectedResults.imageCount.score );
				expect( result.imageCount.getText() ).toBe( expectedResults.imageCount.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the imageAltTags assessment", function() {
			const isApplicable = imageAltTagsAsessment.isApplicable( paper, researcher );
			expect( isApplicable ).toBe( expectedResults.imageAltTags.isApplicable );

			if ( isApplicable ) {
				result.imageAltTags = imageAltTagsAsessment.getResult( paper, researcher, i18n );
				expect( result.imageAltTags.getScore() ).toBe( expectedResults.imageAltTags.score );
				expect( result.imageAltTags.getText() ).toBe( expectedResults.imageAltTags.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the keyphraseDistribution assessment", function() {
			const isApplicable = keyphraseDistributionAssessment.isApplicable( paper );
			expect( isApplicable ).toBe( expectedResults.keyphraseDistribution.isApplicable );

			if ( isApplicable ) {
				result.keyphraseDistribution = keyphraseDistributionAssessment.getResult( paper, researcher, i18n );
				expect( result.keyphraseDistribution.getScore() ).toBe( expectedResults.keyphraseDistribution.score );
				expect( result.keyphraseDistribution.getText() ).toBe( expectedResults.keyphraseDistribution.resultText );
			}
		} );

		// Readability assessments.
		it( "returns a score and the associated feedback text for the subheadingsTooLong assessment", function() {
			const isApplicable = subheadingDistributionTooLongAssessment.isApplicable( paper );
			expect( isApplicable ).toBe( expectedResults.subheadingsTooLong.isApplicable );

			if ( isApplicable ) {
				result.subheadingsTooLong = subheadingDistributionTooLongAssessment.getResult( paper, researcher, i18n );
				expect( result.subheadingsTooLong.getScore() ).toBe( expectedResults.subheadingsTooLong.score );
				expect( result.subheadingsTooLong.getText() ).toBe( expectedResults.subheadingsTooLong.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the textSentenceLength assessment", function() {
			const isApplicable = sentenceLengthInTextAssessment.isApplicable( paper );
			expect( isApplicable ).toBe( expectedResults.textSentenceLength.isApplicable );

			if ( isApplicable ) {
				result.textSentenceLength = sentenceLengthInTextAssessment.getResult( paper, researcher, i18n );
				expect( result.textSentenceLength.getScore() ).toBe( expectedResults.textSentenceLength.score );
				expect( result.textSentenceLength.getText() ).toBe( expectedResults.textSentenceLength.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the textParagraphTooLong assessment", function() {
			const isApplicable = paragraphTooLongAssessment.isApplicable( paper );
			expect( isApplicable ).toBe( expectedResults.textParagraphTooLong.isApplicable );

			if ( isApplicable ) {
				result.textParagraphTooLong = paragraphTooLongAssessment.getResult( paper, researcher, i18n );
				expect( result.textParagraphTooLong.getScore() ).toBe( expectedResults.textParagraphTooLong.score );
				expect( result.textParagraphTooLong.getText() ).toBe( expectedResults.textParagraphTooLong.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the textTransitionWords assessment", function() {
			const isApplicable = transitionWordsAssessment.isApplicable( paper, researcher );
			expect( isApplicable ).toBe( expectedResults.textTransitionWords.isApplicable );

			if ( isApplicable ) {
				result.textTransitionWords = transitionWordsAssessment.getResult( paper, researcher, i18n );
				expect( result.textTransitionWords.getScore() ).toBe( expectedResults.textTransitionWords.score );
				expect( result.textTransitionWords.getText() ).toBe( expectedResults.textTransitionWords.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the passiveVoice assessment", function() {
			const isApplicable = passiveVoiceAssessment.isApplicable( paper, researcher );
			expect( isApplicable ).toBe( expectedResults.passiveVoice.isApplicable );

			if ( isApplicable ) {
				result.passiveVoice = passiveVoiceAssessment.getResult( paper, researcher, i18n );
				expect( result.passiveVoice.getScore() ).toBe( expectedResults.passiveVoice.score );
				expect( result.passiveVoice.getText() ).toBe( expectedResults.passiveVoice.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the textPresence assessment", function() {
			result.textPresence = textPresenceAssessment.getResult( paper, researcher, i18n );
			expect( result.textPresence.getScore() ).toBe( expectedResults.textPresence.score );
			expect( result.textPresence.getText() ).toBe( expectedResults.textPresence.resultText );
		} );

		it( "returns a score and the associated feedback text for the listPresence assessment", function() {
			const isApplicable = listPresenceAssessment.isApplicable( paper );
			expect( isApplicable ).toBe( expectedResults.listPresence.isApplicable );

			if ( isApplicable ) {
				result.listPresence = listPresenceAssessment.getResult( paper, researcher, i18n );
				expect( result.listPresence.getScore() ).toBe( expectedResults.listPresence.score );
				expect( result.listPresence.getText() ).toBe( expectedResults.listPresence.resultText );
			}
		} );
	} );
} );
