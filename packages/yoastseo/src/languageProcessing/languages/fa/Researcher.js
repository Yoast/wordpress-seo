import { languageProcessing } from "yoastseo";
const { AbstractResearcher } = languageProcessing;

// All config
import functionWords from "./config/functionWords";
import transitionWords from "./config/transitionWords";
import twoPartTransitionWords from "./config/twoPartTransitionWords";
import sentenceLength from "./config/sentenceLength";
import firstWordExceptions from "./config/firstWordExceptions";

// All helpers
import createBasicWordForms from "./helpers/createBasicWordForms";
import getStemmer from "./helpers/getStemmer";
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

		// Delete the researches from the Abstract Researcher that currently are not available for Farsi.
		delete this.defaultResearches.getFleschReadingScore;

		Object.assign( this.config, {
			passiveConstructionType: "morphological",
			language: "fa",
			functionWords,
			transitionWords,
			twoPartTransitionWords,
			sentenceLength,
			firstWordExceptions,
		} );

		Object.assign( this.helpers, {
			createBasicWordForms,
			getStemmer,
			isPassiveSentence,
		} );
	}
}
