import { languageProcessing } from "yoastseo";
const { AbstractResearcher } = languageProcessing;

// All config
import functionWords from "./config/functionWords.js";
import redundantPhraseInAltText from "./config/redundantPhraseInAltText.js";
import transitionWords from "./config/transitionWords.js";
import twoPartTransitionWords from "./config/twoPartTransitionWords.js";
import firstWordExceptions from "./config/firstWordExceptions.js";
import stopWords from "./config/stopWords.js";

// All helpers
import getStemmer from "./helpers/getStemmer.js";
import getClauses from "./helpers/getClauses.js";
import isPassiveSentence from "./helpers/isPassiveSentence.js";

/**
 * The researcher contains all the researches, helpers, data, and config.
 */
export default class Researcher extends AbstractResearcher {
	/**
	 * Constructor
	 * @param {Paper} paper The Paper object that is needed within the researches.
	 * @constructor
	 */
	constructor( paper ) {
		super( paper );

		// Deletes researches that are currently not available in Hungarian.
		// When the research is available, this line should be removed.
		delete this.defaultResearches.getFleschReadingScore;

		Object.assign( this.config, {
			language: "hu",
			passiveConstructionType: "morphologicalAndPeriphrastic",
			functionWords,
			redundantPhraseInAltText,
			transitionWords,
			twoPartTransitionWords,
			firstWordExceptions,
			stopWords,
		} );

		Object.assign( this.helpers, {
			getStemmer,
			getClauses,
			isPassiveSentence,
		} );
	}
}
