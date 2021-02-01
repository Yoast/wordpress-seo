import AbstractResearcher from "../../AbstractResearcher";

// All config
import functionWords from "./config/functionWords";
import transitionWords from "./config/transitionWords";
import twoPartTransitionWords from "./config/twoPartTransitionWords";
import firstWordExceptions from "./config/firstWordExceptions";
import stopWords from "./config/stopWords";
import sentenceLength from "./config/sentenceLength";

// All helpers
import getStemmer from "./helpers/getStemmer";
import getSentenceParts from "./helpers/getSentenceParts";
import isPassiveSentencePart from "./helpers/isPassiveSentencePart";
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

		// Deletes researches that are currently not available in Hungarian.
		// When the research is available, this line should be removed.
		delete this.defaultResearches.getFleschReadingScore;

		Object.assign( this.config, {
			language: "hu",
			passiveConstructionType: "morphologicalAndPeriphrastic",
			functionWords,
			transitionWords,
			twoPartTransitionWords,
			firstWordExceptions,
			stopWords,
			sentenceLength,
		} );

		Object.assign( this.helpers, {
			getStemmer,
			getSentenceParts,
			isPassiveSentencePart,
			isPassiveSentence,
		} );
	}
}
