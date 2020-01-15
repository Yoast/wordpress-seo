import urlMethods from "url";

/* Internal dependencies */
import Research from "./Research";

/**
 * Calculates link statistics.
 * E.g. which links a node or its children contains, and whether these links are:
 *  * internal (points to a page in the same domain), external (a page in another domain) or other.
 *  * marked as follow (search engines are allowed to follow this link) or no-follow (search engines are not allowed to follow the link).
 *
 *  @memberOf module:parsedPaper/research
 */
class LinkStatistics extends Research {
	/**
	 * Checks whether the given link is marked for search engines to not follow.
	 *
	 * @param {module:parsedPaper/structure.FormattingElement} linkElement The link to check.
	 *
	 * @returns {boolean} `true` if the link is marked as 'no-follow'.
	 *
	 * @private
	 */
	_isNoFollow( linkElement ) {
		const rel = linkElement.getAttribute( "rel" );

		if ( ! rel ) {
			return false;
		}

		// Check if the `rel` attribute includes "nofollow".
		return rel.split( /\s+/ ).includes( "nofollow" );
	}

	/**
	 * Checks whether the given protocol string is either HTTP or HTTPS.
	 *
	 * @param {String} protocol The protocol string to check.
	 *
	 * @returns {boolean} Whether the protocol is either HTTP or HTTPS.
	 *
	 * @private
	 */
	_isHttp( protocol ) {
		if ( ! protocol ) {
			return false;
		}

		return ( protocol === "http:" || protocol === "https:" );
	}

	/**
	 * Checks whether the given link is:
	 *  * internal: points to a web page in the same domain as the current site.
	 *  * external: points to a web page in another domain as the current site.
	 *  * other: e.g. uses another protocol like `ftp`.
	 *
	 * @param {module:parsedPaper/structure.FormattingElement} linkElement The link to check.
	 * @param {string}                                         domain The domain to check against.
	 *
	 * @returns {"external"|"internal"|"other"} Whether the link points to an external, internal or other web page.
	 *
	 * @private
	 */
	_whichTarget( linkElement, domain ) {
		const link = linkElement.getAttribute( "href" );

		if ( ! link ) {
			return "other";
		}

		const url = urlMethods.parse( link );

		if ( ! this._isHttp( url.protocol ) || url.hash ) {
			return "other";
		}

		if ( url.hostname === domain ) {
			return "internal";
		}

		return "external";
	}

	/**
	 * Returns the permalink from the metadata.
	 *
	 * @param {module:parsedPaper/structure.Node} metadata The metadata to retrieve the permalink from.
	 *
	 * @returns {string} The permalink.
	 *
	 * @private
	 */
	_getPermalink( metadata ) {
		const permalinkElement = metadata.children.find( child => child.tag === "permalink" );
		const paragraph = permalinkElement.children[ 0 ];
		return paragraph.textContainer.text;
	}

	/**
	 * Calculates link statistics for the given node.
	 *
	 * @param {module:parsedPaper/structure.Node} node     The node to calculate the research for.
	 * @param {module:parsedPaper/structure.Node} metadata The document's metadata.
	 *
	 * @returns {Promise<Object[]>} The research results.
	 */
	calculateFor( node, metadata ) {
		// Collect link elements.
		const links = node.textContainer.formatting.filter( element => element.type === "a" );

		// URL of the current page.
		const permalink = this._getPermalink( metadata );
		const url = urlMethods.parse( permalink );

		// Collect statistics about the links.
		const results = links.map( link => {
			const noFollow = this._isNoFollow( link );
			const target = this._whichTarget( link, url.hostname );

			return { link, noFollow, target };
		} );

		return Promise.resolve( results );
	}
}

export default LinkStatistics;
