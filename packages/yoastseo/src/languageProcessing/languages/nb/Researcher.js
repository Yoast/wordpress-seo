import { languageProcessing } from "yoastseo";
const { AbstractResearcher } = languageProcessing;
import { enableFeatures, isFeatureEnabled } from "@yoast/feature-flag";
import firstWordExceptions from "../en/config/firstWordExceptions";
import getSentenceParts from "../hu/helpers/getSentenceParts";
import isPassiveSentence from "../hu/helpers/isPassiveSentence";
import isPassiveSentencePart from "../hu/helpers/isPassiveSentencePart";

// All config
import functionWords from "./config/functionWords";

// All helpers
import getStemmer from "./helpers/getStemmer";

// // The list of the feature flag names
// const featureNames = [ 'NORWEGIAN_READABILITY' ];

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

		// Enable the other Norwegian readability features
		enableFeatures( [ 'NORWEGIAN_READABILITY' ] );

		// Delete the transition words, passive voice and getSentenceBeginning researches if the Norwegian readability is not enabled
		if ( isFeatureEnabled( 'NORWEGIAN_READABILITY' ) ) {
			Object.assign( this.config, {
				passiveConstructionType,
				transitionWords,
				twoPartTransitionWords,
				firstWordExceptions,
			} );
			Object.assign( this.helpers, {
				getSentenceParts,
				isPassiveSentencePart,
				isPassiveSentence,
			} );
		} else {
			delete this.defaultResearches.findTransitionWords;
			delete this.defaultResearches.getPassiveVoice;
			delete this.defaultResearches.getSentenceBeginnings;
		}

		Object.assign( this.config, {
			language: "nb",
			functionWords,
		} );

		Object.assign( this.helpers, {
			getStemmer,
		} );
	}
}
