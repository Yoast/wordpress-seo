import { languageProcessing } from "yoastseo";
const { AbstractResearcher } = languageProcessing;

// All config
import stopWords from "./config/stopWords.js";
import functionWords from "./config/functionWords.js";
import redundantPhraseInAltText from "./config/redundantPhraseInAltText.js";
import { allWords as transitionWords } from "./config/transitionWords.js";
import twoPartTransitionWords from "./config/twoPartTransitionWords.js";
import firstWordExceptions from "./config/firstWordExceptions.js";

// All helpers
import getClauses from "./helpers/getClauses.js";
import getStemmer from "./helpers/getStemmer.js";

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

		// Deletes researches that are currently not available in Slovak.
		// When the research is available, this line should be removed.
		delete this.defaultResearches.getFleschReadingScore;

		Object.assign( this.config, {
			language: "sk",
			passiveConstructionType: "periphrastic",
			stopWords,
			functionWords,
			redundantPhraseInAltText,
			transitionWords,
			twoPartTransitionWords,
			firstWordExceptions,
		} );

		Object.assign( this.helpers, {
			getClauses,
			getStemmer,
		} );
	}
}
