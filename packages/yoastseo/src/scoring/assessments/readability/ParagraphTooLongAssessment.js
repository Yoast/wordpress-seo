import { __, _n, sprintf } from "@wordpress/i18n";
import { filter, map, merge } from "lodash-es";
import { stripBlockTagsAtStartEnd as stripHTMLTags } from "../../../languageProcessing/helpers/sanitize/stripHTMLTags";
import marker from "../../../markers/addMark";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import { inRangeEndInclusive as inRange } from "../../helpers/assessments/inRange";
import AssessmentResult from "../../../values/AssessmentResult";
import Mark from "../../../values/Mark";
import Assessment from "../assessment";

/**
 * Represents the assessment that will look if the text has too long paragraphs.
 */
export default class ParagraphTooLongAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {object} config The configuration to use.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/35d" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/35e" ),
			countTextIn: __( "words", "wordpress-seo" ),
			parameters: {
				recommendedLength: 150,
				maximumRecommendedLength: 200,
			},
		};

		this.identifier = "textParagraphTooLong";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Returns an array containing only the paragraphs longer than the recommended length.
	 *
	 * @param {array} paragraphsLength The array containing the lengths of individual paragraphs.
	 *
	 * @returns {array} The number of too long paragraphs.
	 */
	getTooLongParagraphs( paragraphsLength  ) {
		const recommendedLength = this._config.parameters.recommendedLength;
		return filter( paragraphsLength, function( paragraph ) {
			return paragraph.countLength > recommendedLength;
		} );
	}

	/**
	 * Returns the scores and text for the ParagraphTooLongAssessment.
	 *
	 * @param {array} paragraphsLength  The array containing the lengths of individual paragraphs.
	 * @param {array} tooLongParagraphs The number of too long paragraphs.
	 *
	 * @returns {{score: number, text: string }} the assessmentResult.
	 */
	calculateResult( paragraphsLength, tooLongParagraphs ) {
		let score;

		if ( paragraphsLength.length === 0 ) {
			return {};
		}

		const longestParagraphLength = paragraphsLength[ 0 ].countLength;

		if ( longestParagraphLength <= this._config.parameters.recommendedLength ) {
			// Green indicator.
			score = 9;
		}

		if ( inRange( longestParagraphLength, this._config.parameters.recommendedLength, this._config.parameters.maximumRecommendedLength ) ) {
			// Orange indicator.
			score = 6;
		}

		if ( longestParagraphLength > this._config.parameters.maximumRecommendedLength ) {
			// Red indicator.
			score = 3;
		}

		if ( score >= 7 ) {
			return {
				score: score,
				hasMarks: false,

				text: sprintf(
					/* Translators:  %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
					__(
						"%1$sParagraph length%2$s: None of the paragraphs are too long. Great job!",
						"wordpress-seo"
					),
					this._config.urlTitle,
					"</a>"
				),
			};
		}
		return {
			score: score,
			hasMarks: true,
			text: sprintf(
				/* Translators: %1$s and %5$s expand to a link on yoast.com, %2$s expands to the anchor end tag,
			%3$d expands to the number of paragraphs over the recommended word limit, %4$d expands to the word limit,
			%6$s expands to the word 'words' or 'characters'. */
				_n(
					// eslint-disable-next-line max-len
					"%1$sParagraph length%2$s: %3$d of the paragraphs contains more than the recommended maximum of %4$d %6$s. %5$sShorten your paragraphs%2$s!",
					// eslint-disable-next-line max-len
					"%1$sParagraph length%2$s: %3$d of the paragraphs contain more than the recommended maximum of %4$d %6$s. %5$sShorten your paragraphs%2$s!",
					tooLongParagraphs.length,
					"wordpress-seo"
				),
				this._config.urlTitle,
				"</a>",
				tooLongParagraphs.length,
				this._config.parameters.recommendedLength,
				this._config.urlCallToAction,
				this._config.countTextIn
			),
		};
	}

	/**
	 * Sort the paragraphs based on word count.
	 *
	 * @param {Array} paragraphs The array with paragraphs.
	 *
	 * @returns {Array} The array sorted on word counts.
	 */
	sortParagraphs( paragraphs ) {
		return paragraphs.sort(
			function( a, b ) {
				return b.countLength - a.countLength;
			}
		);
	}

	/**
	 * Creates a marker for the paragraphs.
	 *
	 * @param {object} paper        The paper to use for the assessment.
	 * @param {object} researcher   The researcher used for calling research.
	 *
	 * @returns {Array} An array with marked paragraphs.
	 */
	getMarks( paper, researcher ) {
		const paragraphsLength = researcher.getResearch( "getParagraphLength" );
		const tooLongParagraphs = this.getTooLongParagraphs( paragraphsLength );
		return map( tooLongParagraphs, function( paragraph ) {
			const paragraphText = stripHTMLTags( paragraph.text );
			const marked = marker( paragraphText );
			return new Mark( {
				original: paragraphText,
				marked: marked,
			} );
		} );
	}

	/**
	 * Runs the getParagraphLength module, based on this returns an assessment result with score and text.
	 *
	 * @param {Paper} paper             The paper to use for the assessment.
	 * @param {Researcher} researcher   The researcher used for calling research.
	 *
	 * @returns {object} The assessment result.
	 */
	getResult( paper, researcher ) {
		let paragraphsLength = researcher.getResearch( "getParagraphLength" );
		const countTextInCharacters = researcher.getConfig( "countCharacters" );
		if ( countTextInCharacters ) {
			this._config.countTextIn = __( "characters", "wordpress-seo" );
		}

		paragraphsLength = this.sortParagraphs( paragraphsLength );

		const tooLongParagraphs = this.getTooLongParagraphs( paragraphsLength );
		const paragraphLengthResult = this.calculateResult( paragraphsLength, tooLongParagraphs );
		const assessmentResult = new AssessmentResult();

		assessmentResult.setScore( paragraphLengthResult.score );
		assessmentResult.setText( paragraphLengthResult.text );
		assessmentResult.setHasMarks( paragraphLengthResult.hasMarks );

		return assessmentResult;
	}

	/**
	 * Checks if the paragraphTooLong assessment is applicable to the paper.
	 *
	 * @param {Paper} paper The paper to check.
	 *
	 * @returns {boolean} Returns true if the assessment is applicable to the paper.
	 */
	isApplicable( paper ) {
		return paper.hasText();
	}
}
