import { languageProcessing } from "yoastseo";
const { AbstractResearcher } = languageProcessing;

// All config
import firstWordExceptions from "./config/firstWordExceptions";
import transitionWords from "./config/transitionWords";
import twoPartTransitionWords from "./config/twoPartTransitionWords";
import functionWords from "./config/functionWords";

// All helpers
import getStemmer from "./helpers/getStemmer";
import getClauses from "./helpers/getClauses";
import isPassiveSentence from "./helpers/isPassiveSentence";

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

		// Deletes researches that are not available for languages that we haven't supported yet.
		delete this.defaultResearches.getFleschReadingScore;
		delete this.defaultResearches.wordComplexity;

		Object.assign( this.config, {
			language: "el",
			functionWords,
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
