import AssessmentResult from '../../values/AssessmentResult.js';
import Assessment from '../../assessment.js';
import { inRange } from "lodash-es";

import getLanguageAvailability from '../../helpers/getLanguageAvailability.js';

const availableLanguages = [ "en", "nl", "de", "it", "ru", "fr", "es" ];

class FleschReadingEaseAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} config The configuration to use.
	 * @returns {void}
	 */
	constructor( config ) {
		super();

		this.identifier = "fleschReadingEase";
		this._config = config;
	}

	/**
	 * The assessment that runs the FleschReading on the paper.
	 *
	 * @param {Object} paper The paper to run this assessment on.
	 * @param {Object} researcher The researcher used for the assessment.
	 * @param {Object} i18n The i18n-object used for parsing translations.
	 *
	 * @returns {Object} An assessmentResult with the score and formatted text.
	 */
	getResult( paper, researcher, i18n ) {
		this.fleschReadingResult = researcher.getResearch( "calculateFleschReading" );
		if ( this.isApplicable( paper ) ) {
			let assessmentResult =  new AssessmentResult( i18n );
			const calculatedResult = this.calculateResult( i18n );
			assessmentResult.setScore( calculatedResult.score );
			assessmentResult.setText( calculatedResult.resultText );

			return assessmentResult;
		}
		return null;
	}

	/**
	 * Calculates the assessment result based on the fleschReadingScore.
	 *
	 * @param {Object} i18n The i18n-object used for parsing translations.
	 *
	 * @returns {Object} Object with score and resultText.
	 */
	calculateResult( i18n ) {
		// Results must be between 0 and 100;
		if ( this.fleschReadingResult < 0 ) {
			this.fleschReadingResult = 0;
		}

		if ( this.fleschReadingResult > 100 ) {
			this.fleschReadingResult = 100;
		}

		/* Translators: %1$s expands to the numeric Flesch reading ease score,
		%2$s to a link to a Yoast.com article about Flesch reading ease score,
		%3$s to the easyness of reading,
		%4$s expands to a note about the flesch reading score. */
		let text = i18n.dgettext(
			"js-text-analysis",
			"The copy scores %1$s in the %2$s test, which is considered %3$s to read. %4$s"
		);

		const url = "<a href='https://yoa.st/flesch-reading' target='_blank'>Flesch Reading Ease</a>";

		if ( this.fleschReadingResult > this._config.borders.veryEasy ) {
			const feedback = i18n.dgettext( "js-text-analysis", "very easy" );
			return {
				score: this._config.scores.veryEasy,
				resultText: i18n.sprintf( text, this.fleschReadingResult, url, feedback, "" ),
			};
		}

		if ( inRange( this.fleschReadingResult, this._config.borders.easy, this._config.borders.veryEasy ) ) {
			const feedback = i18n.dgettext( "js-text-analysis", "easy" );
			return {
				score: this._config.scores.easy,
				resultText: i18n.sprintf( text, this.fleschReadingResult, url, feedback, "" ),
			};
		}

		if ( inRange( this.fleschReadingResult, this._config.borders.fairlyEasy, this._config.borders.easy ) ) {
			const feedback = i18n.dgettext( "js-text-analysis", "fairly easy" );
			return {
				score: this._config.scores.fairlyEasy,
				resultText: i18n.sprintf( text, this.fleschReadingResult, url, feedback, "" ),
			};
		}

		if ( inRange( this.fleschReadingResult, this._config.borders.okay, this._config.borders.fairlyEasy ) ) {
			const feedback = i18n.dgettext( "js-text-analysis", "ok" );
			return {
				score: this._config.scores.okay,
				resultText: i18n.sprintf( text, this.fleschReadingResult, url, feedback, "" ),
			};
		}

		if ( inRange( this.fleschReadingResult, this._config.borders.fairlyDifficult, this._config.borders.okay ) ) {
			const feedback = i18n.dgettext( "js-text-analysis", "fairly difficult" );
			const note = i18n.dgettext( "js-text-analysis", "Try to make shorter sentences to improve readability." );
			return {
				score: this._config.scores.fairlyDifficult,
				resultText: i18n.sprintf( text, this.fleschReadingResult, url, feedback, note ),
			};
		}

		if ( inRange( this.fleschReadingResult, this._config.borders.difficult, this._config.borders.fairlyDifficult ) ) {
			const feedback = i18n.dgettext( "js-text-analysis", "difficult" );
			const note = i18n.dgettext( "js-text-analysis", "Try to make shorter sentences, using less difficult words to improve readability." );
			return {
				score: this._config.scores.difficult,
				resultText: i18n.sprintf( text, this.fleschReadingResult, url, feedback, note ),
			};
		}

		const feedback = i18n.dgettext( "js-text-analysis", "very difficult" );
		const note = i18n.dgettext( "js-text-analysis", "Try to make shorter sentences, using less difficult words to improve readability." );
		return {
			score: this._config.scores.veryDifficult,
			resultText: i18n.sprintf( text, this.fleschReadingResult, url, feedback, note ),
		};
	}

	/**
	 * Checks if Flesch reading analysis is available for the language of the paper.
	 *
	 * @param {Object} paper The paper to have the Flesch score to be calculated for.
	 * @returns {boolean} Returns true if the language is available and the paper is not empty.
	 */
	isApplicable( paper ) {
		const isLanguageAvailable = getLanguageAvailability( paper.getLocale(), availableLanguages );
		return ( isLanguageAvailable && paper.hasText() );
	}
}

export default FleschReadingEaseAssessment;
