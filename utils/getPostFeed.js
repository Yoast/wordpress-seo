import getFeed, { getXPathText } from "./getFeed";

/**
 * Returns a single feed item from a snapshot.
 *
 * @param {Document}        parsed     A parsed XML document.
 * @param {Node}            snapshot   A snapshot returned from the snapshotItem method of a XPathResult.
 * @param {XPathNSResolver} nsResolver A namespace resolver for the parsed document.
 *
 * @returns {FeedItem} The FeedItem representing the provided snapshot.
 */
export function parseFeedItem( parsed, snapshot, nsResolver ) {
	const item = {};

	item.title       = getXPathText( "child::title", parsed, snapshot );
	item.link        = getXPathText( "child::link", parsed, snapshot );
	item.content     = getXPathText( "child::content:encoded", parsed, snapshot, nsResolver );
	item.description = getXPathText( "child::description", parsed, snapshot );
	item.creator     = getXPathText( "child::dc:creator", parsed, snapshot, nsResolver );
	item.date        = getXPathText( "child::pubDate", parsed, snapshot );
	item.image       = getXPathText( "child::content:image", parsed, snapshot, nsResolver );
	item.shopUrl     = getXPathText( "child::content:shop_url", parsed, snapshot, nsResolver );
	item.id          = getXPathText( "child::content:slug", parsed, snapshot, nsResolver );

	return item;
}

/**
 *
 * @param url
 * @param maxItems
 * @returns {Promise<Feed>}
 */
export default function getPostFeed( url, maxItems ) {
	return getFeed( url, maxItems, parseFeedItem );
}
