let AssessmentResult = require( "../../values/AssessmentResult.js" );
let Assessment = require( "../../assessment.js" );
const inRange = require( "lodash/inRange" );
const isEmpty = require( "lodash/isEmpty" );

const getLanguageAvailability = require( "../../helpers/getLanguageAvailability.js" );

const availableLanguages = [ "en", "nl", "de", "it", "ru" ];

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
	 * @returns {Object} An assessmentResult with the score and formatted text.
	 */
	getResult( paper, researcher, i18n ) {
		this.fleschReadingResult = researcher.getResearch( "calculateFleschReading" );
		if ( this.isApplicable( paper ) ) {
			let assessmentResult =  new AssessmentResult();
			const calculatedResult = this.calculateResult();
			assessmentResult.setScore( calculatedResult.score );
			assessmentResult.setText( this.translateScore( calculatedResult.resultText, calculatedResult.note, i18n ) );

			return assessmentResult;
		}
		return null;
	}

	/**
	 * Calculates the assessment result based on the fleschReadingScore.
	 * @returns {Object} Object with score, resultText and note.
	 */
	calculateResult() {
		if ( this.fleschReadingResult > this._config.borders.veryEasy ) {
			return this._config.veryEasy;
		}

		if ( inRange( this.fleschReadingResult, this._config.borders.easy, this._config.borders.veryEasy ) ) {
			return this._config.easy;
		}

		if ( inRange( this.fleschReadingResult, this._config.borders.fairlyEasy, this._config.borders.easy ) ) {
			return this._config.fairlyEasy;
		}

		if ( inRange( this.fleschReadingResult, this._config.borders.okay, this._config.borders.fairlyEasy ) ) {
			return this._config.okay;
		}

		if ( inRange( this.fleschReadingResult, this._config.borders.fairlyDifficult, this._config.borders.okay ) ) {
			return this._config.fairlyDifficult;
		}

		if ( inRange( this.fleschReadingResult, this._config.borders.difficult, this._config.borders.fairlyDifficult ) ) {
			return this._config.difficult;
		}

		return this._config.veryDifficult;
	}

	/**
	 * Translates the FleschReading score into a specific feedback text.
	 *
	 * @param {string} resultText The feedback for a range of Flesch reading results from the config.
	 * @param {string} noteText The note for a range of Flesch reading results from the config.
	 * @param {Object} i18n The i18n-object used for parsing translations.
	 * @returns {string} text Feedback text.
	 */
	translateScore( resultText, noteText, i18n ) {
		/* Translators: %1$s expands to the numeric flesch reading ease score, %2$s to a link to a Yoast.com article about Flesch ease reading score,
		 %3$s to the easyness of reading, %4$s expands to a note about the flesch reading score. */
		let text = i18n.dgettext( "js-text-analysis", "The copy scores %1$s in the %2$s test, which is considered %3$s to read. %4$s" );
		const feedback = i18n.dgettext( "js-text-analysis", resultText );
		const url = "<a href='https://yoa.st/flesch-reading' target='_blank'>Flesch Reading Ease</a>";

		let note = "";
		if ( ! isEmpty( noteText ) ) {
			note = i18n.dgettext( "js-text-analysis", noteText );
		}

		// Results must be between 0 and 100;
		if ( this.fleschReadingResult < 0 ) {
			this.fleschReadingResult = 0;
		}
		if ( this.fleschReadingResult > 100 ) {
			this.fleschReadingResult = 100;
		}

		text = i18n.sprintf( text, this.fleschReadingResult, url, feedback, note );

		return text;
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

module.exports = FleschReadingEaseAssessment;
