/**
 * @typedef  {Object}     Feed
 * @property {string}     title       The title of the website.
 * @property {string}     description A description of the website.
 * @property {string}     link        A link to the website.
 * @property {FeedItem[]} items     The items in the feed.
 */

/**
 * @typedef  {Object} FeedItem
 * @property {string} title       The title of the item.
 * @property {string} content     The content of the item, will be HTML encoded.
 * @property {string} description A summary of the content, will be HTML encoded.
 * @property {string} link        A link to the item.
 * @property {string} creator     The creator of the item.
 * @property {string} date        The publication date of the item.
 */

/**
 * Returns the string contents of the given xpath query on the provided document.
 *
 * @param {string}          xpath      The xpath query to run.
 * @param {Document}        document   A parsed XML document.
 * @param {Node}            context    A Node in the document to use as context for the query.
 * @param {XPathNSResolver} nsResolver A namespace resolver for the parsed document.
 *
 * @returns {string|undefined} The string result of the xpath query.
 */
function getXPathText( xpath, document, context = null, nsResolver = null ) {
	const result = document.evaluate( xpath, ( context || document ), nsResolver, XPathResult.STRING_TYPE, null );

	if ( result.stringValue ) {
		return result.stringValue;
	}

	// eslint-disable-next-line no-undefined
	return undefined;
}

/**
 * Returns the feed meta from a parsed Feed.
 *
 * @param {Document} parsed A parsed XML document.
 *
 * @returns {Feed} A Feed object containing only the meta attributes.
 */
function getFeedMeta( parsed ) {
	const result = {};

	result.title       = getXPathText( "/rss/channel/title", parsed );
	result.description = getXPathText( "/rss/channel/description", parsed );
	result.link        = getXPathText( "/rss/channel/link", parsed );

	return result;
}

/**
 * Returns a single feed item from a snapshot.
 *
 * @param {Document}        parsed     A parsed XML document.
 * @param {Node}            snapshot   A snapshot returned from the snapshotItem method of a XPathResult.
 * @param {XPathNSResolver} nsResolver A namespace resolver for the parsed document.
 *
 * @returns {FeedItem} The FeedItem representing the provided snapshot.
 */
function getFeedItem( parsed, snapshot, nsResolver ) {
	const item     = {};

	item.title       = getXPathText( "child::title", parsed, snapshot );
	item.link        = getXPathText( "child::link", parsed, snapshot );
	item.content     = getXPathText( "child::content:encoded", parsed, snapshot, nsResolver );
	item.description = getXPathText( "child::description", parsed, snapshot );
	item.creator     = getXPathText( "child::dc:creator", parsed, snapshot, nsResolver );
	item.date        = getXPathText( "child::pubDate", parsed, snapshot );

	return item;
}

/**
 * Returns a ORDERED_NODE_SNAPSHOT_TYPE XpathResult for the given xpath query on the provided document.
 *
 * @param {string}          xpath      The xpath query to run.
 * @param {Document}        document   A parsed XML document.
 * @param {Node}            context    A Node in the document to use as context for the query.
 * @param {XPathNSResolver} nsResolver A namespace resolver for the parsed document.
 *
 * @returns {XPathResult} The result of the xpath query.
 */
function getXPathSnapshots( xpath, document, context = null, nsResolver = null ) {
	return document.evaluate( xpath, ( context || document ), nsResolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
}

/**
 * Returns the feed items from a parsed Feed.
 *
 * @param {Document}        parsed     A parsed XML document.
 * @param {XPathNSResolver} nsResolver A namespace resolver for the parsed document.
 * @param {number}          maxItems   The maximum amount of items to return, 0 for all items.
 *
 * @returns {FeedItem[]} An array of FeedItem objects.
 */
function getFeedItems( parsed, nsResolver, maxItems ) {
	const snapshots = getXPathSnapshots( "/rss/channel/item", parsed );
	let count     = snapshots.snapshotLength;
	const items     = [];

	if ( maxItems !== 0 ) {
		count = Math.min( count, maxItems );
	}

	for ( let i = 0; i < count; i++ ) {
		const snapshot = snapshots.snapshotItem( i );
		items.push( getFeedItem( parsed, snapshot, nsResolver ) );
	}

	return items;
}

/**
 * Parses a RSS Feed.
 *
 * @param {string} raw      The raw XML of the feed.
 * @param {number} maxItems The maximum amount of items to parse, 0 for all items.
 *
 * @returns {Promise.<Feed>} A promise which resolves with the parsed Feed.
 */
export function parseFeed( raw, maxItems = 0 ) {
	return new Promise( function( resolve, reject ) {
		try {
			const parser     = new DOMParser();
			const parsed     = parser.parseFromString( raw, "application/xml" );
			const nsResolver = parsed.createNSResolver( parsed.documentElement );

			const result   = getFeedMeta( parsed );
			result.items = getFeedItems( parsed, nsResolver, maxItems );

			resolve( result );
		} catch ( error ) {
			reject( error );
		}
	} );
}

/**
 * Grabs an RSS feed from the requested URL and parses it.
 *
 * @param {string} url      The URL the feed is located at.
 * @param {int}    maxItems The amount of items you wish returned, 0 for all items.
 *
 * @returns {Promise.<Feed>} The retrieved feed.
 */
export default function getFeed( url, maxItems = 0 ) {
	return fetch( url ).then( function( response ) {
		return response.text();
	} ).then( function( raw ) {
		return parseFeed( raw, maxItems );
	} );
}
