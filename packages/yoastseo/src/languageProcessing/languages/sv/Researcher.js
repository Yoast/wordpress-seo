import AbstractResearcher from "../../AbstractResearcher";

// All config
import firstWordExceptions from "./config/firstWordExceptions";
import functionWords from "./config/functionWords";
import transitionWords from "./config/transitionWords";
import twoPartTransitionWords from "./config/twoPartTransitionWords";

// All helpers

import getStemmer from "../../helpers/morphology/baseStemmer";
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

		// Delete the researches that are not available in Swedish.
		delete this.defaultResearches.getFleschReadingScore;
		delete this.defaultResearches.stopWordsInKeyword;
		delete this.defaultResearches.stopWordsInUrl;

		Object.assign( this.config, {
			isPeriphrastic: false,
			firstWordExceptions,
			functionWords,
			transitionWords,
			twoPartTransitionWords,
		} );

		Object.assign( this.helpers, {
			getStemmer,
			isPassiveSentence,
		} );
	}
}
