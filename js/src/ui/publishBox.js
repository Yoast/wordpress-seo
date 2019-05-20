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
		return wpseoPostScraperL10n.publish_box.labels[ scoreType ][ status ] || "";
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
			id: type + "-score",
		} );

		var spanElem = $( "<span />", {
			"class": scoreDescriptionClass,
			html: createSEOScoreLabel( type, status ),
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
	function initialize() {
		var notAvailableStatus = "na";
		const $adminbar = $( "#wpadminbar" );

		if ( wpseoPostScraperL10n.contentAnalysisActive === "1" ) {
			createScoresInPublishBox( "content", notAvailableStatus );
		}

		if ( wpseoPostScraperL10n.keywordAnalysisActive === "1" ) {
			createScoresInPublishBox( "keyword", notAvailableStatus );
		}

		$( "#content-score" ).click( function( event ) {
			event.preventDefault();
			const $readabilityCollapsible = $( "#yoast-readability-analysis-collapsible-metabox" );
			/*
 			 * The adminbar height depends on the viewport width. Because people can change the viewport width whenever
 			 * they want, we check the adminbar height within each of the .click functions.
 			 */
			const adminbarHeight = $adminbar.css( "position" ) === "fixed" ? $adminbar.height() : 0;

			$( [ document.documentElement, document.body ] ).animate( {
				scrollTop: $readabilityCollapsible.offset().top - adminbarHeight,
			}, 1000 );

			// Move focus to the collapsible.
			$readabilityCollapsible.focus();

			// The content of the analysis is a sibling of the h2 in the collapsible.
			const $h2 = $readabilityCollapsible.parent();

			// If the sibling is not there, the collapsible is collapsed, so we should open it.
			if ( $h2.siblings().length === 0 ) {
				$readabilityCollapsible.click();
			}
		} );

		$( "#keyword-score" ).click( function( event ) {
			event.preventDefault();
			const $seoCollapsible = $( "#yoast-seo-analysis-collapsible-metabox" );
			/*
			 * The adminbar height depends on the viewport width. Because people can change the viewport width whenever
			 * they want, we check the adminbar height within each of the .click functions.
			 */
			const adminbarHeight = $adminbar.css( "position" ) === "fixed" ? $adminbar.height() : 0;

			$( [ document.documentElement, document.body ] ).animate( {
				scrollTop: $seoCollapsible.offset().top - adminbarHeight,
			}, 1000 );

			// Move focus to the collapsible.
			$seoCollapsible.focus();

			// The content of the analysis is a sibling of the h2 in the collapsible.
			const $h2 = $seoCollapsible.parent();

			// If the sibling is not there, the collapsible is collapsed, so we should open it.
			if ( $h2.siblings().length === 0 ) {
				$seoCollapsible.click();
			}
		} );
	}

	module.exports = {
		initialize: initialize,
		updateScore: updateScoreInPublishBox,
	};
}( jQuery ) );
