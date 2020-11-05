import AbstractResearcher from "../../AbstractResearcher";

// All config
import functionWords from "./config/functionWords";

// All helpers
import createBasicWordForms from "./helpers/createBasicWordForms";
import { baseStemmer as getStemmer } from "../../helpers/morphology/baseStemmer";


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
			language: "fa",
			functionWords,
		} );

		Object.assign( this.helpers, {
			createBasicWordForms,
			getStemmer,
		} );
	}
}
