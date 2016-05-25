/* jshint browser: true */

var forEach = require( "lodash/forEach" );
var isNumber = require( "lodash/isNumber" );
var isObject = require( "lodash/isObject" );
var isUndefined = require( "lodash/isUndefined" );
var difference = require( "lodash/difference" );
var template = require( "../templates.js" ).assessmentPresenterResult;
var scoreToRating = require( "../interpreters/scoreToRating.js" );
var createConfig = require( "../config/presenter.js" );

var domManipulation = require( "../helpers/domManipulation.js" );

/**
 * Constructs the AssessorPresenter.
 *
 * @param {Object} args A list of arguments to use in the presenter.
 * @param {object} args.targets The HTML elements to render the output to.
 * @param {string} args.targets.output The HTML element to render the individual ratings out to.
 * @param {string} args.targets.overall The HTML element to render the overall rating out to.
 * @param {string} args.keyword The keyword to use for checking, when calculating the overall rating.
 * @param {SEOAssessor} args.assessor The Assessor object to retrieve assessment results from.
 * @param {Jed} args.i18n The translation object.
 *
 * @constructor
 */
var AssessorPresenter = function( args ) {
	this.keyword = args.keyword;
	this.assessor = args.assessor;
	this.i18n = args.i18n;
	this.output = args.targets.output;
	this.overall = args.targets.overall || "overallScore";
	this.presenterConfig = createConfig( args.i18n );
};

/**
 * Sets the keyword
 * @param {string} keyword The keyword to use.
 */
AssessorPresenter.prototype.setKeyword = function( keyword ) {
	this.keyword = keyword;
};

/**
 * Checks whether or not a specific property exists in the presenter configuration.
 * @param {string} property The property name to search for.
 * @returns {boolean} Whether or not the property exists.
 */
AssessorPresenter.prototype.configHasProperty = function( property ) {
	return this.presenterConfig.hasOwnProperty( property );
};

/**
 * Gets a fully formatted indicator object that can be used.
 * @param {string} rating The rating to use.
 * @returns {Object} An object containing the class, the screen reader text, and the full text.
 */
AssessorPresenter.prototype.getIndicator = function( rating ) {
	return {
		className: this.getIndicatorColorClass( rating ),
		screenReaderText: this.getIndicatorScreenReaderText( rating ),
		fullText: this.getIndicatorFullText( rating )
	};
};

/**
 * Gets the indicator color class from the presenter configuration, if it exists.
 * @param {string} rating The rating to check against the config.
 * @returns {string} String containing the CSS class to be used.
 */
AssessorPresenter.prototype.getIndicatorColorClass = function( rating ) {
	if ( !this.configHasProperty( rating ) ) {
		return "";
	}

	return this.presenterConfig[ rating ].className;
};

/**
 * Get the indicator screen reader text from the presenter configuration, if it exists.
 * @param {string} rating The rating to check against the config.
 * @returns {string} Translated string containing the screen reader text to be used.
 */
AssessorPresenter.prototype.getIndicatorScreenReaderText = function( rating ) {
	if ( !this.configHasProperty( rating ) ) {
		return "";
	}

	return this.presenterConfig[ rating ].screenReaderText;
};

/**
 * Get the indicator full text from the presenter configuration, if it exists.
 * @param {string} rating The rating to check against the config.
 * @returns {string} Translated string containing the full text to be used.
 */
AssessorPresenter.prototype.getIndicatorFullText = function( rating ) {
	if ( !this.configHasProperty( rating ) ) {
		return "";
	}

	return this.presenterConfig[ rating ].fullText;
};

/**
 * Adds a rating based on the numeric score.
 * @param {Object} result Object based on the Assessment result. Requires a score property to work.
 * @returns {Object} The Assessment result object with the rating added.
 */
AssessorPresenter.prototype.resultToRating = function( result ) {
	if ( !isObject( result ) ) {
		return "";
	}

	result.rating = scoreToRating( result.score );

	return result;
};

/**
 * Takes the individual assessment results, sorts and rates them.
 * @returns {Object} Object containing all the individual ratings.
 */
AssessorPresenter.prototype.getIndividualRatings = function() {
	var ratings = {};
	var validResults = this.sort( this.assessor.getValidResults() );
	var mappedResults = validResults.map( this.resultToRating );

	forEach( mappedResults, function( item, key ) {
		ratings[ key ] = this.addRating( item );
	}.bind( this ) );

	return ratings;
};

/**
 * Excludes items from the results that are present in the exclude array.
 * @param {Array} results Array containing the items to filter through.
 * @param {Array} exclude Array of results to exclude.
 * @returns {Array} Array containing items that remain after exclusion.
 */
AssessorPresenter.prototype.excludeFromResults = function( results, exclude ) {
	return difference( results, exclude );
};

/**
 * Sorts results based on their score property and always places items considered to be unsortable, at the top.
 * @param {Array} results Array containing the results that need to be sorted.
 * @returns {Array} Array containing the sorted results.
 */
AssessorPresenter.prototype.sort = function ( results ) {
	var unsortables = this.getUndefinedScores( results );
	var sortables = this.excludeFromResults( results, unsortables );

	sortables.sort( function( a, b ) {
		return a.score - b.score;
	} );

	return unsortables.concat( sortables );
};

/**
 * Returns a subset of results that have an undefined score or a score set to zero.
 * @param {Array} results The results to filter through.
 * @returns {Array} A subset of results containing items with an undefined score or where the score is zero.
 */
AssessorPresenter.prototype.getUndefinedScores = function ( results ) {
	return results.filter( function( result ) {
		return isUndefined( result.score ) || result.score === 0;
	} );
};

/**
 * Creates a rating object based on the item that is being passed.
 * @param {AssessmentResult} item The item to check and create a rating object from.
 * @returns {Object} Object containing a parsed item, including a colored indicator.
 */
AssessorPresenter.prototype.addRating = function( item ) {
	var indicator = this.getIndicator( item.rating );
	indicator.text = item.text;
	indicator.identifier = item.getIdentifier();

	if ( item.hasMarker() ) {
		indicator.marker = item.getMarker();
	}

	return indicator;
};

/**
 * Calculates the overall rating score based on the overall score.
 * @param {Number} overallScore The overall score to use in the calculation.
 * @returns {Object} The rating based on the score.
 */
AssessorPresenter.prototype.getOverallRating = function( overallScore ) {
	var rating = 0;

	if ( this.keyword === "" ) {
		return this.resultToRating( { score: rating } );
	}

	if ( isNumber( overallScore ) ) {
		rating = ( overallScore / 10 );
	}

	return this.resultToRating( { score: rating } );
};

/**
 * Toggles the marker button class depending on its state.
 *
 * @param {HTMLElement} element The element to toggle the class on.
 */
AssessorPresenter.prototype.toggleMarkerClass = function( element ) {
	var markers = document.getElementsByClassName( "assessment-results__mark" );

	// Reset all other items prior to activating the currently active marker.
	forEach( markers, function( marker ) {
		domManipulation.removeClass( marker, "icon-eye-active" );
		domManipulation.addClass( marker, "icon-eye-inactive" );
	} );

	domManipulation.removeClass( element, "icon-eye-inactive" );
	domManipulation.addClass( element, "icon-eye-active" );
};

/**
 * Adds an event listener for the marker button
 *
 * @param {string} identifier The identifier for the assessment the marker belongs to.
 * @param {Function} marker The marker function that can mark the assessment in the text.
 */
AssessorPresenter.prototype.addMarkerEventHandler = function( identifier, marker ) {
	var container = document.getElementById( this.output );
	var markButton = container.getElementsByClassName( "js-assessment-results__mark-" + identifier )[ 0 ];

	markButton.addEventListener( "click", function( event ) {
		this.toggleMarkerClass( event.target );
		marker();
	}.bind( this ) );
};

/**
 * Renders out both the individual and the overall ratings.
 */
AssessorPresenter.prototype.render = function() {
	this.renderIndividualRatings();
	this.renderOverallRating();
};

/**
 * Adds event handlers to the mark buttons
 *
 * @param {Array} scores The list of rendered scores.
 */
AssessorPresenter.prototype.bindMarkButtons = function( scores ) {
	// Make sure the button works for every score with a marker.
	forEach( scores, function ( score ) {
		if ( score.hasOwnProperty( "marker" ) ) {
			this.addMarkerEventHandler( score.identifier, score.marker );
		}
	}.bind( this ) );
};

/**
 * Renders out the individual ratings.
 */
AssessorPresenter.prototype.renderIndividualRatings = function() {
	var outputTarget = document.getElementById( this.output );
	var scores = this.getIndividualRatings();

	outputTarget.innerHTML = template( {
		scores: scores
	} );

	this.bindMarkButtons( scores );
};

/**
 * Renders out the overall rating.
 */
AssessorPresenter.prototype.renderOverallRating = function() {
	var overallRating = this.getOverallRating( this.assessor.calculateOverallScore() );
	var overallRatingElement = document.getElementById( this.overall );

	if ( !overallRatingElement ) {
		return;
	}

	overallRatingElement.className = "overallScore " + this.getIndicatorColorClass( overallRating.rating );
};

module.exports = AssessorPresenter;
