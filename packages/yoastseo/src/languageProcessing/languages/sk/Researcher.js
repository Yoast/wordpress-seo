import { languageProcessing } from "yoastseo";
const { AbstractResearcher } = languageProcessing;

// All config
import stopWords from "./config/stopWords";
import functionWords from "./config/functionWords";
import { allWords as transitionWords } from "./config/transitionWords";
import twoPartTransitionWords from "./config/twoPartTransitionWords";
import firstWordExceptions from "./config/firstWordExceptions";

// All helpers
import getClauses from "./helpers/getClauses";
import getStemmer from "./helpers/getStemmer";

/**
 * The researches contains all the researches
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
		delete this.defaultResearches.wordComplexity;

		Object.assign( this.config, {
			language: "sk",
			passiveConstructionType: "periphrastic",
			stopWords,
			functionWords,
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
