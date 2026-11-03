const protocolRegex = /^([a-z0-9.+-]+:)/i;
// Like `url.parse()`, only a URL with two slashes after the protocol (or a protocol-relative URL) has a hostname.
const authorityRegex = /^(?:[a-z0-9.+-]+:)?[/\\]{2}([^/\\?#]+)/i;

/**
 * Gets the lowercase hostname of a URL that has two slashes after the protocol, or is protocol-relative.
 *
 * @param {string}  url                The trimmed URL.
 * @param {boolean} isProtocolRelative Whether the URL starts with `//`.
 *
 * @returns {string|null} The hostname, or `null` if the URL has no hostname.
 */
function parseHostname( url, isProtocolRelative ) {
	const authorityMatch = authorityRegex.exec( url );
	if ( ! authorityMatch ) {
		return null;
	}

	let hostname;
	try {
		// A protocol-relative URL needs a protocol to be parsed by the URL API.
		hostname = new URL( isProtocolRelative ? "http:" + url : url ).hostname;
	} catch ( e ) {
		// Keep the raw host of an invalid URL, so a broken link is not treated as internal.
		hostname = authorityMatch[ 1 ];
	}

	return hostname.toLowerCase() || null;
}

/**
 * Parses a URL with the WHATWG `URL` API and returns the parts that the analysis uses.
 *
 * Replaces Node's legacy `url.parse()`, so we don't bundle the `url` polyfill. Like `url.parse()`, it never throws:
 * relative and bare-domain URLs get a `null` hostname. The protocol and hash are read from the string,
 * the same way `url.parse()` does.
 *
 * @param {string}  url                       The URL to parse.
 * @param {boolean} [slashesDenoteHost=false] Whether a protocol-relative URL (`//host/path`) has a hostname.
 *
 * @returns {{protocol: (string|null), hostname: (string|null), hash: (string|null)}} The parsed URL parts.
 */
export default function parseUrl( url, slashesDenoteHost = false ) {
	const trimmedUrl = String( url ).trim();

	const protocolMatch = protocolRegex.exec( trimmedUrl );
	const protocol = protocolMatch ? protocolMatch[ 1 ].toLowerCase() : null;

	const isProtocolRelative = ! protocol && trimmedUrl.startsWith( "//" );
	const hashIndex = trimmedUrl.indexOf( "#" );

	return {
		protocol,
		hostname: isProtocolRelative && ! slashesDenoteHost ? null : parseHostname( trimmedUrl, isProtocolRelative ),
		hash: hashIndex === -1 ? null : trimmedUrl.slice( hashIndex ),
	};
}
