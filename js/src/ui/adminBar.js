/**
 * Updates the admin bar for the page.
 *
 * @param {Object} indicator The indicator for the keyword score.
 * @param {string} keyword The focus keyphrase for the post.
 *
 * @returns {void}
 */
function updateAdminBar( indicator, keyword ) {
	// Updates the traffic light
	jQuery( ".adminbar-seo-score" )
		.attr( "class", "wpseo-score-icon adminbar-seo-score " + indicator.className )
		.find( ".adminbar-seo-score-text" ).text( indicator.screenReaderText );

	// Updates the focus keyhprase in the menu
	const keywordMenuElement = jQuery( "#wp-admin-bar-wpseo-focus-keyphrase" );

	if ( keyword === "" ) {
		keywordMenuElement.hide();
	}

	if ( keyword !== "" && typeof keyword !== "undefined" ) {
		keywordMenuElement
			.show()
			.find( ".wpseo-focus-keyphrase-ab-item" ).text( keyword );
	}
}

module.exports = {
	update: updateAdminBar,
};
