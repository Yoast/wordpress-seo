import getMorphologyData from "yoastspec/specHelpers/getMorphologyData";
import getResearcher from "yoastspec/specHelpers/getResearcher";
import getLanguage from "yoastseo/src/languageProcessing/helpers/language/getLanguage";
import { build } from "yoastseo/src/parse/build";
import LanguageProcessor from "yoastseo/src/parse/language/LanguageProcessor";

/**
 * Prepares a researcher for running on a paper.
 *
 * Trying to mimic AnalysisWebWorker.runResearch without the worker (and not running the research yet).
 *
 * @param {Paper} paper The paper to run the research on. Warning: this paper will be modified!
 * @param {Object} [useMorphology] Whether to prepare the researcher with morphology data.
 *
 * @returns {AbstractResearcher} A researcher, ready to research.
 */
export const prepareResearcher = ( paper, useMorphology = true ) => {
	const language = getLanguage( paper.getLocale() );
	// Get the correct researcher for the paper's language and create an instance.
	const researcher = new( getResearcher( language ) )( paper );

	if ( useMorphology ) {
		researcher.addResearchData( "morphology", getMorphologyData( language ) );
	}

	paper.setTree( build( paper, new LanguageProcessor( researcher ), paper._attributes && paper._attributes.shortcodes ) );
	// Is this needed after the paper got a tree? Let's just be safe instead of testing.
	researcher.setPaper( paper );

	return researcher;
};
