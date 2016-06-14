$ = jQuery;

/**
 * Updates the traffic light present on the page
 *
 * @param {Object} indicator The indicator for the keyword score.
 */
function updateAdminBar( indicator ) {
	$( '.adminbar-seo-score' )
		.attr( 'class', 'wpseo-score-icon adminbar-seo-score ' + indicator.className )
		.attr( 'alt', indicator.screenReaderText );
}

module.exports = {
	update: updateAdminBar
};
