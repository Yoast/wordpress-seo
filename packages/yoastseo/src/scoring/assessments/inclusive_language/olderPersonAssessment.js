import Assessment from "../assessment";
import { getWords } from "../../../languageProcessing";
import { AssessmentResult } from "../../../values";
import { sprintf } from "@wordpress/i18n";

function includesConsecutiveWords( words, consecutiveWords ) {
	return words.some( ( _, i, allWords ) => {
		return consecutiveWords.every( ( word, j ) => allWords[ i + j ] === word );
	} );
}

class OlderPersonAssessment extends Assessment {
	constructor() {
		super();
	}

	getResult() {
		const text = sprintf(
			"Avoid using \"%1$s\" as it is potentially harmful. " +
			"Consider using \"%2$s\" instead. " +
			"Or, if possible, be specific about the group you " +
			"are referring to (e.g. \"people older than 70\").",
			"aging dependants",
			"older persons/older people"
		);

		const result = new AssessmentResult( {
			score: -6,
			text,
		} );

		result.setIdentifier( "olderPersonAssessment" );

		return result;
	}

	possiblyNonInclusive( paper ) {
		const words = getWords( paper.getText() );
		return includesConsecutiveWords( words, [ "aging", "dependants" ] );
	}

	isApplicable( paper ) {
		return this.possiblyNonInclusive( paper );
	}
}

export default OlderPersonAssessment;
