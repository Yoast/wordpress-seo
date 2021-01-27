import AbstractResearcher from "../../AbstractResearcher";

// All config
import firstWordExceptions from "./config/firstWordExceptions";
import { all as functionWords } from "./config/functionWords";
import transitionWords from "./config/transitionWords";
import twoPartTransitionWords from "./config/twoPartTransitionWords";

// All helpers
import createBasicWordForms from "./helpers/createBasicWordForms";
import getStemmer from "./helpers/getStemmer";
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

		delete this.defaultResearches.getFleschReadingScore;
		delete this.defaultResearches.stopWordsInUrl;
		delete this.defaultResearches.stopWordsInKeyword;

		Object.assign( this.config, {
			language: "ar",
			isPeriphrastic: false,
			firstWordExceptions,
			functionWords,
			transitionWords,
			twoPartTransitionWords,
		} );

		Object.assign( this.helpers, {
			createBasicWordForms,
			getStemmer,
			isPassiveSentence,
		} );
	}
}
