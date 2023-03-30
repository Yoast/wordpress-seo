import checkNofollow from "../helpers/link/checkNofollow.js";
import getAnchors from "../helpers/link/getAnchorsFromText.js";
import getLinkType from "../helpers/link/getLinkType.js";

/**
 * Counts the links found in the text.
 *
 * @param {Paper} paper The paper object containing text, keyword and url.
 *
 * @returns {object} The object containing all linktypes.
 * total: the total number of links found.
 * internalTotal: the total number of links that are internal.
 * internalDofollow: the internal links without a nofollow attribute.
 * internalNofollow: the internal links with a nofollow attribute.
 * externalTotal: the total number of links that are external.
 * externalDofollow: the external links without a nofollow attribute.
 * externalNofollow: the internal links with a dofollow attribute.
 * otherTotal: all links that are not HTTP or HTTPS.
 * otherDofollow: other links without a nofollow attribute.
 * otherNofollow: other links with a nofollow attribute.
 */
export default function( paper ) {
	const anchors = getAnchors( paper.getText() );
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
