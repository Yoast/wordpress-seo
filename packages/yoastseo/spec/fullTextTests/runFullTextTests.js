import getLanguage from "../../src/languageProcessing/helpers/language/getLanguage";
import getResearcher from "../specHelpers/getResearcher";
import getMorphologyData from "../specHelpers/getMorphologyData";
import getWordComplexityConfig from "../../src/helpers/getWordComplexityConfig";
import getWordComplexityHelper from "../../src/helpers/getWordComplexityHelper";
import buildTree from "../specHelpers/parse/buildTree";

// Import SEO assessments
import IntroductionKeywordAssessment from "../../src/scoring/assessments/seo/IntroductionKeywordAssessment";
import KeyphraseLengthAssessment from "../../src/scoring/assessments/seo/KeyphraseLengthAssessment";
import KeyphraseDensityAssessment from "../../src/scoring/assessments/seo/KeywordDensityAssessment";
import MetaDescriptionKeywordAssessment from "../../src/scoring/assessments/seo/MetaDescriptionKeywordAssessment";
import MetaDescriptionLengthAssessment from "../../src/scoring/assessments/seo/MetaDescriptionLengthAssessment";
import SubheadingsKeywordAssessment from "../../src/scoring/assessments/seo/SubHeadingsKeywordAssessment";
import TextCompetingLinksAssessment from "../../src/scoring/assessments/seo/TextCompetingLinksAssessment";
import TextLengthAssessment from "../../src/scoring/assessments/seo/TextLengthAssessment";
import OutboundLinksAssessment from "../../src/scoring/assessments/seo/OutboundLinksAssessment";
import InternalLinksAssessment from "../../src/scoring/assessments/seo/InternalLinksAssessment";
import KeyphraseInSEOTitleAssessment from "../../src/scoring/assessments/seo/KeyphraseInSEOTitleAssessment";
import TitleWidthAssessment from "../../src/scoring/assessments/seo/PageTitleWidthAssessment";
import SlugKeywordAssessment from "../../src/scoring/assessments/seo/UrlKeywordAssessment";
import KeyphraseDistributionAssessment from "../../src/scoring/assessments/seo/KeyphraseDistributionAssessment";
import ImageKeyphraseAssessment from "../../src/scoring/assessments/seo/KeyphraseInImageTextAssessment";
import ImageCountAssessment from "../../src/scoring/assessments/seo/ImageCountAssessment";
import TextTitleAssessment from "../../src/scoring/assessments/seo/TextTitleAssessment";

// Import readability/content assessments.
import SubheadingDistributionTooLongAssessment from "../../src/scoring/assessments/readability/SubheadingDistributionTooLongAssessment";
import ParagraphTooLongAssessment from "../../src/scoring/assessments/readability/ParagraphTooLongAssessment";
import SentenceLengthInTextAssessment from "../../src/scoring/assessments/readability/SentenceLengthInTextAssessment";
import TransitionWordsAssessment from "../../src/scoring/assessments/readability/TransitionWordsAssessment";
import PassiveVoiceAssessment from "../../src/scoring/assessments/readability/PassiveVoiceAssessment";
import TextPresenceAssessment from "../../src/scoring/assessments/readability/TextPresenceAssessment";
import SentenceBeginningsAssessment from "../../src/scoring/assessments/readability/SentenceBeginningsAssessment";
import WordComplexityAssessment from "../../src/scoring/assessments/readability/WordComplexityAssessment";
import TextAlignmentAssessment from "../../src/scoring/assessments/readability/TextAlignmentAssessment";

import getLongCenterAlignedTexts from "../../src/languageProcessing/researches/getLongCenterAlignedTexts";

import wordComplexity from "../../src/languageProcessing/researches/wordComplexity";
import keyphraseDistribution from "../../src/languageProcessing/researches/keyphraseDistribution";
import { getLanguagesWithWordComplexity } from "../../src/helpers";

// Import test papers.
import testPapers from "./testTexts";

testPapers.forEach( function( testPaper ) {
	describe( "Full-text test for paper " + testPaper.name, function() {
		const paper = testPaper.paper;
		const locale = paper.getLocale();
		const language = getLanguage( locale );

		const LanguageResearcher = getResearcher( language );
		const researcher = new LanguageResearcher( paper );
		researcher.addResearchData( "morphology", getMorphologyData( getLanguage( locale ) ) );
		researcher.addResearch( "keyphraseDistribution", keyphraseDistribution );
		// Also register the research, helper, and config for Word Complexity for testing purposes.
		if ( getLanguagesWithWordComplexity().includes( getLanguage( locale ) ) ) {
			researcher.addResearch( "wordComplexity", wordComplexity );
			researcher.addHelper( "checkIfWordIsComplex", getWordComplexityHelper( language ) );
			researcher.addConfig( "wordComplexity", getWordComplexityConfig( language ) );
		}
		researcher.addResearch( "getLongCenterAlignedTexts", getLongCenterAlignedTexts );

		buildTree( paper, researcher );

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
			compare( new KeyphraseDensityAssessment(), expectedResults.keywordDensity );
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

		it( "returns a score and the associated feedback text for the keyphraseInSEOTitle assessment", function() {
			compare( new KeyphraseInSEOTitleAssessment(), expectedResults.keyphraseInSEOTitle );
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
		it( "returns a score and the associated feedback text for the wordComplexity assessment", function() {
			compare( new WordComplexityAssessment(), expectedResults.wordComplexity );
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

		it( "returns a score and the associated feedback text for the textAlignment assessment", function() {
			compare( new TextAlignmentAssessment(), expectedResults.textAlignment );
		} );

		it( "returns a score and the associated feedback text for the textTitle assessment", function() {
			compare( new TextTitleAssessment(), expectedResults.textTitleAssessment );
		} );
	} );
} );
