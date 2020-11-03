import AbstractResearcher from "../../AbstractResearcher";

// All config
import firstWordExceptions from "./config/firstWordExceptions";
import functionWords from "./config/functionWords";
import stopWords from "./config/stopWords";
import transitionWords from "./config/transitionWords";
import twoPartTransitionWords from "./config/twoPartTransitionWords";

// All helpers
import getParticiples from "./helpers/getParticiples";
import getSentenceParts from "./helpers/getSentenceParts";
import getStemmer from "./helpers/getStemmer";
import isPassiveSentencePart from "./helpers/isPassiveSentencePart";

// All researches
import calculateFleschReading from "./researches/calculateFleschReading";

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

		Object.assign( this.defaultResearches, {
			calculateFleschReading,
		} );

		Object.assign( this.config, {
			language: "en",
			isPeriphrastic: true,
			firstWordExceptions,
			functionWords,
			stopWords,
			transitionWords,
			twoPartTransitionWords,
		} );

		Object.assign( this.helpers, {
			getParticiples,
			getSentenceParts,
			getStemmer,
			isPassiveSentencePart,
		} );
	}
}
