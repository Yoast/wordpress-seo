import { getLanguagesWithWordComplexity } from "yoastseo/src/helpers/getLanguagesWithWordComplexity";

// Configs for the supported languages.
import wordComplexityConfigEnglish from "yoastseo/src/languageProcessing/languages/en/config/wordComplexity";
import wordComplexityConfigGerman from "yoastseo/src/languageProcessing/languages/de/config/wordComplexity";
import wordComplexityConfigSpanish from "yoastseo/src/languageProcessing/languages/es/config/wordComplexity";
import wordComplexityConfigFrench from "yoastseo/src/languageProcessing/languages/fr/config/wordComplexity";

// Helpers for the supported languages.
import wordComplexityHelperEnglish from "yoastseo/src/languageProcessing/languages/en/helpers/checkIfWordIsComplex";
import wordComplexityHelperGerman from "yoastseo/src/languageProcessing/languages/de/helpers/checkIfWordIsComplex";
import wordComplexityHelperSpanish from "yoastseo/src/languageProcessing/languages/es/helpers/checkIfWordIsComplex";
import wordComplexityHelperFrench from "yoastseo/src/languageProcessing/languages/fr/helpers/checkIfWordIsComplex";
// Research.
import wordComplexity from "yoastseo/src/languageProcessing/researches/wordComplexity";
import keyPhraseDistribution from "yoastseo/src/languageProcessing/researches/keyphraseDistribution";

// Assessment.
import WordComplexityAssessment from "yoastseo/src/scoring/assessments/readability/WordComplexityAssessment";
import KeyphraseDistributionAssessment from "yoastseo/src/scoring/assessments/seo/KeyphraseDistributionAssessment";

const helpers = {
	de: wordComplexityHelperGerman,
	en: wordComplexityHelperEnglish,
	es: wordComplexityHelperSpanish,
	fr: wordComplexityHelperFrench,
};

const configs = {
	de: wordComplexityConfigGerman,
	en: wordComplexityConfigEnglish,
	es: wordComplexityConfigSpanish,
	fr: wordComplexityConfigFrench,
};

const pluginName = "YoastSEOPremium";

export default function( worker, language ) {
	if ( getLanguagesWithWordComplexity().includes( language ) ) {
		// Get the word complexity config for the specific language.
		const wordComplexityConfig = configs[ language ];
		// Get the word complexity helper for the specific language.
		const wordComplexityHelper = helpers[ language ];
		// Initialize the assessment for regular content.
		const wordComplexityAssessment = new WordComplexityAssessment();
		// Initialize the assessment for cornerstone content.
		const wordComplexityAssessmentCornerstone = new WordComplexityAssessment( {
			scores: {
				acceptableAmount: 3,
			},
		} );

		// Register the word complexity config.
		worker.registerResearcherConfig( "wordComplexity", wordComplexityConfig );

		// Register the word complexity helper.
		worker.registerHelper( "checkIfWordIsComplex", wordComplexityHelper );

		// Register the word complexity research.
		worker.registerResearch( "wordComplexity", wordComplexity );

		// Register the word complexity assessment for regular content.
		worker.registerAssessment( "wordComplexity", wordComplexityAssessment, pluginName, "readability" );

		// Register the word complexity assessment for cornerstone content.
		worker.registerAssessment( "wordComplexity", wordComplexityAssessmentCornerstone, pluginName, "cornerstoneReadability" );
	}
	const keyphraseDistributionAssessment = new KeyphraseDistributionAssessment();
	worker.registerResearch( "keyphraseDistribution", keyPhraseDistribution );
	worker.registerAssessment( "keyphraseDistributionAssessment", keyphraseDistributionAssessment, pluginName, "seo" );
}
