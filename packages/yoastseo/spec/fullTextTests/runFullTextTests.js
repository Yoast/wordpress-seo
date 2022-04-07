import getLanguage from "../../src/languageProcessing/helpers/language/getLanguage";
import getResearcher from "../specHelpers/getResearcher";
import getMorphologyData from "../specHelpers/getMorphologyData";
// Import SEO assessments
import IntroductionKeywordAssessment from "../../src/scoring/assessments/seo/IntroductionKeywordAssessment";
import KeyphraseLengthAssessment from "../../src/scoring/assessments/seo/KeyphraseLengthAssessment";
import KeywordDensityAssessment from "../../src/scoring/assessments/seo/KeywordDensityAssessment";
import MetaDescriptionKeywordAssessment from "../../src/scoring/assessments/seo/MetaDescriptionKeywordAssessment";
import MetaDescriptionLengthAssessment from "../../src/scoring/assessments/seo/MetaDescriptionLengthAssessment";
import SubheadingsKeywordAssessment from "../../src/scoring/assessments/seo/SubHeadingsKeywordAssessment";
import TextCompetingLinksAssessment from "../../src/scoring/assessments/seo/TextCompetingLinksAssessment";
import TextLengthAssessment from "../../src/scoring/assessments/seo/TextLengthAssessment";
import OutboundLinksAssessment from "../../src/scoring/assessments/seo/OutboundLinksAssessment";
import InternalLinksAssessment from "../../src/scoring/assessments/seo/InternalLinksAssessment";
import TitleKeywordAssessment from "../../src/scoring/assessments/seo/TitleKeywordAssessment";
import TitleWidthAssessment from "../../src/scoring/assessments/seo/PageTitleWidthAssessment";
import SlugKeywordAssessment from "../../src/scoring/assessments/seo/SlugKeywordAssessment";
import KeyphraseDistributionAssessment from "../../src/scoring/assessments/seo/KeyphraseDistributionAssessment";
import ImageKeyphraseAssessment from "../../src/scoring/assessments/seo/KeyphraseInImageTextAssessment";
import ImageCountAssessment from "../../src/scoring/assessments/seo/ImageCountAssessment";
// Import content assessments
import fleschReadingAssessment from "../../src/scoring/assessments/readability/fleschReadingEaseAssessment";
import SubheadingDistributionTooLongAssessment from "../../src/scoring/assessments/readability/SubheadingDistributionTooLongAssessment";
import ParagraphTooLongAssessment from "../../src/scoring/assessments/readability/ParagraphTooLongAssessment";
import SentenceLengthInTextAssessment from "../../src/scoring/assessments/readability/SentenceLengthInTextAssessment";
import TransitionWordsAssessment from "../../src/scoring/assessments/readability/TransitionWordsAssessment";
import PassiveVoiceAssessment from "../../src/scoring/assessments/readability/PassiveVoiceAssessment";
import TextPresenceAssessment from "../../src/scoring/assessments/readability/TextPresenceAssessment";
import SentenceBeginningsAssessment from "../../src/scoring/assessments/readability/SentenceBeginningsAssessment";
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

		/**
		 * Compares an assessment with an expected result.
		 *
		 * @param {Assessment} assessment The assessment.
		 * @param {object} expectedResult The expected result for the given assessment.
		 *
		 * @returns {void}
		 */
		function compare( assessment, expectedResult ) {
			const isApplicable = assessment.isApplicable( paper, researcher );
			expect( isApplicable ).toBe( expectedResult.isApplicable );

			if ( isApplicable ) {
				const result = assessment.getResult( paper, researcher );
				expect( result.getScore() ).toBe( expectedResult.score );
				expect( result.getText() ).toBe( expectedResult.resultText );
			}
		}

		// SEO assessments.
		it( "returns a score and the associated feedback text for the introductionKeyword assessment", function() {
			compare( new IntroductionKeywordAssessment(), expectedResults.introductionKeyword );
		} );

		it( "returns a score and the associated feedback text for the keyphraseLength assessment", function() {
			compare( new KeyphraseLengthAssessment(), expectedResults.keyphraseLength );
		} );

		it( "returns a score and the associated feedback text for the keywordDensity assessment", function() {
			compare( new KeywordDensityAssessment(), expectedResults.keywordDensity );
		} );

		it( "returns a score and the associated feedback text for the metaDescriptionKeyword assessment", function() {
			compare( new MetaDescriptionKeywordAssessment(), expectedResults.metaDescriptionKeyword );
		} );

		it( "returns a score and the associated feedback text for the metaDescriptionLength assessment", function() {
			compare( new MetaDescriptionLengthAssessment(), expectedResults.metaDescriptionLength );
		} );

		it( "returns a score and the associated feedback text for the subheadingsKeyword assessment", function() {
			compare( new SubheadingsKeywordAssessment(), expectedResults.subheadingsKeyword );
		} );

		it( "returns a score and the associated feedback text for the textCompetingLinks assessment", function() {
			compare( new TextCompetingLinksAssessment(), expectedResults.textCompetingLinks );
		} );

		it( "returns a score and the associated feedback text for the textLength assessment", function() {
			compare( new TextLengthAssessment(), expectedResults.textLength );
		} );

		it( "returns a score and the associated feedback text for the externalLinks assessment", function() {
			compare( new OutboundLinksAssessment(), expectedResults.externalLinks );
		} );

		it( "returns a score and the associated feedback text for the internalLinks assessment", function() {
			compare( new InternalLinksAssessment(), expectedResults.internalLinks );
		} );

		it( "returns a score and the associated feedback text for the titleKeyword assessment", function() {
			compare( new TitleKeywordAssessment(), expectedResults.titleKeyword );
		} );

		it( "returns a score and the associated feedback text for the titleWidth assessment", function() {
			compare( new TitleWidthAssessment(), expectedResults.titleWidth );
		} );

		it( "returns a score and the associated feedback text for the slugKeyword assessment", function() {
			compare( new SlugKeywordAssessment(), expectedResults.slugKeyword );
		} );

		it( "returns a score and the associated feedback text for the keyphraseDistribution assessment", function() {
			compare( new KeyphraseDistributionAssessment(), expectedResults.keyphraseDistribution );
		} );

		// Readability assessments.
		it( "returns a score and the associated feedback text for the fleschReadingEase assessment", function() {
			// The class fleschReadingEaseAssessment does not inherit from Assessment (!), so we can not use the compare() function here.
			const isApplicable = fleschReadingAssessment.isApplicable( paper, researcher );
			expect( isApplicable ).toBe( expectedResults.fleschReadingEase.isApplicable );

			if ( isApplicable ) {
				const result = fleschReadingAssessment.getResult( paper, researcher );
				expect( result.getScore() ).toBe( expectedResults.fleschReadingEase.score );
				expect( result.getText() ).toBe( expectedResults.fleschReadingEase.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the subheadingsTooLong assessment", function() {
			compare( new SubheadingDistributionTooLongAssessment(), expectedResults.subheadingsTooLong );
		} );

		it( "returns a score and the associated feedback text for the textParagraphTooLong assessment", function() {
			compare( new ParagraphTooLongAssessment(), expectedResults.textParagraphTooLong );
		} );

		it( "returns a score and the associated feedback text for the textSentenceLength assessment", function() {
			compare( new SentenceLengthInTextAssessment(), expectedResults.textSentenceLength );
		} );

		it( "returns a score and the associated feedback text for the textTransitionWords assessment", function() {
			compare( new TransitionWordsAssessment(), expectedResults.textTransitionWords );
		} );

		it( "returns a score and the associated feedback text for the passiveVoice assessment", function() {
			compare( new PassiveVoiceAssessment(), expectedResults.passiveVoice );
		} );

		it( "returns a score and the associated feedback text for the textPresence assessment", function() {
			compare( new TextPresenceAssessment(), expectedResults.textPresence );
		} );

		it( "returns a score and the associated feedback text for the sentenceBeginnings assessment", function() {
			compare( new SentenceBeginningsAssessment(), expectedResults.sentenceBeginnings );
		} );

		it( "returns a score and the associated feedback text for the imageKeyphrase assessment", function() {
			compare( new ImageKeyphraseAssessment(), expectedResults.imageKeyphrase );
		} );

		it( "returns a score and the associated feedback text for the imageCount assessment", function() {
			compare( new ImageCountAssessment(), expectedResults.imageCount );
		} );
	} );
} );
