/**
 * Updates the admin bar for the page.
 *
 * @param {Object} indicator The indicator for the keyword score.
 * @param {string} keyword   The focus keyphrase for the post.
 *
 * @returns {void}
 */
function updateAdminBar( indicator, keyword ) {
	// Updates the traffic light
	jQuery( ".adminbar-seo-score" )
		.attr( "class", "wpseo-score-icon adminbar-seo-score " + indicator.className )
		.find( ".adminbar-seo-score-text" ).text( indicator.screenReaderText );

	const keywordHeading     = jQuery( "#wp-admin-bar-wpseo-focus-keyphrase-heading" );
	const keywordMenuElement = jQuery( "#wp-admin-bar-wpseo-focus-keyphrase" );

	// Updates the focus keyphrase in the menu
	keywordMenuElement.find( ".wpseo-focus-keyphrase-ab-item" ).text( keyword );

	if ( keyword === "" ) {
		const notSetText = keywordHeading.find( ".wpseo-focus-keyphrase-is-not-set-text" ).text();
		keywordHeading.find( ".ab-item" ).text( notSetText );
		keywordMenuElement.hide();
	}

	if ( keyword !== "" && typeof keyword !== "undefined" ) {
		const setText = keywordHeading.find( ".wpseo-focus-keyphrase-is-set-text" ).text();
		keywordHeading.find( ".ab-item" ).text( setText );
		keywordMenuElement.show();
	}
}

module.exports = {
	update: updateAdminBar,
};
