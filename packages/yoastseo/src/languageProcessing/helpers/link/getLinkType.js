/** @module stringProcess/getLinkType */

import urlHelper from "../url/url";

/**
 * Determines the type of link.
 *
 * @param {string} 	anchor 				String with anchor element.
 * @param {string} 	siteUrlOrDomain		URL or domain to match against.
 *
 * @returns {string} The link type (other, external or internal).
 */
export default function( anchor, siteUrlOrDomain ) {
	const anchorUrl = urlHelper.getFromAnchorTag( anchor );

	/**
	 * A link is "Other" if:
	 * - The protocol is neither null, nor http, nor https.
	 * - The link is a relative fragment URL (starts with #), because it won't navigate to another page.
	 */
	const protocol = urlHelper.getProtocol( anchorUrl );
	if ( protocol && ! urlHelper.protocolIsHttpScheme( protocol ) ||
		urlHelper.isRelativeFragmentURL( anchorUrl ) ) {
		return "other";
	}

	if ( urlHelper.isInternalLink( anchorUrl, siteUrlOrDomain ) ) {
		return "internal";
	}

	return "external";
}
