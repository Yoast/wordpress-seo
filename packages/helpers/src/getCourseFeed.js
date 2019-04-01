import getFeed, { getXPathText } from "./getFeed";

/**
 * @typedef  {Object} CourseFeedItem
 * @property {string} id      The id of the course.
 * @property {string} title   The title of the course.
 * @property {string} link    A link to the page of the course on yoast.com.
 * @property {string} content Short information on the course, will be HTML encoded.
 * @property {string} image   A link the the header image for the course.
 * @property {string} shopUrl A link, placing the course in the user's cart on yoast.com.
 * @property {string} banner  ( Optional ) Text for the banner over the card.
 */

/**
 * Returns a single course feed item from a snapshot.
 *
 * @param {Document}        parsed     A parsed XML document.
 * @param {Node}            snapshot   A snapshot returned from the snapshotItem method of a XPathResult.
 * @param {XPathNSResolver} nsResolver A namespace resolver for the parsed document.
 *
 * @returns {CourseFeedItem} The CourseFeedItem representing the provided snapshot.
 */
function parseCourseFeedItem( parsed, snapshot, nsResolver ) {
	const item = {};

	item.id                  = getXPathText( "child::content:slug", parsed, snapshot, nsResolver );
	item.title               = getXPathText( "child::title", parsed, snapshot );
	item.link                = getXPathText( "child::link", parsed, snapshot );
	item.content             = getXPathText( "child::content:encoded", parsed, snapshot, nsResolver );
	item.image               = getXPathText( "child::content:image", parsed, snapshot, nsResolver );
	item.ctaButtonCopy       = getXPathText( "child::content:cta_button_copy", parsed, snapshot, nsResolver );
	item.ctaButtonType       = getXPathText( "child::content:cta_button_type", parsed, snapshot, nsResolver );
	item.ctaButtonUrl        = getXPathText( "child::content:cta_button_url", parsed, snapshot, nsResolver );
	item.readMoreLinkText    = getXPathText( "child::content:read_more_link_text", parsed, snapshot, nsResolver );
	item.isFree              = getXPathText( "child::content:is_free", parsed, snapshot, nsResolver );
	item.isBundle            = getXPathText( "child::content:is_bundle", parsed, snapshot, nsResolver );

	return item;
}

/**
 * Grabs the RSS feed from the requested URL and parses the items required for the course overview.
 *
 * @param {string}   url           The feed location.
 * @param {int}      maxItems      The amount of items you wish returned, 0 for all items.
 *
 * @returns {Promise.<Feed>} The retrieved feed.
 */
export default function getCourseFeed( url, maxItems ) {
	return getFeed( url, maxItems, parseCourseFeedItem );
}
