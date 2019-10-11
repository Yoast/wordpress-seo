/**
 * Decrement current category count by one.
 *
 * @deprecated 12.5
 *
 * @param {string} category The category count to update.
 *
 * @returns {void}
 */
function wpseoUpdateCategoryCount( category ) {
	console.error( "This function is deprecated since WPSEO 12.5" );
}

/**
 * Sends the request to mark the given url as fixed.
 *
 * @deprecated 12.5
 *
 * @param {string} nonce    The nonce for the request
 * @param {string} platform The platform to mark the issue for.
 * @param {string} category The category to mark the issue for.
 * @param {string} url      The url to mark as fixed.
 *
 * @returns {void}
 */
function wpseoSendMarkAsFixed( nonce, platform, category, url ) {
	console.error( "This function is deprecated since WPSEO 12.5" );
}

/**
 * Marks a search console crawl issue as fixed.
 *
 * @deprecated 12.5
 *
 * @param {string} url The URL that has been fixed.
 *
 * @returns {void}
 */
function wpseoMarkAsFixed( url ) {
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
