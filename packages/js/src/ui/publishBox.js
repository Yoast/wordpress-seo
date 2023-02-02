/* global wpseoScriptData */
import { get } from "lodash";

var scoreDescriptionClass = "score-text";
var imageScoreClass = "image yoast-logo svg";
var $ = jQuery;

/**
 * Creates a text with the label and description for a seo score.
 *
 * @param {String} scoreType The type of score, this is used for the label.
 * @param {String} status The status for the score, this is the descriptive status text.
 * @param {Object|null} [labels] The score labels, instead of using the free script data.
 *
 * @returns {String} A string with label and description with correct text decoration.
 */
function createSEOScoreLabel( scoreType, status, labels = null ) {
	if ( labels !== null ) {
		return get( labels, status, "" );
	}
	return get( wpseoScriptData, `metabox.publish_box.labels.${ scoreType }.${ status }`, "" );
}

/**
 * Updates a score type in the publish box.
 *
 * @param {String} type The score type to update (content or seo).
 * @param {String} status The status is the class name that is used to update the image.
 * @param {Object|null} [labels] The score labels, instead of using the free script data.
 *
 * @returns {void}
 */
export function updateScore( type, status, labels = null ) {
	var publishSection = $( "#" + type + "-score" );

	var imageClass = imageScoreClass + " " + status;
	publishSection.children( ".image" ).attr( "class", imageClass );

	var text = createSEOScoreLabel( type, status, labels );
	publishSection.children( "." + scoreDescriptionClass ).html( text );
}

/**
 * Creates a new item in the publish box for an yoast-seo score.
 *
 * @param {String} type The score type, for example content score or keyword score.
 * @param {String} status The status for the score initialisation.
 * @param {Object|null} [labels] The score labels, instead of using the free script data.
 *
 * @returns {void}
 */
export function createScoresInPublishBox( type, status, labels = null ) {
	const publishSection = $( "<div />", {
		"class": "misc-pub-section yoast yoast-seo-score " + type + "-score",
		id: type + "-score",
	} );

	const spanElem = $( "<span />", {
		"class": scoreDescriptionClass,
		html: createSEOScoreLabel( type, status, labels ),
	} );

	const imgElem = $( "<span>" )
		.attr( "class", imageScoreClass + " na" );

	publishSection.append( imgElem ).append( spanElem );
	$( "#yoast-seo-publishbox-section" ).append( publishSection );
}

/**
 * Scrolls to metabox collapsible and opens it when closed.
 *
 * @param {string} id Metabox collapsible id.
 *
 * @returns {void}
 */
export function scrollToCollapsible( id ) {
	const $adminbar = $( "#wpadminbar" );
	const $collapsible = $( id );

	if ( ! $adminbar || ! $collapsible ) {
		return;
	}

	// The adminbar height depends on the viewport width.
	const adminbarHeight = $adminbar.css( "position" ) === "fixed" ? $adminbar.height() : 0;

	$( [ document.documentElement, document.body ] ).animate( {
		scrollTop: $collapsible.offset().top - adminbarHeight,
	}, 1000 );

	// Move focus to the collapsible.
	$collapsible.trigger( "focus" );

	// The content of the analysis is a sibling of the h2 in the collapsible.
	const $h2 = $collapsible.parent();

	// If the sibling is not there, the collapsible is collapsed, so we should open it.
	if ( $h2.siblings().length === 0 ) {
		$collapsible.trigger( "click" );
	}
}

/**
 * Initializes the publish box score indicators.
 *
 * @returns {void}
 */
export function initialize() {
	var notAvailableStatus = "na";

	if ( wpseoScriptData.metabox.keywordAnalysisActive ) {
		createScoresInPublishBox( "keyword", notAvailableStatus );
	}

	if ( wpseoScriptData.metabox.contentAnalysisActive ) {
		createScoresInPublishBox( "content", notAvailableStatus );
	}

	if ( wpseoScriptData.metabox.inclusiveLanguageAnalysisActive ) {
		createScoresInPublishBox( "inclusive-language", notAvailableStatus );
	}

	// Target only the link and use event delegation, as this link doesn't exist on dom ready yet.
	$( "#content-score" ).on( "click", "[href='#yoast-readability-analysis-collapsible-metabox']", function( event ) {
		event.preventDefault();

		// Pretend to click on the readability tab to make it focused.
		document.querySelector( "#wpseo-meta-tab-readability" ).click();

		scrollToCollapsible( "#wpseo-meta-section-readability" );
	} );

	// Target only the link and use event delegation, as this link doesn't exist on dom ready yet.
	$( "#keyword-score" ).on( "click", "[href='#yoast-seo-analysis-collapsible-metabox']", function( event ) {
		event.preventDefault();

		// Pretend to click on the SEO tab to make it focused.
		document.querySelector( "#wpseo-meta-tab-content" ).click();

		scrollToCollapsible( "#yoast-seo-analysis-collapsible-metabox" );
	} );

	// Target only the link and use event delegation, as this link doesn't exist on dom ready yet.
	$( "#inclusive-language-score" ).on( "click", "[href='#yoast-inclusive-language-analysis-collapsible-metabox']", function( event ) {
		event.preventDefault();

		// Pretend to click on the inclusive language tab to make it focused.
		document.querySelector( "#wpseo-meta-tab-inclusive-language" ).click();

		scrollToCollapsible( "#wpseo-meta-section-inclusive-language" );
	} );
}
