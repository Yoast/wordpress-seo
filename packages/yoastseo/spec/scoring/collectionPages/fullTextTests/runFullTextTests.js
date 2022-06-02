import { createAnchorOpeningTag } from "../../../../src/helpers/shortlinker";
import getLanguage from "../../../../src/languageProcessing/helpers/language/getLanguage";
import getResearcher from "../../../../../yoastseo/spec/specHelpers/getResearcher";
import getMorphologyData from "../../../../../yoastseo/spec/specHelpers/getMorphologyData";

// Import SEO assessments
import IntroductionKeywordAssessment from "../../../../src/scoring/assessments/seo/IntroductionKeywordAssessment";
import KeyphraseLengthAssessment from "../../../../src/scoring/assessments/seo/KeyphraseLengthAssessment";
import KeywordDensityAssessment from "../../../../src/scoring/assessments/seo/KeywordDensityAssessment";
import MetaDescriptionKeywordAssessment from "../../../../src/scoring/assessments/seo/MetaDescriptionKeywordAssessment";
import MetaDescriptionLengthAssessment from "../../../../src/scoring/assessments/seo/MetaDescriptionLengthAssessment";
import TextLengthAssessment from "../../../../src/scoring/assessments/seo/TextLengthAssessment";
import KeyphraseInSEOTitleAssessment from "../../../../src/scoring/assessments/seo/KeyphraseInSEOTitleAssessment";
import TitleWidthAssessment from "../../../../src/scoring/assessments/seo/PageTitleWidthAssessment";
import SlugKeywordAssessment from "../../../../src/scoring/assessments/seo/UrlKeywordAssessment";
import FunctionWordsInKeyphrase from "../../../../src/scoring/assessments/seo/FunctionWordsInKeyphraseAssessment";
import SingleH1Assessment from "../../../../src/scoring/assessments/seo/SingleH1Assessment";
import KeyphraseDistribution from "../../../../src/scoring/assessments/seo/KeyphraseDistributionAssessment";

// Import Readability assessments.
import SubheadingDistributionTooLongAssessment from "../../../../src/scoring/assessments/readability/SubheadingDistributionTooLongAssessment";
import ParagraphTooLongAssessment from "../../../../src/scoring/assessments/readability/ParagraphTooLongAssessment";
import SentenceLengthInTextAssessment from "../../../../src/scoring/assessments/readability/SentenceLengthInTextAssessment";
import TransitionWordsAssessment from "../../../../src/scoring/assessments/readability/TransitionWordsAssessment";
import PassiveVoiceAssessment from "../../../../src/scoring/assessments/readability/PassiveVoiceAssessment";
import TextPresenceAssessment from "../../../../src/scoring/assessments/readability/TextPresenceAssessment";
import SentenceBeginningsAssessment from "../../../../src/scoring/assessments/readability/SentenceBeginningsAssessment";

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
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify10" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify11" ),
		} );
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
		const textLengthAssessment = new TextLengthAssessment( {
			recommendedMinimum: 80,
			slightlyBelowMinimum: 50,
			belowMinimum: 20,
			veryFarBelowMinimum: 10,
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify58" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify59" ),
		} );
		const titleKeywordAssessment = new KeyphraseInSEOTitleAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify24" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify25" ),
		} );
		const titleWidthAssessment = new TitleWidthAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify52" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify53" ),
		} );
		const slugKeywordAssessment = new SlugKeywordAssessment( {
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
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify48" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify49" ),
		} );
		const paragraphTooLongAssessment = new ParagraphTooLongAssessment( {
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
		const sentenceBeginningAssessment = new SentenceBeginningsAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify5" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify65" ),
		} );

		// SEO assessments.
		it( "returns a score and the associated feedback text for the introductionKeyword assessment", function() {
			const isApplicable = introductionKeywordAssessment.isApplicable( paper );
			expect( isApplicable ).toBe( expectedResults.introductionKeyword.isApplicable );

			if ( isApplicable ) {
				result.introductionKeyword = introductionKeywordAssessment.getResult( paper, researcher );
				expect( result.introductionKeyword.getScore() ).toBe( expectedResults.introductionKeyword.score );
				expect( result.introductionKeyword.getText() ).toBe( expectedResults.introductionKeyword.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the keyphraseLength assessment", function() {
			const isApplicable = keyphraseLengthAssessment.isApplicable( paper, researcher );
			expect( isApplicable ).toBe( expectedResults.keyphraseLength.isApplicable );

			if ( isApplicable ) {
				result.keyphraseLength = keyphraseLengthAssessment.getResult( paper, researcher );
				expect( result.keyphraseLength.getScore() ).toBe( expectedResults.keyphraseLength.score );
				expect( result.keyphraseLength.getText() ).toBe( expectedResults.keyphraseLength.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the keywordDensity assessment", function() {
			const isApplicable = keywordDensityAssessment.isApplicable( paper, researcher );
			expect( isApplicable ).toBe( expectedResults.keywordDensity.isApplicable );

			if ( isApplicable ) {
				result.keywordDensity = keywordDensityAssessment.getResult(
					paper,
					researcher
				);
				expect( result.keywordDensity.getScore() ).toBe( expectedResults.keywordDensity.score );
				expect( result.keywordDensity.getText() ).toBe( expectedResults.keywordDensity.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the metaDescriptionKeyword assessment", function() {
			const isApplicable = metaDescriptionKeywordAssessment.isApplicable( paper );
			expect( isApplicable ).toBe( expectedResults.metaDescriptionKeyword.isApplicable );

			if ( isApplicable ) {
				result.metaDescriptionKeyword = metaDescriptionKeywordAssessment.getResult( paper, researcher );
				expect( result.metaDescriptionKeyword.getScore() ).toBe( expectedResults.metaDescriptionKeyword.score );
				expect( result.metaDescriptionKeyword.getText() ).toBe( expectedResults.metaDescriptionKeyword.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the metaDescriptionLength assessment", function() {
			const isApplicable = metaDescriptionLengthAssessment.isApplicable( paper, researcher );
			expect( isApplicable ).toBe( expectedResults.metaDescriptionLength.isApplicable );

			if ( isApplicable ) {
				result.metaDescriptionLength = metaDescriptionLengthAssessment.getResult( paper, researcher );
				expect( result.metaDescriptionLength.getScore() ).toBe( expectedResults.metaDescriptionLength.score );
				expect( result.metaDescriptionLength.getText() ).toBe( expectedResults.metaDescriptionLength.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the textLength assessment", function() {
			const isApplicable = textLengthAssessment.isApplicable( paper, researcher );
			expect( isApplicable ).toBe( expectedResults.textLength.isApplicable );

			if ( isApplicable ) {
				result.textLength = textLengthAssessment.getResult( paper, researcher );
				expect( result.textLength.getScore() ).toBe( expectedResults.textLength.score );
				expect( result.textLength.getText() ).toBe( expectedResults.textLength.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the titleKeyword assessment", function() {
			const isApplicable = titleKeywordAssessment.isApplicable( paper );
			expect( isApplicable ).toBe( expectedResults.titleKeyword.isApplicable );

			if ( isApplicable ) {
				result.titleKeyword = titleKeywordAssessment.getResult( paper, researcher );
				expect( result.titleKeyword.getScore() ).toBe( expectedResults.titleKeyword.score );
				expect( result.titleKeyword.getText() ).toBe( expectedResults.titleKeyword.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the titleWidth assessment", function() {
			const isApplicable = titleWidthAssessment.isApplicable( paper, researcher );
			expect( isApplicable ).toBe( expectedResults.titleWidth.isApplicable );

			if ( isApplicable ) {
				result.titleWidth = titleWidthAssessment.getResult( paper, researcher );
				expect( result.titleWidth.getScore() ).toBe( expectedResults.titleWidth.score );
				expect( result.titleWidth.getText() ).toBe( expectedResults.titleWidth.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the slugKeyword assessment", function() {
			const isApplicable = slugKeywordAssessment.isApplicable( paper, researcher );
			expect( isApplicable ).toBe( expectedResults.slugKeyword.isApplicable );

			if ( isApplicable ) {
				result.slugKeyword = slugKeywordAssessment.getResult( paper, researcher );
				expect( result.slugKeyword.getScore() ).toBe( expectedResults.slugKeyword.score );
				expect( result.slugKeyword.getText() ).toBe( expectedResults.slugKeyword.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the functionWordsInKeyphrase assessment", function() {
			const isApplicable = functionWordsInKeyphrase.isApplicable( paper, researcher );
			expect( isApplicable ).toBe( expectedResults.functionWordsInKeyphrase.isApplicable );

			if ( isApplicable ) {
				result.functionWordsInKeyphrase = functionWordsInKeyphrase.getResult( paper, researcher );
				expect( result.functionWordsInKeyphrase.getScore() ).toBe( expectedResults.functionWordsInKeyphrase.score );
				expect( result.functionWordsInKeyphrase.getText() ).toBe( expectedResults.functionWordsInKeyphrase.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the singleH1 assessment", function() {
			const isApplicable = singleH1Assessment.isApplicable( paper );
			expect( isApplicable ).toBe( expectedResults.singleH1.isApplicable );

			if ( isApplicable ) {
				result.singleH1 = singleH1Assessment.getResult( paper, researcher );
				expect( result.singleH1.getScore() ).toBe( expectedResults.singleH1.score );
				expect( result.singleH1.getText() ).toBe( expectedResults.singleH1.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the keyphraseDistribution assessment", function() {
			const isApplicable = keyphraseDistributionAssessment.isApplicable( paper, researcher );
			expect( isApplicable ).toBe( expectedResults.keyphraseDistribution.isApplicable );

			if ( isApplicable ) {
				result.keyphraseDistribution = keyphraseDistributionAssessment.getResult( paper, researcher );
				expect( result.keyphraseDistribution.getScore() ).toBe( expectedResults.keyphraseDistribution.score );
				expect( result.keyphraseDistribution.getText() ).toBe( expectedResults.keyphraseDistribution.resultText );
			}
		} );

		// Readability assessments.
		it( "returns a score and the associated feedback text for the subheadingsTooLong assessment", function() {
			const isApplicable = subheadingDistributionTooLongAssessment.isApplicable( paper, researcher );
			expect( isApplicable ).toBe( expectedResults.subheadingsTooLong.isApplicable );

			if ( isApplicable ) {
				result.subheadingsTooLong = subheadingDistributionTooLongAssessment.getResult( paper, researcher );
				expect( result.subheadingsTooLong.getScore() ).toBe( expectedResults.subheadingsTooLong.score );
				expect( result.subheadingsTooLong.getText() ).toBe( expectedResults.subheadingsTooLong.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the textSentenceLength assessment", function() {
			const isApplicable = sentenceLengthInTextAssessment.isApplicable( paper );
			expect( isApplicable ).toBe( expectedResults.textSentenceLength.isApplicable );

			if ( isApplicable ) {
				result.textSentenceLength = sentenceLengthInTextAssessment.getResult( paper, researcher );
				expect( result.textSentenceLength.getScore() ).toBe( expectedResults.textSentenceLength.score );
				expect( result.textSentenceLength.getText() ).toBe( expectedResults.textSentenceLength.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the textParagraphTooLong assessment", function() {
			const isApplicable = paragraphTooLongAssessment.isApplicable( paper );
			expect( isApplicable ).toBe( expectedResults.textParagraphTooLong.isApplicable );

			if ( isApplicable ) {
				result.textParagraphTooLong = paragraphTooLongAssessment.getResult( paper, researcher );
				expect( result.textParagraphTooLong.getScore() ).toBe( expectedResults.textParagraphTooLong.score );
				expect( result.textParagraphTooLong.getText() ).toBe( expectedResults.textParagraphTooLong.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the textTransitionWords assessment", function() {
			const isApplicable = transitionWordsAssessment.isApplicable( paper, researcher );
			expect( isApplicable ).toBe( expectedResults.textTransitionWords.isApplicable );

			if ( isApplicable ) {
				result.textTransitionWords = transitionWordsAssessment.getResult( paper, researcher );
				expect( result.textTransitionWords.getScore() ).toBe( expectedResults.textTransitionWords.score );
				expect( result.textTransitionWords.getText() ).toBe( expectedResults.textTransitionWords.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the passiveVoice assessment", function() {
			const isApplicable = passiveVoiceAssessment.isApplicable( paper, researcher );
			expect( isApplicable ).toBe( expectedResults.passiveVoice.isApplicable );

			if ( isApplicable ) {
				result.passiveVoice = passiveVoiceAssessment.getResult( paper, researcher );
				expect( result.passiveVoice.getScore() ).toBe( expectedResults.passiveVoice.score );
				expect( result.passiveVoice.getText() ).toBe( expectedResults.passiveVoice.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the textPresence assessment", function() {
			result.textPresence = textPresenceAssessment.getResult( paper, researcher );
			expect( result.textPresence.getScore() ).toBe( expectedResults.textPresence.score );
			expect( result.textPresence.getText() ).toBe( expectedResults.textPresence.resultText );
		} );

		it( "returns a score and the associated feedback text for the sentenceBeginnings assessment", function() {
			const isApplicable = sentenceBeginningAssessment.isApplicable( paper, researcher );
			expect( isApplicable ).toBe( expectedResults.sentenceBeginnings.isApplicable );

			if ( isApplicable ) {
				result.sentenceBeginnings = sentenceBeginningAssessment.getResult( paper, researcher );
				expect( result.sentenceBeginnings.getScore() ).toBe( expectedResults.sentenceBeginnings.score );
				expect( result.sentenceBeginnings.getText() ).toBe( expectedResults.sentenceBeginnings.resultText );
			}
		} );
	} );
} );
