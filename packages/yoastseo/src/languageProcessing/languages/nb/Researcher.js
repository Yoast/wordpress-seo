import { languageProcessing } from "yoastseo";
const { AbstractResearcher } = languageProcessing;

// All config
import firstWordExceptions from "./config/firstWordExceptions";
import functionWords from "./config/functionWords";
import stopWords from "./config/stopWords";
import transitionWords from "./config/transitionWords";
import twoPartTransitionWords from "./config/twoPartTransitionWords";

// All helpers
import getStemmer from "./helpers/getStemmer";
import getClauses from "./helpers/getClauses";

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

		// Delete Flesch Reading Ease research since Norwegian doesn't have the support for it
		delete this.defaultResearches.getFleschReadingScore;
		delete this.defaultResearches.wordComplexity;

		Object.assign( this.config, {
			language: "nb",
			passiveConstructionType: "periphrastic",
			functionWords,
			firstWordExceptions,
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
