/* global wpseoPostScraperL10n */

var scoreDescriptionClass = "score-text";
var imageScoreClass = "image yoast-logo svg";

( function( $ ) {
	/* eslint-disable no-extend-native */
	/**
	 * Converts the first letter to uppercase in a string.
	 *
	 * @returns {string} The string with the first letter uppercased.
	 */
	String.prototype.ucfirst = function() {
		return this.charAt( 0 ).toUpperCase() + this.substr( 1 );
	};
	/* eslint-enable no-extend-native */

	/**
	 * Creates a text with the label and description for a seo score.
	 *
	 * @param {String} scoreType The type of score, this is used for the label.
	 * @param {String} status The status for the score, this is the descriptive status text.
	 * @returns {String} A string with label and description with correct text decoration.
	 */
	function createSEOScoreLabel( scoreType, status ) {
		var label =  wpseoPostScraperL10n.publish_box.labels[ scoreType ] || "";
		status = wpseoPostScraperL10n.publish_box.statuses[ status ] || "";

		return label + ": <strong>" + status + "</strong>";
	}

	/**
	 * Updates a score type in the publish box.
	 *
	 * @param {String} type The score type to update (content or seo).
	 * @param {String} status The status is the class name that is used to update the image.
	 *
	 * @returns {void}
	 */
	function updateScoreInPublishBox( type, status ) {
		var publishSection = $( "#" + type + "-score" );

		var imageClass = imageScoreClass + " " + status;
		publishSection.children( ".image" ).attr( "class", imageClass );

		var text = createSEOScoreLabel( type, status );
		publishSection.children( "." + scoreDescriptionClass ).html( text );
	}

	/**
	 * Creates a new item in the publish box for an yoast-seo score.
	 *
	 * @param {String} type The score type, for example content score or keyword score.
	 * @param {String} status The status for the score initialisation.
	 *
	 * @returns {void}
	 */
	function createScoresInPublishBox( type, status ) {
		var publishSection = $( "<div />", {
			"class": "misc-pub-section yoast yoast-seo-score " + type + "-score",
			"id": type + "-score",
		} );

		var spanElem = $( "<span />", {
			"class": scoreDescriptionClass,
			"html": createSEOScoreLabel( type, status ),
		} );

		var imgElem = $( "<span>" )
			.attr( "class", imageScoreClass + " na" );

		publishSection.append( imgElem ).append( spanElem );
		$( "#misc-publishing-actions" ).append( publishSection );
	}

	/**
	 * Initializes the publish box score indicators.
	 *
	 * @returns {void}
	 */
	function initialise() {
		var notAvailableStatus = "na";

		if ( wpseoPostScraperL10n.contentAnalysisActive === "1" ) {
			createScoresInPublishBox( "content", notAvailableStatus );
		}

		if ( wpseoPostScraperL10n.keywordAnalysisActive === "1" ) {
			createScoresInPublishBox( "keyword", notAvailableStatus );
		}
	}

	module.exports = {
		initalise: initialise,
		updateScore: updateScoreInPublishBox,
	};
}( jQuery ) );
