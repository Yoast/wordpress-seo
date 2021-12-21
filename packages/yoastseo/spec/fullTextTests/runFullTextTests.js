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
import UrlKeywordAssessment from "../../src/scoring/assessments/seo/UrlKeywordAssessment";
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
		const result = {};

		// Initialize all assessments
		const introductionKeywordAssessment = new IntroductionKeywordAssessment();
		const keyphraseLengthAssessment = new KeyphraseLengthAssessment();
		const keywordDensityAssessment = new KeywordDensityAssessment();
		const metaDescriptionKeywordAssessment = new MetaDescriptionKeywordAssessment();
		const metaDescriptionLengthAssessment = new MetaDescriptionLengthAssessment();
		const subheadingsKeywordAssessment = new SubheadingsKeywordAssessment();
		const textCompetingLinksAssessment = new TextCompetingLinksAssessment();
		const textLengthAssessment = new TextLengthAssessment();
		const outboundLinksAssessment = new OutboundLinksAssessment();
		const internalLinksAssessment = new InternalLinksAssessment();
		const titleKeywordAssessment = new TitleKeywordAssessment();
		const titleWidthAssessment = new TitleWidthAssessment();
		const urlKeywordAssessment = new UrlKeywordAssessment();
		const keyphraseDistributionAssessment = new KeyphraseDistributionAssessment();
		const subheadingDistributionTooLongAssessment = new SubheadingDistributionTooLongAssessment();
		const sentenceLengthInTextAssessment = new SentenceLengthInTextAssessment();
		const imageKeyphraseAssessment = new ImageKeyphraseAssessment();
		const imageCountAssessment = new ImageCountAssessment();
		const paragraphTooLongAssessment = new ParagraphTooLongAssessment();
		const transitionWordsAssessment = new TransitionWordsAssessment();
		const passiveVoiceAssessment = new PassiveVoiceAssessment();
		const textPresenceAssessment = new TextPresenceAssessment();
		const sentenceBeginningsAssessment = new SentenceBeginningsAssessment();

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
				result.keywordDensity = keywordDensityAssessment.getResult( paper, researcher );
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

		it( "returns a score and the associated feedback text for the subheadingsKeyword assessment", function() {
			const isApplicable = subheadingsKeywordAssessment.isApplicable( paper );
			expect( isApplicable ).toBe( expectedResults.subheadingsKeyword.isApplicable );

			if ( isApplicable ) {
				result.subheadingsKeyword = subheadingsKeywordAssessment.getResult( paper, researcher );
				expect( result.subheadingsKeyword.getScore() ).toBe( expectedResults.subheadingsKeyword.score );
				expect( result.subheadingsKeyword.getText() ).toBe( expectedResults.subheadingsKeyword.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the textCompetingLinks assessment", function() {
			const isApplicable = textCompetingLinksAssessment.isApplicable( paper );
			expect( isApplicable ).toBe( expectedResults.textCompetingLinks.isApplicable );

			if ( isApplicable ) {
				result.textCompetingLinks = textCompetingLinksAssessment.getResult( paper, researcher );
				expect( result.textCompetingLinks.getScore() ).toBe( expectedResults.textCompetingLinks.score );
				expect( result.textCompetingLinks.getText() ).toBe( expectedResults.textCompetingLinks.resultText );
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

		it( "returns a score and the associated feedback text for the externalLinks assessment", function() {
			const isApplicable = outboundLinksAssessment.isApplicable( paper );
			expect( isApplicable ).toBe( expectedResults.externalLinks.isApplicable );

			if ( isApplicable ) {
				result.externalLinks = outboundLinksAssessment.getResult( paper, researcher );
				expect( result.externalLinks.getScore() ).toBe( expectedResults.externalLinks.score );
				expect( result.externalLinks.getText() ).toBe( expectedResults.externalLinks.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the internalLinks assessment", function() {
			const isApplicable = internalLinksAssessment.isApplicable( paper );
			expect( isApplicable ).toBe( expectedResults.internalLinks.isApplicable );

			if ( isApplicable ) {
				result.internalLinks = internalLinksAssessment.getResult( paper, researcher );
				expect( result.internalLinks.getScore() ).toBe( expectedResults.internalLinks.score );
				expect( result.internalLinks.getText() ).toBe( expectedResults.internalLinks.resultText );
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

		it( "returns a score and the associated feedback text for the urlKeyword assessment", function() {
			const isApplicable = urlKeywordAssessment.isApplicable( paper, researcher );
			expect( isApplicable ).toBe( expectedResults.urlKeyword.isApplicable );

			if ( isApplicable ) {
				result.urlKeyword = urlKeywordAssessment.getResult( paper, researcher );
				expect( result.urlKeyword.getScore() ).toBe( expectedResults.urlKeyword.score );
				expect( result.urlKeyword.getText() ).toBe( expectedResults.urlKeyword.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the keyphraseDistribution assessment", function() {
			const isApplicable = keyphraseDistributionAssessment.isApplicable( paper );
			expect( isApplicable ).toBe( expectedResults.keyphraseDistribution.isApplicable );

			if ( isApplicable ) {
				result.keyphraseDistribution = keyphraseDistributionAssessment.getResult( paper, researcher );
				expect( result.keyphraseDistribution.getScore() ).toBe( expectedResults.keyphraseDistribution.score );
				expect( result.keyphraseDistribution.getText() ).toBe( expectedResults.keyphraseDistribution.resultText );
			}
		} );

		// Readability assessments.
		it( "returns a score and the associated feedback text for the fleschReadingEase assessment", function() {
			const isApplicable = fleschReadingAssessment.isApplicable( paper, researcher );
			expect( isApplicable ).toBe( expectedResults.fleschReadingEase.isApplicable );

			if ( isApplicable ) {
				result.fleschReadingEase = fleschReadingAssessment.getResult( paper, researcher );
				expect( result.fleschReadingEase.getScore() ).toBe( expectedResults.fleschReadingEase.score );
				expect( result.fleschReadingEase.getText() ).toBe( expectedResults.fleschReadingEase.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the subheadingsTooLong assessment", function() {
			const isApplicable = subheadingDistributionTooLongAssessment.isApplicable( paper, researcher );
			expect( isApplicable ).toBe( expectedResults.subheadingsTooLong.isApplicable );

			if ( isApplicable ) {
				result.subheadingsTooLong = subheadingDistributionTooLongAssessment.getResult( paper, researcher );
				expect( result.subheadingsTooLong.getScore() ).toBe( expectedResults.subheadingsTooLong.score );
				expect( result.subheadingsTooLong.getText() ).toBe( expectedResults.subheadingsTooLong.resultText );
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

		it( "returns a score and the associated feedback text for the textSentenceLength assessment", function() {
			const isApplicable = sentenceLengthInTextAssessment.isApplicable( paper );
			expect( isApplicable ).toBe( expectedResults.textSentenceLength.isApplicable );

			if ( isApplicable ) {
				result.textSentenceLength = sentenceLengthInTextAssessment.getResult( paper, researcher );
				expect( result.textSentenceLength.getScore() ).toBe( expectedResults.textSentenceLength.score );
				expect( result.textSentenceLength.getText() ).toBe( expectedResults.textSentenceLength.resultText );
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
			const isApplicable = sentenceBeginningsAssessment.isApplicable( paper, researcher );
			expect( isApplicable ).toBe( expectedResults.sentenceBeginnings.isApplicable );

			if ( isApplicable ) {
				result.sentenceBeginnings = sentenceBeginningsAssessment.getResult( paper, researcher );
				expect( result.sentenceBeginnings.getScore() ).toBe( expectedResults.sentenceBeginnings.score );
				expect( result.sentenceBeginnings.getText() ).toBe( expectedResults.sentenceBeginnings.resultText );
			}
		} );
		it( "returns a score and the associated feedback text for the imageKeyphrase assessment", function() {
			const isApplicable = imageKeyphraseAssessment.isApplicable( paper, researcher );
			expect( isApplicable ).toBe( expectedResults.imageKeyphrase.isApplicable );

			if ( isApplicable ) {
				result.imageKeyphrase = imageKeyphraseAssessment.getResult( paper, researcher );
				expect( result.imageKeyphrase.getScore() ).toBe( expectedResults.imageKeyphrase.score );
				expect( result.imageKeyphrase.getText() ).toBe( expectedResults.imageKeyphrase.resultText );
			}
		} );
		it( "returns a score and the associated feedback text for the imageCount assessment", function() {
			const isApplicable = imageCountAssessment.isApplicable( paper );
			expect( isApplicable ).toBe( expectedResults.imageCount.isApplicable );

			if ( isApplicable ) {
				result.imageCount = imageCountAssessment.getResult( paper, researcher );
				expect( result.imageCount.getScore() ).toBe( expectedResults.imageCount.score );
				expect( result.imageCount.getText() ).toBe( expectedResults.imageCount.resultText );
			}
		} );
	} );
} );
