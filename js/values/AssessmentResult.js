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
 * @param item
 * @returns {*}
 */
var resultInRange = function( result, item ) {
    if ( item.hasOwnProperty( "range" ) ) {
        return inRange( result, item.range[0], item.range[1] );
    }

    return inRange( result, item.min, item.max );
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
 * @param scoreConfiguration
 * @constructor
 */
var AssessmentResult = function( score, scoreConfiguration ) {
    this.score = score;
    this.configuration = scoreConfiguration;

    if ( isUndefined( scoreConfiguration ) ) {
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
        if ( hasRange( entries[i] ) && resultInRange( this.score, entries[i] ) ) {
            return this.getResultObject( entries[i], this.configuration.replacements );
        }

        if ( hasMinimum( entries[i] ) && this.score > entries[i].min ) {
            return this.getResultObject( entries[i], this.configuration.replacements );
        }

        if ( hasMaximum( entries[i] ) ) {
            return this.getResultObject( entries[i], this.configuration.replacements );
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
        result.text = result.text.replace( "%%result%%", this.score );
    }

    return result;
};

module.exports = AssessmentResult;
