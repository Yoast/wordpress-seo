import { languageProcessing } from "yoastseo";
const { AbstractResearcher } = languageProcessing;

// All config
import firstWordExceptions from "./config/firstWordExceptions.js";
import { all as functionWords } from "./config/functionWords.js";
import redundantPhraseInAltText from "./config/redundantPhraseInAltText.js";
import stopWords from "./config/stopWords.js";
import transitionWords from "./config/transitionWords.js";
import twoPartTransitionWords from "./config/twoPartTransitionWords.js";
import sentenceLength from "./config/sentenceLength.js";

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

		// Delete a research(es) that is not available in Polish
		delete this.defaultResearches.getFleschReadingScore;

		Object.assign( this.config, {
			language: "pl",
			passiveConstructionType: "periphrastic",
			firstWordExceptions,
			functionWords,
			redundantPhraseInAltText,
			stopWords,
			transitionWords,
			twoPartTransitionWords,
			sentenceLength: sentenceLength,
		} );

		Object.assign( this.helpers, {
			getClauses,
			getStemmer,
		} );
	}
}
