import { sprintf } from "@wordpress/i18n";
import Assessment from "../assessment";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import AssessmentResult from "../../../values/AssessmentResult";
import { getWords } from "../../../languageProcessing";
import Mark from "../../../values/Mark";
import addMark from "../../../markers/addMark";
import getSentences from "../../../languageProcessing/helpers/sentence/getSentences";

/**
 * Checks whether the given list of words contains another list of words in the given order.
 *
 * @param {string[]} words The list of words.
 * @param {string[]} consecutiveWords The list of words to find.
 *
 * @returns {boolean} Whether the given list of words contains another list of words in the given order.
 */
function includesConsecutiveWords( words, consecutiveWords ) {
	return words.some( ( _, i, allWords ) => {
		return consecutiveWords.every( ( word, j ) => allWords[ i + j ] === word );
	} );
}

/**
 * An inclusive language assessment.
 *
 * Based on the configuration given to it in the constructor, it assesses
 * whether a paper's text contains potentially non-inclusive phrases and
 * suggests a potentially more inclusive alternative.
 */
export default class InclusiveLanguageAssessment extends Assessment {
	/**
	 * Creates a new inclusive language assessment.
	 *
	 * @param {object} config The assessment configuration.
	 *
	 * @param {string} config.identifier The identifier of this assessment.
	 * @param {string[]} config.nonInclusivePhrases The non-inclusive phrase.
	 * @param {string} config.inclusiveAlternative The suggested alternative, more inclusive, phrase.
	 * @param {number} config.score The score to give if the non-inclusive phrase is recognized in the text.
	 * @param {string} config.feedbackFormat The feedback format string,
	 * 									should include a `%1$s` placeholder for the non-inclusive phrase
	 * 									and `%2$s` for the suggested alternative.
	 * @param {string} config.learnMoreUrl The URL to an article explaining more about this specific assessment.
	 *
	 * @returns {void}
	 */
	constructor( { identifier, nonInclusivePhrases, inclusiveAlternative, score, feedbackFormat, learnMoreUrl } ) {
		super();

		this.identifier = identifier;
		this.nonInclusivePhrases = nonInclusivePhrases;
		this.inclusiveAlternative = inclusiveAlternative;
		this.score = score;
		this.feedbackFormat = feedbackFormat;
		this.learnMoreUrl = learnMoreUrl;
	}

	/**
	 * Checks whether the assessment is applicable for the given paper.
	 *
	 * @param {Paper} paper The paper to check.
	 * @param {Researcher} researcher The researcher.
	 *
	 * @returns {boolean} Whether the assessment is applicable for the given paper.
	 */
	isApplicable( paper, researcher ) {
		const memoizedTokenizer = researcher.getHelper( "memoizedTokenizer" );
		const sentences = getSentences( paper.getText(), memoizedTokenizer );

		this.foundPhrases = [];

		sentences.forEach( sentence => {
			let words = getWords( sentence );
			words = words.map( word => word.toLocaleLowerCase() );
			const foundPhrase = this.nonInclusivePhrases.find( phrase => includesConsecutiveWords( words, phrase.split( " " ) ) );

			if ( foundPhrase ) {
				this.foundPhrases.push( {
					sentence: sentence,
					phrase: foundPhrase,
				} );
			}
		} );

		return this.foundPhrases.length >= 1;
	}

	/**
	 * Execute the Assessment and return a result.
	 *
	 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
	 */
	getResult() {
		const link = sprintf(
			"%1$sLearn more.%2$s",
			createAnchorOpeningTag( this.learnMoreUrl ),
			"</a>"
		);

		const text = sprintf(
			this.feedbackFormat,
			this.foundPhrases[ 0 ].phrase,
			this.inclusiveAlternative
		);

		const result = new AssessmentResult( {
			score: this.score,
			text: `${ text } ${ link }`,
		} );

		result.setIdentifier( this.identifier );
		result.setHasMarks( true );

		return result;
	}
	/**
	 * Marks text for the inclusive language assessment.
	 *
	 * @returns {Array<Mark>} A list of marks that should be applied.
	 */
	getMarks() {
		return this.foundPhrases.map( foundPhrase =>
			new Mark( {
				original: foundPhrase.sentence,
				marked: addMark( foundPhrase.sentence ),
			} ) );
	}
}
