import { merge, partition, sortBy } from "lodash";
import { _n, __, sprintf } from "@wordpress/i18n";

import { createAnchorOpeningTag } from "../../../helpers";
import AssessmentResult from "../../../values/AssessmentResult";
import Mark from "../../../values/Mark";
import Assessment from "../assessment";

/**
 * @typedef {import("../../../languageProcessing/AbstractResearcher").default } Researcher
 * @typedef {import("../../../languageProcessing/researches/getSentenceBeginnings").SentenceBeginning } SentenceBeginning
 * @typedef {import("../../../values/").Paper } Paper
 */

/**
 * The maximum number of consecutive sentences that can start with the same word.
 * @type {number}
 */
const MAX_SAME_BEGINNINGS = 2;

/**
 * Represents the assessment that checks whether there are three or more consecutive sentences beginning with the same word.
 */
export default class SentenceBeginningsAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 * @param {{urlTitle?: string, urlCallToAction?: string}} config The configuration to use.
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/35f" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/35g" ),
		};

		this.identifier = "sentenceBeginnings";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Counts and groups the number too often used sentence beginnings and determines the lowest count within that group.
	 *
	 * @param {SentenceBeginning[]} sentenceBeginnings The array containing the objects containing the beginning words and counts.
	 *
	 * @returns {{total: number, lowestCount: number}} The object containing the total number of too often used beginnings and the lowest count within those.
	 */
	groupSentenceBeginnings( sentenceBeginnings ) {
		const tooOften = partition( sentenceBeginnings, word => word.count > MAX_SAME_BEGINNINGS );

		if ( tooOften[ 0 ].length === 0 ) {
			return { total: 0, lowestCount: 0 };
		}

		const sortedCounts = sortBy( tooOften[ 0 ], word => word.count );

		return { total: tooOften[ 0 ].length, lowestCount: sortedCounts[ 0 ].count };
	}

	/**
	 * Calculates the score based on sentence beginnings.
	 *
	 * @param {{total: number, lowestCount: number}} groupedSentenceBeginnings    The object with grouped sentence beginnings.
	 *
	 * @returns {AssessmentResult} AssessmentResult object with score and feedback.
	 */
	calculateSentenceBeginningsResult( groupedSentenceBeginnings ) {
		const assessmentResult = new AssessmentResult();

		if ( groupedSentenceBeginnings.total > 0 ) {
			assessmentResult.setScore( 3 );
			assessmentResult.setHasMarks( true );
			// eslint-disable-next-line @wordpress/valid-sprintf -- The plural uses one extra argument.
			assessmentResult.setText( sprintf(
				/* translators: %1$s and %5$s expand to a link on yoast.com, %2$s expands to the anchor end tag,
				%3$d expands to the number of consecutive sentences starting with the same word,
				%4$d expands to the number of instances where 3 or more consecutive sentences start with the same word. */
				_n(
					"%1$sConsecutive sentences%2$s: The text contains %3$d consecutive sentences starting with the same word. %5$sTry to mix things up%2$s!",
					"%1$sConsecutive sentences%2$s: The text contains %4$d instances where %3$d or more consecutive sentences start with the same word. %5$sTry to mix things up%2$s!",
					groupedSentenceBeginnings.total,
					"wordpress-seo"
				),
				this._config.urlTitle,
				"</a>",
				groupedSentenceBeginnings.lowestCount,
				groupedSentenceBeginnings.total,
				this._config.urlCallToAction
			) );
		} else {
			assessmentResult.setScore( 9 );
			assessmentResult.setHasMarks( false );
			assessmentResult.setText( sprintf(
				/* translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
				__(
					"%1$sConsecutive sentences%2$s: There is enough variety in your sentences. That's great!",
					"wordpress-seo"
				),
				this._config.urlTitle,
				"</a>"
			) );
		}

		return assessmentResult;
	}

	/**
	 * Marks all consecutive sentences with the same beginnings.
	 *
	 * @param {Paper} paper             The paper to use for the assessment.
	 * @param {Researcher} researcher   The researcher used for calling research.
	 *
	 * @returns {Mark[]} All marked sentences.
	 */
	getMarks( paper, researcher ) {
		let sentenceBeginnings = researcher.getResearch( "getSentenceBeginnings" );
		sentenceBeginnings = sentenceBeginnings.filter( sentenceBeginning => sentenceBeginning.count > MAX_SAME_BEGINNINGS );
		const sentences = sentenceBeginnings.flatMap( sentenceBeginning => sentenceBeginning.sentences );
		return sentences.map( sentence => {
			const startOffset = sentence.getFirstToken()?.sourceCodeRange.startOffset || 0;
			const endOffset = sentence.getLastToken()?.sourceCodeRange.endOffset || 0;

			return new Mark( {
				position: {
					startOffset,
					endOffset,
					startOffsetBlock: startOffset - ( sentence.parentStartOffset || 0 ),
					endOffsetBlock: endOffset - ( sentence.parentStartOffset || 0 ),
					clientId: sentence.parentClientId || "",
					attributeId: sentence.parentAttributeId || "",
					isFirstSection: sentence.isParentFirstSectionOfBlock || false,
				},
			} );
		} );
	}

	/**
	 * Scores the repetition of sentence beginnings in consecutive sentences.
	 *
	 * @param {Paper} paper           The paper to use for the assessment.
	 * @param {Researcher} researcher The researcher used for calling research.
	 *
	 * @returns {AssessmentResult} The result of the assessment.
	 */
	getResult( paper, researcher ) {
		const sentenceBeginnings = researcher.getResearch( "getSentenceBeginnings" );
		const groupedSentenceBeginnings = this.groupSentenceBeginnings( sentenceBeginnings );
		return this.calculateSentenceBeginningsResult( groupedSentenceBeginnings );
	}

	/**
	 * Checks whether the sentence beginnings assessment is applicable.
	 *
	 * @param {Paper}       paper       The paper to check.
	 * @param {Researcher}  researcher  The researcher object.
	 *
	 * @returns {boolean} Returns true if the paper has enough content for the assessment and the researcher has the required research.
	 */
	isApplicable( paper, researcher ) {
		return this.hasEnoughContentForAssessment( paper ) && researcher.hasResearch( "getSentenceBeginnings" );
	}
}
