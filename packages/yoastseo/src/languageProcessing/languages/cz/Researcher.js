import AbstractResearcher from "../../AbstractResearcher";

// All helpers
import getSentenceParts from "./helpers/getSentenceParts";
import isPassiveSentencePart from "./helpers/isPassiveSentencePart";

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
			language: "cz",
			isPeriphrastic: true,
		} );

		Object.assign( this.helpers, {
			getSentenceParts,
			isPassiveSentencePart,
		} );
	}
}
