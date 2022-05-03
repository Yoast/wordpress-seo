import getFeed, { getXPathText } from "./getFeed";

/**
 * @typedef  {Object} PostFeedItem
 * @property {string} title       The title of the item.
 * @property {string} content     The content of the item, will be HTML encoded.
 * @property {string} description A summary of the content, will be HTML encoded.
 * @property {string} link        A link to the item.
 * @property {string} creator     The creator of the item.
 * @property {string} date        The publication date of the item.
 */

/**
 * Returns a single post feed item from a snapshot.
 *
 * @param {Document}        parsed     A parsed XML document.
 * @param {Node}            snapshot   A snapshot returned from the snapshotItem method of a XPathResult.
 * @param {XPathNSResolver} nsResolver A namespace resolver for the parsed document.
 *
 * @returns {PostFeedItem} The PostFeedItem representing the provided snapshot.
 */
export function parseFeedItem( parsed, snapshot, nsResolver ) {
	const item = {};

	item.title       = getXPathText( "child::title", parsed, snapshot );
	item.link        = getXPathText( "child::link", parsed, snapshot );
	item.content     = getXPathText( "child::content:encoded", parsed, snapshot, nsResolver );
	item.description = getXPathText( "child::description", parsed, snapshot );
	item.creator     = getXPathText( "child::dc:creator", parsed, snapshot, nsResolver );
	item.date        = getXPathText( "child::pubDate", parsed, snapshot );

	return item;
}

/**
 * Grabs the RSS feed from the requested URL and parses the items required for the Post overview in the dashboard.
 *
 * @param {string}   url           The URL the feed is located at.
 * @param {int}      maxItems      The amount of items you wish returned, 0 for all items.
 *
 * @returns {Promise.<Feed>} The retrieved feed.
 */
export default function getPostFeed( url, maxItems ) {
	return getFeed( url, maxItems, parseFeedItem );
}
