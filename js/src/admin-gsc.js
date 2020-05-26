/**
 * Decrement current category count by one.
 *
 * @deprecated 12.5
 *
 * @returns {void}
 */
function wpseoUpdateCategoryCount() {
	console.error( "This function is deprecated since WPSEO 12.5" );
}

/**
 * Sends the request to mark the given url as fixed.
 *
 * @deprecated 12.5
 *
 * @returns {void}
 */
function wpseoSendMarkAsFixed() {
	console.error( "This function is deprecated since WPSEO 12.5" );
}

/**
 * Marks a search console crawl issue as fixed.
 *
 * @deprecated 12.5
 *
 * @returns {void}
 */
function wpseoMarkAsFixed() {
	console.error( "This function is deprecated since WPSEO 12.5" );
}

window.wpseoUpdateCategoryCount = wpseoUpdateCategoryCount;
window.wpseoMarkAsFixed = wpseoMarkAsFixed;
window.wpseoSendMarkAsFixed = wpseoSendMarkAsFixed;

/* eslint-disable camelcase */
window.wpseo_update_category_count = wpseoUpdateCategoryCount;
window.wpseo_mark_as_fixed = wpseoMarkAsFixed;
window.wpseo_send_mark_as_fixed = wpseoSendMarkAsFixed;
/* eslint-enable camelcase */
