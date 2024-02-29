import { languageProcessing } from "yoastseo";
const { AbstractResearcher } = languageProcessing;

// All config
import functionWords from "./config/functionWords";
import transitionWords from "./config/transitionWords";
import twoPartTransitionWords from "./config/twoPartTransitionWords";
import firstWordExceptions from "./config/firstWordExceptions";
import stopWords from "./config/stopWords";

// All helpers
import getStemmer from "./helpers/getStemmer";
import getClauses from "./helpers/getClauses";
import isPassiveSentence from "./helpers/isPassiveSentence";

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
