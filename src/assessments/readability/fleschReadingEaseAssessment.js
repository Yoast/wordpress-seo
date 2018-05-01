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
	 * @param {object} config The configuration to use.
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
	 * @returns {Object} an assessmentResult with the score and formatted text.
	 */
	getResult( paper, researcher, i18n ) {
		this.fleschReadingResult = researcher.getResearch( "calculateFleschReading" );
		if ( this.isApplicable( paper ) ) {
			let assessmentResult =  new AssessmentResult();
			const calculatedScore = this.calculateScore();
			assessmentResult.setScore( calculatedScore.score );
			assessmentResult.setText( this.translateScore( calculatedScore, i18n ) );

			return assessmentResult;
		}
	}

	/**
	 * Calculates the assessment result based on the fleschReadingScore.
	 * @returns {object} object with score, resultText and note.
	 */
	calculateScore() {
		if ( this.fleschReadingResult > this._config.borders.veryEasy ) {
			return {
				score: this._config.scores.good,
				resultText: this._config.resultTexts.veryEasy,
				note: "",
			};
		}

		if ( inRange( this.fleschReadingResult, this._config.borders.easy, this._config.borders.veryEasy ) ) {
			return {
				score: this._config.scores.good,
				resultText: this._config.resultTexts.easy,
				note: "",
			};
		}

		if ( inRange( this.fleschReadingResult, this._config.borders.fairlyEasy, this._config.borders.easy ) ) {
			return {
				score: this._config.scores.good,
				resultText: this._config.resultTexts.fairlyEasy,
				note: "",
			};
		}

		if ( inRange( this.fleschReadingResult, this._config.borders.okay, this._config.borders.fairlyEasy ) ) {
			return {
				score: this._config.scores.good,
				resultText: this._config.resultTexts.okay,
				note: "",
			};
		}

		if ( inRange( this.fleschReadingResult, this._config.borders.fairlyDifficult, this._config.borders.okay ) ) {
			return {
				score: this._config.scores.fine,
				resultText: this._config.resultTexts.fairlyDifficult,
				note: this._config.notes.fairlyDifficult,
			};
		}

		if ( inRange( this.fleschReadingResult, this._config.borders.difficult, this._config.borders.fairlyDifficult ) ) {
			return {
				score: this._config.scores.bad,
				resultText: this._config.resultTexts.difficult,
				note: this._config.notes.difficult,
			};
		}

		if ( this.fleschReadingResult < this._config.borders.difficult ) {
			return {
				score: this._config.scores.bad,
				resultText: this._config.resultTexts.veryDifficult,
				note: this._config.notes.difficult,
			};
		}
	}

	/**
	 * Translates the FleschReading score into a specific feedback text.
	 *
	 * @param {Object} calculatedScore The Flesch reading score for the paper.
	 * @param {Object} i18n The i18n-object used for parsing translations.
	 * @returns {string} text Feedback text.
	 */
	translateScore( calculatedScore, i18n ) {
		/* Translators: %1$s expands to the numeric flesch reading ease score, %2$s to a link to a Yoast.com article about Flesch ease reading score,
		 %3$s to the easyness of reading, %4$s expands to a note about the flesch reading score. */
		let text = i18n.dgettext( "js-text-analysis", "The copy scores %1$s in the %2$s test, which is considered %3$s to read. %4$s" );
		const feedback = i18n.dgettext( "js-text-analysis", calculatedScore.resultText );
		const url = "<a href='https://yoa.st/flesch-reading' target='_blank'>Flesch Reading Ease</a>";

		let note = "";
		if ( ! isEmpty( calculatedScore.note ) ) {
			note = i18n.dgettext( "js-text-analysis", calculatedScore.note );
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
	 * @returns {boolean} If the language is available and the paper is not empty.
	 */
	isApplicable( paper ) {
		const isLanguageAvailable = getLanguageAvailability( paper.getLocale(), availableLanguages );
		return ( isLanguageAvailable && paper.hasText() );
	}

}

module.exports = FleschReadingEaseAssessment;
