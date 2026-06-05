const { helpers, languageProcessing } = require( "yoastseo" );
const getLanguageResearcher = require( "yoastseo/researcher" );

// Premium researches and helpers
const keyphraseDistribution = languageProcessing.researches.keyphraseDistribution;
const wordComplexity = languageProcessing.researches.wordComplexity;
const getLongCenterAlignedTexts = languageProcessing.researches.getLongCenterAlignedTexts;
const getLanguagesWithWordComplexity = helpers.getLanguagesWithWordComplexity;

const MORPHOLOGY_VERSIONS = {
	en: "v6",
	de: "v11",
	es: "v10",
	fr: "v11",
	it: "v10",
	nl: "v9",
	ru: "v10",
	id: "v9",
	pt: "v9",
	pl: "v9",
	ar: "v9",
	sv: "v1",
	he: "v1",
	hu: "v2",
	nb: "v1",
	tr: "v1",
	cs: "v1",
	sk: "v1",
	ja: "v1",
};

/**
 * Retrieves a Researcher instance for a specific language.
 *
 * @param {string} language The language to get the Researcher for.
 * @returns {Researcher} The Researcher instance.
 */
const getResearcher = ( language ) => {
	// Resolve the language-specific Researcher class through the public entry instead of
	// deep-requiring `yoastseo/build/...`.
	const Researcher = getLanguageResearcher( language );
	const researcher = new Researcher();

	// Add Yoast SEO Premium researches/helpers/configs (optional)
	researcher.addResearch( "keyphraseDistribution", keyphraseDistribution );
	if ( getLanguagesWithWordComplexity().includes( language ) ) {
		researcher.addResearch( "wordComplexity", wordComplexity );
		researcher.addHelper( "checkIfWordIsComplex", helpers.getWordComplexityHelper( language ) );
		researcher.addConfig( "wordComplexity", helpers.getWordComplexityConfig( language ) );
	}
	researcher.addResearch( "getLongCenterAlignedTexts", getLongCenterAlignedTexts );

	// Retrieve the morphology data (optional)
	const dataVersion = MORPHOLOGY_VERSIONS[ language ];
	if ( dataVersion ) {
		// eslint-disable-next-line global-require
		const premiumData = require( `yoastseo/premium-configuration/data/morphologyData-${language}-${dataVersion}.json` );
		researcher.addResearchData( "morphology", premiumData );
	}

	return researcher;
};

module.exports = { getResearcher };
