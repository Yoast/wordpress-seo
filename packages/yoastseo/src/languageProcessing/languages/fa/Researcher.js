import { languageProcessing } from "yoastseo";
const { AbstractResearcher } = languageProcessing;

// All config
import functionWords from "./config/functionWords.js";
import redundantPhraseInAltText from "./config/redundantPhraseInAltText.js";
import transitionWords from "./config/transitionWords.js";
import twoPartTransitionWords from "./config/twoPartTransitionWords.js";
import sentenceLength from "./config/sentenceLength.js";
import firstWordExceptions from "./config/firstWordExceptions.js";

// All helpers
import createBasicWordForms from "./helpers/createBasicWordForms.js";
import getStemmer from "./helpers/getStemmer.js";
import isPassiveSentence from "./helpers/isPassiveSentence.js";


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
			redundantPhraseInAltText,
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
