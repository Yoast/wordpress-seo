var inRange = require( "lodash/number/inRange" );
var isUndefined = require( "lodash/lang/isUndefined" );
var replaceAll = require( "../helpers/replaceAll.js" );

/**
 * Check whether the current item can be seen as a range.
 * @param item
 * @returns {boolean}
 */
var hasRange = function( item ) {
    return item.hasOwnProperty( "range" ) || ( item.hasOwnProperty( "min" ) && item.hasOwnProperty( "max" ) );
};

/**
 * Check whether the result falls within a certain range.
 * @param result
 * @param entry
 * @returns {*}
 */
var entryInRange = function( entry, result ) {
    if ( entry.hasOwnProperty( "range" ) ) {
        return inRange( result, entry.range[0], entry.range[1] );
    }

    return inRange( result, entry.min, entry.max );
};

/**
 * Check whether only a min property is available.
 * @param item
 * @returns {boolean}
 */
var hasMinimum = function( item ) {
    return ( item.hasOwnProperty( "min" ) && !item.hasOwnProperty( "max" ) );
};

/**
 * Check whether only a max property is available.
 * @param item
 * @returns {boolean}
 */
var hasMaximum = function( item ) {
    return ( !item.hasOwnProperty( "min" ) && item.hasOwnProperty( "max" ) );
};

/**
 * Construct the AssessmentResult object.
 * @param score
 * @param analysisConfiguration
 * @constructor
 */
var AssessmentResult = function( analysisResult, analysisConfiguration ) {
    this.analysisResult = analysisResult;
    this.configuration = analysisConfiguration;

    if ( isUndefined( analysisConfiguration ) ) {
        return;
    }

    return this.retrieveAssesmentResultScore();
};

/**
 * Retrieve the actual result.
 */
AssessmentResult.prototype.retrieveAssesmentResultScore = function() {
    var entries = this.configuration.scoreArray;

    for ( var i = 0; i < entries.length; i++ ) {

        var entry = entries[i];

        if ( hasRange( entry ) && entryInRange( entry, this.analysisResult ) ) {
            return this.getResultObject( entry, this.configuration.replacements );
        }

        if ( hasMinimum( entry ) && this.analysisResult > entry.min ) {
            return this.getResultObject( entry, this.configuration.replacements );
        }

        if ( hasMaximum( entry ) ) {
            return this.getResultObject( entry, this.configuration.replacements );
        }
    }
};

/**
 * Get a formatted result object.
 * @param entry
 * @param replacements
 */
AssessmentResult.prototype.getResultObject = function( entry, replacements ) {
    return this.formatResultMessage( { "score":  entry.score, "text":  entry.text }, replacements );
};

/**
 * Format the result message.
 * @param result
 * @param replacements
 * @returns {*}
 */
AssessmentResult.prototype.formatResultMessage = function( result, replacements ) {
    if ( isUndefined( replacements ) ) {
        return result;
    }

    result.text = replaceAll( result.text, replacements );

    // If there's a placeholder, replace that with the actual result value
    if ( result.text.indexOf( "%%result%%" ) > -1 ) {
        result.text = result.text.replace( "%%result%%", this.analysisResult );
    }

    return result;
};

module.exports = AssessmentResult;
