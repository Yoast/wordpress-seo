import { sprintf } from "@wordpress/i18n";
import { isString } from "lodash";

import AssessmentResult from "../../../values/AssessmentResult";
import Mark from "../../../values/Mark";
import addMark from "../../../markers/addMark";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import { getWords } from "../../../languageProcessing";

import { includesConsecutiveWords } from "./helpers/includesConsecutiveWords";

/**
 * An inclusive language assessment.
 *
 * Based on the configuration given to it in the constructor, it assesses
 * whether a paper's text contains potentially non-inclusive phrases and
 * suggests a potentially more inclusive alternative.
 */
export default class InclusiveLanguageAssessment {
	/**
	 * Creates a new inclusive language assessment.
	 *
	 * @param {object} config The assessment configuration.
	 *
	 * @param {string} config.identifier The identifier of this assessment.
	 * @param {string[]} config.nonInclusivePhrases The non-inclusive phrases.
	 * @param {string|array} config.inclusiveAlternatives The suggested alternative, more inclusive, phrase(s).
	 * @param {number} config.score The score to give if the non-inclusive phrase is recognized in the text.
	 * @param {string} config.feedbackFormat The feedback format string,
	 * 									should include a `%1$s` placeholder for the non-inclusive phrase
	 * 									and `%2$s` (and potentially further replacements) for the suggested alternative(s).
	 * @param {string} config.learnMoreUrl The URL to an article explaining more about this specific assessment.
	 * @param {function} [config.rule] A potential additional rule for targeting the non-inclusive phrases.
	 * @param {string} [config.ruleDescription] A description of the rule.
	 * @param {boolean} [config.caseSensitive=false] If the inclusive phrase is case-sensitive, defaults to `false`.
	 * @param {string} [config.category] The category of the assessment.
	 *
	 * @returns {void}
	 */
	constructor( { identifier, nonInclusivePhrases, inclusiveAlternatives,
		score, feedbackFormat, learnMoreUrl, rule, ruleDescription, caseSensitive, category } ) {
		this.identifier = identifier;
		this.nonInclusivePhrases = nonInclusivePhrases;
		this.inclusiveAlternatives = inclusiveAlternatives;
		if ( isString( this.inclusiveAlternatives ) ) {
			this.inclusiveAlternatives = [ this.inclusiveAlternatives ];
		}
		this.score = score;
		this.feedbackFormat = feedbackFormat;
		this.learnMoreUrl = createAnchorOpeningTag( learnMoreUrl );

		this.rule = rule || includesConsecutiveWords;
		this.ruleDescription = ruleDescription;
		this.caseSensitive = caseSensitive || false;
		this.category = category;
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
		const sentences = researcher.getResearch( "sentences" );

		// Also include the text title in the analysis as a separate sentence.
		const textTitle = paper.getTextTitle();
		sentences.push( textTitle );

		this.foundPhrases = [];

		sentences.forEach( sentence => {
			let words = getWords( sentence, "\\s", false );
			if ( ! this.caseSensitive ) {
				words = words.map( word => word.toLocaleLowerCase() );
			}

			const foundPhrase = this.nonInclusivePhrases.find( phrase => this.rule( words, getWords( phrase, "\\s", false ) ).length >= 1 );

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
			this.learnMoreUrl,
			"</a>"
		);

		const text = sprintf(
			this.feedbackFormat,
			this.foundPhrases[ 0 ].phrase,
			...this.inclusiveAlternatives
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
		if ( ! this.foundPhrases ) {
			return [];
		}
		return this.foundPhrases.map( foundPhrase =>
			new Mark( {
				original: foundPhrase.sentence,
				marked: addMark( foundPhrase.sentence ),
			} ) );
	}
}
