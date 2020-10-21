import contentConfiguration from "../../src/config/content/combinedConfig";
import getLanguage from "../../src/helpers/getLanguage";
import factory from "../specHelpers/factory.js";
const i18n = factory.buildJed();
import Researcher from "../../src/researcher";
import getMorphologyData from "../specHelpers/getMorphologyData";


// Import SEO assessments
import IntroductionKeywordAssessment from "../../src/assessments/seo/IntroductionKeywordAssessment";
import KeyphraseLengthAssessment from "../../src/assessments/seo/KeyphraseLengthAssessment";
import KeywordDensityAssessment from  "../../src/assessments/seo/KeywordDensityAssessment";
import MetaDescriptionKeywordAssessment from "../../src/assessments/seo/MetaDescriptionKeywordAssessment";
import MetaDescriptionLengthAssessment from "../../src/assessments/seo/MetaDescriptionLengthAssessment";
import SubheadingsKeywordAssessment from "../../src/assessments/seo/SubHeadingsKeywordAssessment";
import TextCompetingLinksAssessment from "../../src/assessments/seo/TextCompetingLinksAssessment";
import TextImagesAssessment from "../../src/assessments/seo/TextImagesAssessment";
import TextLengthAssessment from "../../src/assessments/seo/TextLengthAssessment";
import OutboundLinksAssessment from "../../src/assessments/seo/OutboundLinksAssessment";
import InternalLinksAssessment from "../../src/assessments/seo/InternalLinksAssessment";
import TitleKeywordAssessment from "../../src/assessments/seo/TitleKeywordAssessment";
import TitleWidthAssessment from "../../src/assessments/seo/PageTitleWidthAssessment";
import UrlKeywordAssessment from "../../src/assessments/seo/UrlKeywordAssessment";
import KeyphraseDistributionAssessment from "../../src/assessments/seo/KeyphraseDistributionAssessment";

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
import { keyphraseDistributionResearcher } from "../../src/researches/keyphraseDistribution";
const keyphraseDistribution = keyphraseDistributionResearcher;
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
		researcher.addResearchData( "morphology", getMorphologyData( getLanguage( paper.getLocale() ) ) );

		const locale = paper.getLocale();
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
		const textImagesAssessment = new TextImagesAssessment();
		const textLengthAssessment = new TextLengthAssessment();
		const outboundLinksAssessment = new OutboundLinksAssessment();
		const internalLinksAssessment = new InternalLinksAssessment();
		const titleKeywordAssessment = new TitleKeywordAssessment();
		const titleWidthAssessment = new TitleWidthAssessment();
		const urlKeywordAssessment = new UrlKeywordAssessment();
		const keyphraseDistributionAssessment = new KeyphraseDistributionAssessment();
		const fleschReadingAssessment = new FleschReadingAssessment( contentConfiguration( locale ).fleschReading );
		const subheadingDistributionTooLongAssessment = new SubheadingDistributionTooLongAssessment();
		const sentenceLengthInTextAssessment = new SentenceLengthInTextAssessment( contentConfiguration( locale ).sentenceLength );

		// SEO assessments.
		it( "returns a score and the associated feedback text for the introductionKeyword assessment", function() {
			const isApplicable = introductionKeywordAssessment.isApplicable( paper );
			expect( isApplicable ).toBe( expectedResults.introductionKeyword.isApplicable );

			if ( isApplicable ) {
				result.introductionKeyword = introductionKeywordAssessment.getResult(
					paper,
					factory.buildMockResearcher( findKeywordInFirstParagraph( paper, researcher ) ),
					i18n
				);
				expect( result.introductionKeyword.getScore() ).toBe( expectedResults.introductionKeyword.score );
				expect( result.introductionKeyword.getText() ).toBe( expectedResults.introductionKeyword.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the keyphraseLength assessment", function() {
			const isApplicable = keyphraseLengthAssessment.isApplicable( paper );
			expect( isApplicable ).toBe( expectedResults.keyphraseLength.isApplicable );

			if ( isApplicable ) {
				result.keyphraseLength = keyphraseLengthAssessment.getResult(
					paper,
					factory.buildMockResearcher( keyphraseLength( paper, researcher ) ),
					i18n
				);
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
					factory.buildMockResearcher(
						{
							getKeywordDensity: getKeywordDensity( paper, researcher ),
							keywordCount: keywordCount( paper, researcher ),
						},
						true
					),
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
				result.metaDescriptionKeyword = metaDescriptionKeywordAssessment.getResult(
					paper,
					factory.buildMockResearcher( metaDescriptionKeyword( paper, researcher ) ),
					i18n
				);
				expect( result.metaDescriptionKeyword.getScore() ).toBe( expectedResults.metaDescriptionKeyword.score );
				expect( result.metaDescriptionKeyword.getText() ).toBe( expectedResults.metaDescriptionKeyword.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the metaDescriptionLength assessment", function() {
			const isApplicable = metaDescriptionLengthAssessment.isApplicable( paper );
			expect( isApplicable ).toBe( expectedResults.metaDescriptionLength.isApplicable );

			if ( isApplicable ) {
				result.metaDescriptionLength = metaDescriptionLengthAssessment.getResult(
					paper,
					factory.buildMockResearcher( metaDescriptionLength( paper ) ),
					i18n
				);
				expect( result.metaDescriptionLength.getScore() ).toBe( expectedResults.metaDescriptionLength.score );
				expect( result.metaDescriptionLength.getText() ).toBe( expectedResults.metaDescriptionLength.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the subheadingsKeyword assessment", function() {
			const isApplicable = subheadingsKeywordAssessment.isApplicable( paper );
			expect( isApplicable ).toBe( expectedResults.subheadingsKeyword.isApplicable );

			if ( isApplicable ) {
				result.subheadingsKeyword = subheadingsKeywordAssessment.getResult(
					paper,
					factory.buildMockResearcher( matchKeywordInSubheadings( paper, researcher ) ),
					i18n
				);
				expect( result.subheadingsKeyword.getScore() ).toBe( expectedResults.subheadingsKeyword.score );
				expect( result.subheadingsKeyword.getText() ).toBe( expectedResults.subheadingsKeyword.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the textCompetingLinks assessment", function() {
			const isApplicable = textCompetingLinksAssessment.isApplicable( paper );
			expect( isApplicable ).toBe( expectedResults.textCompetingLinks.isApplicable );

			if ( isApplicable ) {
				result.textCompetingLinks = textCompetingLinksAssessment.getResult(
					paper,
					factory.buildMockResearcher( getLinkStatistics( paper, researcher ) ),
					i18n
				);
				expect( result.textCompetingLinks.getScore() ).toBe( expectedResults.textCompetingLinks.score );
				expect( result.textCompetingLinks.getText() ).toBe( expectedResults.textCompetingLinks.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the textImages assessment", function() {
			const isApplicable = textImagesAssessment.isApplicable( paper );
			expect( isApplicable ).toBe( expectedResults.textImages.isApplicable );

			if ( isApplicable ) {
				result.textImages = textImagesAssessment.getResult(
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
			}
		} );

		it( "returns a score and the associated feedback text for the textLength assessment", function() {
			const isApplicable = textLengthAssessment.isApplicable( paper );
			expect( isApplicable ).toBe( expectedResults.textLength.isApplicable );

			if ( isApplicable ) {
				result.textLength = textLengthAssessment.getResult(
					paper,
					factory.buildMockResearcher( wordCountInText( paper ) ),
					i18n
				);
				expect( result.textLength.getScore() ).toBe( expectedResults.textLength.score );
				expect( result.textLength.getText() ).toBe( expectedResults.textLength.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the externalLinks assessment", function() {
			const isApplicable = outboundLinksAssessment.isApplicable( paper );
			expect( isApplicable ).toBe( expectedResults.externalLinks.isApplicable );

			if ( isApplicable ) {
				result.externalLinks = outboundLinksAssessment.getResult(
					paper,
					factory.buildMockResearcher( getLinkStatistics( paper, researcher ) ),
					i18n
				);
				expect( result.externalLinks.getScore() ).toBe( expectedResults.externalLinks.score );
				expect( result.externalLinks.getText() ).toBe( expectedResults.externalLinks.resultText );
			}
		} );

		// It( "returns a score and the associated feedback text for the internalLinks assessment", function() {
		// 	Const isApplicable = internalLinksAssessment.isApplicable( paper );
		// 	Expect( isApplicable ).toBe( expectedResults.internalLinks.isApplicable );
		//
		// 	If ( isApplicable ) {
		// 		Result.internalLinks = internalLinksAssessment.getResult(
		// 			Paper,
		// 			Factory.buildMockResearcher( getLinkStatistics( paper, researcher ) ),
		// 			I18n
		// 		);
		// 		Expect( result.internalLinks.getScore() ).toBe( expectedResults.internalLinks.score );
		// 		Expect( result.internalLinks.getText() ).toBe( expectedResults.internalLinks.resultText );
		// 	}
		// } );

		// It( "returns a score and the associated feedback text for the titleKeyword assessment", function() {
		// 	Const isApplicable = titleKeywordAssessment.isApplicable( paper );
		// 	Expect( isApplicable ).toBe( expectedResults.titleKeyword.isApplicable );
		//
		// 	If ( isApplicable ) {
		// 		Result.titleKeyword = titleKeywordAssessment.getResult(
		// 			Paper,
		// 			Factory.buildMockResearcher( findKeywordInPageTitle( paper, researcher ) ),
		// 			I18n
		// 		);
		// 		Expect( result.titleKeyword.getScore() ).toBe( expectedResults.titleKeyword.score );
		// 		Expect( result.titleKeyword.getText() ).toBe( expectedResults.titleKeyword.resultText );
		// 	}
		// } );

		it( "returns a score and the associated feedback text for the titleWidth assessment", function() {
			const isApplicable = titleWidthAssessment.isApplicable( paper );
			expect( isApplicable ).toBe( expectedResults.titleWidth.isApplicable );

			if ( isApplicable ) {
				result.titleWidth = titleWidthAssessment.getResult(
					paper,
					factory.buildMockResearcher( pageTitleWidth( paper ) ),
					i18n
				);
				expect( result.titleWidth.getScore() ).toBe( expectedResults.titleWidth.score );
				expect( result.titleWidth.getText() ).toBe( expectedResults.titleWidth.resultText );
			}
		} );

		// It( "returns a score and the associated feedback text for the urlKeyword assessment", function() {
		// 	Const isApplicable = urlKeywordAssessment.isApplicable( paper );
		// 	Expect( isApplicable ).toBe( expectedResults.urlKeyword.isApplicable );
		//
		// 	If ( isApplicable ) {
		// 		Result.urlKeyword = urlKeywordAssessment.getResult(
		// 			Paper,
		// 			Factory.buildMockResearcher( keywordCountInUrl( paper, researcher ) ),
		// 			I18n
		// 		);
		// 		Expect( result.urlKeyword.getScore() ).toBe( expectedResults.urlKeyword.score );
		// 		Expect( result.urlKeyword.getText() ).toBe( expectedResults.urlKeyword.resultText );
		// 	}
		// } );

		// It( "returns a score and the associated feedback text for the english keyphraseDistribution assessment", function() {
		// 	Const isApplicable = keyphraseDistributionAssessment.isApplicable( paper );
		// 	Expect( isApplicable ).toBe( expectedResults.keyphraseDistribution.isApplicable );
		//
		// 	If ( isApplicable ) {
		// 		Result.keyphraseDistribution = keyphraseDistributionAssessment.getResult(
		// 			Paper,
		// 			Factory.buildMockResearcher( keyphraseDistribution( paper, researcher ) ),
		// 			I18n
		// 		);
		// 		Expect( result.keyphraseDistribution.getScore() ).toBe( expectedResults.keyphraseDistribution.score );
		// 		Expect( result.keyphraseDistribution.getText() ).toBe( expectedResults.keyphraseDistribution.resultText );
		// 	}
		// } );

		// Readability assessments.
		// It( "returns a score and the associated feedback text for the fleschReadingEase assessment", function() {
		// 	Const isApplicable = fleschReadingAssessment.isApplicable( paper );
		// 	Expect( isApplicable ).toBe( expectedResults.fleschReadingEase.isApplicable );
		//
		// 	If ( isApplicable ) {
		// 		Result.fleschReadingEase = fleschReadingAssessment.getResult(
		// 			Paper,
		// 			Factory.buildMockResearcher( calculateFleschReading( paper ) ),
		// 			I18n
		// 		);
		// 		Expect( result.fleschReadingEase.getScore() ).toBe( expectedResults.fleschReadingEase.score );
		// 		Expect( result.fleschReadingEase.getText() ).toBe( expectedResults.fleschReadingEase.resultText );
		// 	}
		// } );

		it( "returns a score and the associated feedback text for the subheadingsTooLong assessment", function() {
			const isApplicable = subheadingDistributionTooLongAssessment.isApplicable( paper );
			expect( isApplicable ).toBe( expectedResults.subheadingsTooLong.isApplicable );

			if ( isApplicable ) {
				result.subheadingsTooLong = subheadingDistributionTooLongAssessment.getResult(
					paper,
					factory.buildMockResearcher( getSubheadingTextLengths( paper ) ),
					i18n
				);
				expect( result.subheadingsTooLong.getScore() ).toBe( expectedResults.subheadingsTooLong.score );
				expect( result.subheadingsTooLong.getText() ).toBe( expectedResults.subheadingsTooLong.resultText );
			}
		} );

		it( "returns a score and the associated feedback text for the textParagraphTooLong assessment", function() {
			const isApplicable = paragraphTooLongAssessment.isApplicable( paper );
			expect( isApplicable ).toBe( expectedResults.textParagraphTooLong.isApplicable );

			if ( isApplicable ) {
				result.textParagraphTooLong = paragraphTooLongAssessment.getResult(
					paper,
					factory.buildMockResearcher( getParagraphLength( paper ) ),
					i18n
				);
				expect( result.textParagraphTooLong.getScore() ).toBe( expectedResults.textParagraphTooLong.score );
				expect( result.textParagraphTooLong.getText() ).toBe( expectedResults.textParagraphTooLong.resultText );
			}
		} );

		// it( "returns a score and the associated feedback text for the textSentenceLength assessment", function() {
		// 	const isApplicable = sentenceLengthInTextAssessment.isApplicable( paper );
		// 	expect( isApplicable ).toBe( expectedResults.textSentenceLength.isApplicable );
		//
		// 	if ( isApplicable ) {
		// 		result.textSentenceLength = sentenceLengthInTextAssessment.getResult(
		// 			paper,
		// 			factory.buildMockResearcher( countSentencesFromText( paper ) ),
		// 			i18n
		// 		);
		// 		expect( result.textSentenceLength.getScore() ).toBe( expectedResults.textSentenceLength.score );
		// 		expect( result.textSentenceLength.getText() ).toBe( expectedResults.textSentenceLength.resultText );
		// 	}
		// } );

		it( "returns a score and the associated feedback text for the textTransitionWords assessment", function() {
			const isApplicable = transitionWordsAssessment.isApplicable( paper );
			expect( isApplicable ).toBe( expectedResults.textTransitionWords.isApplicable );

			if ( isApplicable ) {
				result.textTransitionWords = transitionWordsAssessment.getResult(
					paper,
					factory.buildMockResearcher( findTransitionWords( paper ) ),
					i18n
				);
				expect( result.textTransitionWords.getScore() ).toBe( expectedResults.textTransitionWords.score );
				expect( result.textTransitionWords.getText() ).toBe( expectedResults.textTransitionWords.resultText );
			}
		} );

		// it( "returns a score and the associated feedback text for the passiveVoice assessment", function() {
		// 	const isApplicable = passiveVoiceAssessment.isApplicable( paper );
		// 	expect( isApplicable ).toBe( expectedResults.passiveVoice.isApplicable );
		//
		// 	if ( isApplicable ) {
		// 		result.passiveVoice = passiveVoiceAssessment.getResult(
		// 			paper,
		// 			factory.buildMockResearcher( passiveVoice( paper ) ),
		// 			i18n
		// 		);
		// 		expect( result.passiveVoice.getScore() ).toBe( expectedResults.passiveVoice.score );
		// 		expect( result.passiveVoice.getText() ).toBe( expectedResults.passiveVoice.resultText );
		// 	}
		// } );

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
			const isApplicable = sentenceBeginningsAssessment.isApplicable( paper );
			expect( isApplicable ).toBe( expectedResults.sentenceBeginnings.isApplicable );

			if ( isApplicable ) {
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
			}
		} );
	} );
} );
