import RSSParser from "rss-parser";

/**
 * @typedef  {Object}   Feed
 * @property {string}   title                    The title of the website.
 * @property {string}   description              A description of the website.
 * @property {string}   link                     A link to the website.
 * @property {string}   feedUrl                  The URL of the feed.
 * @property {Object[]} entries                  The entries in the feed.
 * @property {string}   entries[].title          The title of the entry.
 * @property {string}   entries[].content        The content of the entry.
 * @property {string}   entries[].contentSnippet A snippet of the content.
 * @property {string}   entries[].link           A link to the entry.
 * @property {string}   entries[].creator        The creator of the entry.
 * @property {string}   entries[].pubDate        The publication date of the entry.
 */

/**
 * Grabs an RSS feed from the requested URL and parses it.
 *
 * @param {string} url      The URL the feed is located at.
 * @param {int}    maxItems The amount of entries you wish returned.
 *
 * @returns {Promise.<Feed>} The retrieved feed.
 */
export function getFeed( url, maxItems ) {
	return new Promise( function( resolve, reject ) {
		RSSParser.parseURL( url, function( err, parsed ) {
			if ( err ) {
				return reject( err );
			}

			parsed.feed.entries = parsed.feed.entries.slice( 0, maxItems );

			return resolve( parsed.feed );
		} );
	} );
}
