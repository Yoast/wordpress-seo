import { languageProcessing, assessments, helpers } from "yoastseo";

const { getLanguagesWithWordComplexity, getWordComplexityConfig, getWordComplexityHelper } = helpers;
// Assessments.
const WordComplexityAssessment = assessments.readability.WordComplexityAssessment;
const KeyphraseDistributionAssessment = assessments.seo.KeyphraseDistributionAssessment;
// Researches.
const wordComplexity = languageProcessing.researches.wordComplexity;
const keyPhraseDistribution = languageProcessing.researches.keyphraseDistribution;

const pluginName = "YoastSEOPremium";

export default function( worker, language ) {
	if ( getLanguagesWithWordComplexity().includes( language ) ) {
		// Get the word complexity config for the specific language.
		const wordComplexityConfig = getWordComplexityConfig( language );
		// Get the word complexity helper for the specific language.
		const wordComplexityHelper = getWordComplexityHelper( language );
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
