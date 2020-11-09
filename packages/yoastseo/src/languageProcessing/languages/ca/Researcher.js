import AbstractResearcher from "../../AbstractResearcher";

// All config
import transitionWords from "./config/transitionWords";
import twoPartTransitionWords from "./config/twoPartTransitionWords";

// All helpers
import getStemmer from "../../helpers/morphology/baseStemmer";

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

		Object.assign( this.config, {
			language: "ca",
			functionWords: [],
			transitionWords,
			twoPartTransitionWords,
		} );

		Object.assign( this.config, {
			getStemmer
		} );
	}
}
