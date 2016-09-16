/**
 * Updates the traffic light present on the page
 *
 * @param {Object} indicator The indicator for the keyword score.
 *
 * @returns {void}
 */
function updateAdminBar( indicator ) {
	jQuery( ".adminbar-seo-score" )
		.attr( "class", "wpseo-score-icon adminbar-seo-score " + indicator.className )
		.find( ".adminbar-seo-score-text" ).text( indicator.screenReaderText );
}

module.exports = {
	update: updateAdminBar,
};
