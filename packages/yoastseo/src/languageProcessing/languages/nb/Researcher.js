import { languageProcessing } from "yoastseo";
const { AbstractResearcher } = languageProcessing;

// All config
import firstWordExceptions from "./config/firstWordExceptions.js";
import functionWords from "./config/functionWords.js";
import redundantPhraseInAltText from "./config/redundantPhraseInAltText.js";
import stopWords from "./config/stopWords.js";
import transitionWords from "./config/transitionWords.js";
import twoPartTransitionWords from "./config/twoPartTransitionWords.js";

// All helpers
import getStemmer from "./helpers/getStemmer.js";
import getClauses from "./helpers/getClauses.js";

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

		// Delete Flesch Reading Ease research since Norwegian doesn't have the support for it
		delete this.defaultResearches.getFleschReadingScore;

		Object.assign( this.config, {
			language: "nb",
			passiveConstructionType: "periphrastic",
			functionWords,
			firstWordExceptions,
			redundantPhraseInAltText,
			transitionWords,
			twoPartTransitionWords,
			stopWords,
		} );

		Object.assign( this.helpers, {
			getStemmer,
			getClauses,
		} );
	}
}
