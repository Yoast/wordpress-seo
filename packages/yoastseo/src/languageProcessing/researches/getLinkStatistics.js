import checkNofollow from "../helpers/link/checkNofollow.js";
import getAnchors from "../helpers/link/getAnchorsFromText.js";
import getLinkType from "../helpers/link/getLinkType.js";
import removeHtmlBlocks from "../../languageProcessing/helpers/html/htmlParser";

/**
 * @typedef {import("../../values/").Paper } Paper
 */

/**
 * @typedef LinkStatistics
 * @type {object}
 * @property {number} total The total number of links found.
 * @property {number} internalTotal The total number of links that are internal.
 * @property {number} internalDofollow The internal links without a nofollow attribute.
 * @property {number} internalNofollow The internal links with a nofollow attribute.
 * @property {number} externalTotal The total number of links that are external.
 * @property {number} externalDofollow The external links without a nofollow attribute.
 * @property {number} externalNofollow The external links with a nofollow attribute.
 * @property {number} otherTotal All links that are not HTTP or HTTPS.
 * @property {number} otherDofollow Other links without a nofollow attribute.
 * @property {number} otherNofollow Other links with a nofollow attribute.
 */

/**
 * Counts the links found in the text.
 *
 * @param {Paper} paper The paper object containing text, keyword and url.
 *
 * @returns {LinkStatistics} The object containing all link types.
 */
export default function( paper ) {
	// We remove HTML blocks that should be ignored.
	const filteredText = removeHtmlBlocks( paper.getText() );
	const anchors = getAnchors( filteredText );
	/*
	 * We get the site's URL (e.g., https://yoast.com) or domain (e.g., yoast.com) from the paper.
	 * In case of WordPress, the variable is a URL. In case of Shopify, it is a domain.
	 */
	const siteUrlOrDomain = paper.getPermalink();

	const linkCount = {
		total: anchors.length,
		internalTotal: 0,
		internalDofollow: 0,
		internalNofollow: 0,
		externalTotal: 0,
		externalDofollow: 0,
		externalNofollow: 0,
		otherTotal: 0,
		otherDofollow: 0,
		otherNofollow: 0,
	};

	for ( let i = 0; i < anchors.length; i++ ) {
		const currentAnchor = anchors[ i ];

		const linkType = getLinkType( currentAnchor, siteUrlOrDomain );
		const linkFollow = checkNofollow( currentAnchor );

		linkCount[ linkType + "Total" ]++;
		linkCount[ linkType + linkFollow ]++;
	}

	return linkCount;
}
