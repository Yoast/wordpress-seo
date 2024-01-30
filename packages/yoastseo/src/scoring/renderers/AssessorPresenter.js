/* eslint-disable tree-shaking/no-side-effects-in-initialization */
import { __ } from "@wordpress/i18n";
import { difference, forEach, isNumber, isObject, isUndefined } from "lodash-es";
import { assessmentPresenterResult as template } from "../../snippetPreview/templates.js";
import scoreToRating from "../interpreters/scoreToRating.js";
import createConfig from "../../config/presenter.js";

/**
 * Represents the AssessorPresenter.
 */
class AssessorPresenter {
	/**
	 * Constructs the AssessorPresenter.
	 *
	 * @param {Object} args A list of arguments to use in the presenter.
	 * @param {object} args.targets The HTML elements to render the output to.
	 * @param {string} args.targets.output The HTML element to render the individual ratings out to.
	 * @param {string} args.targets.overall The HTML element to render the overall rating out to.
	 * @param {string} args.keyword The keyword to use for checking, when calculating the overall rating.
	 * @param {SEOAssessor} args.assessor The Assessor object to retrieve assessment results from.
	 *
	 * @constructor
	 */
	constructor(  args ) {
		this.keyword = args.keyword;
		this.assessor = args.assessor;
		this.output = args.targets.output;
		this.overall = args.targets.overall || "overallScore";
		this.presenterConfig = createConfig();

		this._disableMarkerButtons = false;

		this._activeMarker = false;
	}

	/**
	 * Sets the keyword.
	 *
	 * @param {string} keyword The keyword to use.
	 * @returns {void}
	 */
	setKeyword( keyword ) {
		this.keyword = keyword;
	}

	/**
	 * Checks whether a specific property exists in the presenter configuration.
	 *
	 * @param {string} property The property name to search for.
	 * @returns {boolean} Whether or not the property exists.
	 */
	configHasProperty( property ) {
		return this.presenterConfig.hasOwnProperty( property );
	}

	/**
	 * Gets a fully formatted indicator object that can be used.
	 *
	 * @param {string} rating The rating to use.
	 * @returns {Object} An object containing the class, the screen reader text, and the full text.
	 */
	getIndicator( rating ) {
		return {
			className: this.getIndicatorColorClass( rating ),
			screenReaderText: this.getIndicatorScreenReaderText( rating ),
			fullText: this.getIndicatorFullText( rating ),
			screenReaderReadabilityText: this.getIndicatorScreenReaderReadabilityText( rating ),
		};
	}

	/**
	 * Gets the indicator color class from the presenter configuration, if it exists.
	 *
	 * @param {string} rating The rating to check against the config.
	 * @returns {string} String containing the CSS class to be used.
	 */
	getIndicatorColorClass( rating ) {
		if ( ! this.configHasProperty( rating ) ) {
			return "";
		}

		return this.presenterConfig[ rating ].className;
	}

	/**
	 * Get the indicator screen reader text from the presenter configuration, if it exists.
	 *
	 * @param {string} rating The rating to check against the config.
	 * @returns {string} Translated string containing the screen reader text to be used.
	 */
	getIndicatorScreenReaderText( rating ) {
		if ( ! this.configHasProperty( rating ) ) {
			return "";
		}

		return this.presenterConfig[ rating ].screenReaderText;
	}

	/**
	 * Get the indicator screen reader readability text from the presenter configuration, if it exists.
	 *
	 * @param {string} rating The rating to check against the config.
	 * @returns {string} Translated string containing the screen reader readability text to be used.
	 */
	getIndicatorScreenReaderReadabilityText( rating ) {
		if ( ! this.configHasProperty( rating ) ) {
			return "";
		}

		return this.presenterConfig[ rating ].screenReaderReadabilityText;
	}

	/**
	 * Get the indicator full text from the presenter configuration, if it exists.
	 *
	 * @param {string} rating The rating to check against the config.
	 * @returns {string} Translated string containing the full text to be used.
	 */
	getIndicatorFullText( rating ) {
		if ( ! this.configHasProperty( rating ) ) {
			return "";
		}

		return this.presenterConfig[ rating ].fullText;
	}

	/**
	 * Adds a rating based on the numeric score.
	 *
	 * @param {Object} result Object based on the Assessment result. Requires a score property to work.
	 * @returns {Object} The Assessment result object with the rating added.
	 */
	resultToRating( result ) {
		if ( ! isObject( result ) ) {
			return "";
		}

		result.rating = scoreToRating( result.score );

		return result;
	}

	/**
	 * Takes the individual assessment results, sorts and rates them.
	 *
	 * @returns {Object} Object containing all the individual ratings.
	 */
	getIndividualRatings() {
		const ratings = {};
		const validResults = this.sort( this.assessor.getValidResults() );
		const mappedResults = validResults.map( this.resultToRating );

		forEach( mappedResults, function( item, key ) {
			ratings[ key ] = this.addRating( item );
		}.bind( this ) );

		return ratings;
	}

	/**
	 * Excludes items from the results that are present in the exclude array.
	 *
	 * @param {Array} results Array containing the items to filter through.
	 * @param {Array} exclude Array of results to exclude.
	 * @returns {Array} Array containing items that remain after exclusion.
	 */
	excludeFromResults( results, exclude ) {
		return difference( results, exclude );
	}

	/**
	 * Sorts results based on their score property and always places items considered to be unsortable, at the top.
	 *
	 * @param {Array} results Array containing the results that need to be sorted.
	 * @returns {Array} Array containing the sorted results.
	 */
	sort( results ) {
		const unsortables = this.getUndefinedScores( results );
		const sortables = this.excludeFromResults( results, unsortables );

		sortables.sort( function( a, b ) {
			return a.score - b.score;
		} );

		return unsortables.concat( sortables );
	}

	/**
	 * Returns a subset of results that have an undefined score or a score set to zero.
	 *
	 * @param {Array} results The results to filter through.
	 * @returns {Array} A subset of results containing items with an undefined score or where the score is zero.
	 */
	getUndefinedScores( results ) {
		return results.filter( function( result ) {
			return isUndefined( result.score ) || result.score === 0;
		} );
	}

	/**
	 * Creates a rating object based on the item that is being passed.
	 *
	 * @param {AssessmentResult} item The item to check and create a rating object from.
	 * @returns {Object} Object containing a parsed item, including a colored indicator.
	 */
	addRating( item ) {
		const indicator = this.getIndicator( item.rating );
		indicator.text = item.text;
		indicator.identifier = item.getIdentifier();

		if ( item.hasMarker() ) {
			indicator.marker = item.getMarker();
		}

		return indicator;
	}

	/**
	 * Calculates the overall rating score based on the overall score.
	 *
	 * @param {Number} overallScore The overall score to use in the calculation.
	 * @returns {Object} The rating based on the score.
	 */
	getOverallRating( overallScore ) {
		let rating = 0;

		if ( this.keyword === "" ) {
			return this.resultToRating( { score: rating } );
		}

		if ( isNumber( overallScore ) ) {
			rating = ( overallScore / 10 );
		}

		return this.resultToRating( { score: rating } );
	}

	/**
	 * Mark with a given marker. This will set the active marker to the correct value.
	 *
	 * @param {string} identifier The identifier for the assessment/marker.
	 * @param {Function} marker The marker function.
	 * @returns {void}
	 */
	markAssessment( identifier, marker ) {
		if ( this._activeMarker === identifier ) {
			this.removeAllMarks();
			this._activeMarker = false;
		} else {
			marker();
			this._activeMarker = identifier;
		}

		this.render();
	}

	/**
	 * Disables the currently active marker in the UI.
	 *
	 * @returns {void}
	 */
	disableMarker() {
		this._activeMarker = false;
		this.render();
	}

	/**
	 * Disables the marker buttons.
	 *
	 * @returns {void}
	 */
	disableMarkerButtons() {
		this._disableMarkerButtons = true;
		this.render();
	}

	/**
	 * Enables the marker buttons.
	 *
	 * @returns {void}
	 */
	enableMarkerButtons() {
		this._disableMarkerButtons = false;
		this.render();
	}

	/**
	 * Adds an event listener for the marker button
	 *
	 * @param {string} identifier The identifier for the assessment the marker belongs to.
	 * @param {Function} marker The marker function that can mark the assessment in the text.
	 * @returns {void}
	 */
	addMarkerEventHandler( identifier, marker ) {
		const container = document.getElementById( this.output );
		const markButton = container.getElementsByClassName( "js-assessment-results__mark-" + identifier )[ 0 ];

		markButton.addEventListener( "click", this.markAssessment.bind( this, identifier, marker ) );
	}

	/**
	 * Renders out both the individual and the overall ratings.
	 *
	 * @returns {void}
	 */
	render() {
		this.renderIndividualRatings();
		this.renderOverallRating();
	}

	/**
	 * Adds event handlers to the mark buttons
	 *
	 * @param {Array} scores The list of rendered scores.
	 *
	 * @returns {void}
	 */
	bindMarkButtons( scores ) {
		// Make sure the button works for every score with a marker.
		forEach( scores, function( score ) {
			if ( score.hasOwnProperty( "marker" ) ) {
				this.addMarkerEventHandler( score.identifier, score.marker );
			}
		}.bind( this ) );
	}

	/**
	 * Removes all marks currently on the text
	 *
	 * @returns {void}
	 */
	removeAllMarks() {
		const marker = this.assessor.getSpecificMarker();

		marker( this.assessor.getPaper(), [] );
	}

	/**
	 * Renders out the individual ratings.
	 *
	 * @returns {void}
	 */
	renderIndividualRatings() {
		const outputTarget = document.getElementById( this.output );
		const scores = this.getIndividualRatings();

		outputTarget.innerHTML = template( {
			scores: scores,
			i18n: {
				disabledMarkText: __( "Marks are disabled in current view", "wordpress-seo" ),
				markInText: __( "Mark this result in the text", "wordpress-seo" ),
				removeMarksInText: __( "Remove marks in the text", "wordpress-seo" ),
			},
			activeMarker: this._activeMarker,
			markerButtonsDisabled: this._disableMarkerButtons,
		} );

		this.bindMarkButtons( scores );
	}

	/**
	 * Renders out the overall rating.
	 *
	 * @returns {void}
	 */
	renderOverallRating() {
		const overallRating = this.getOverallRating( this.assessor.calculateOverallScore() );
		const overallRatingElement = document.getElementById( this.overall );

		if ( ! overallRatingElement ) {
			return;
		}

		overallRatingElement.className = "overallScore " + this.getIndicatorColorClass( overallRating.rating );
	}
}

export default AssessorPresenter;
