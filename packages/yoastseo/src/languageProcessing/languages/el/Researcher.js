import { languageProcessing } from "yoastseo";
const { AbstractResearcher } = languageProcessing;

// All config
import firstWordExceptions from "./config/firstWordExceptions.js";
import redundantPhraseInAltText from "./config/redundantPhraseInAltText.js";
import transitionWords from "./config/transitionWords.js";
import twoPartTransitionWords from "./config/twoPartTransitionWords.js";
import functionWords from "./config/functionWords.js";

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

		// Deletes researches that are not available for languages that we haven't supported yet.
		delete this.defaultResearches.getFleschReadingScore;

		Object.assign( this.config, {
			language: "el",
			functionWords,
			redundantPhraseInAltText,
			passiveConstructionType: "morphologicalAndPeriphrastic",
			transitionWords,
			twoPartTransitionWords,
			firstWordExceptions: firstWordExceptions.firstWords,
			secondWordExceptions: firstWordExceptions.secondWords,
		} );

		Object.assign( this.helpers, {
			getStemmer,
			getClauses,
			isPassiveSentence,
		} );
	}
}
