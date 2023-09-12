// Contains 1) special characters usually converted into HTML entities (cf. _wp_specialchars).
// And 2) their corresponding HTML entities, stripped from the initial ampersand (e.g. 'lt;' instead of '&lt;').
export const htmlEntities = new Map( [
	[ "amp;", "&" ],
	[ "lt;", "<" ],
	[ "gt;", ">" ],
	[ "quot;", '"' ],
	[ "apos;", "'" ],
	[ "ndash;", "–" ],
	[ "mdash;", "—" ],
	[ "copy;", "©" ],
	[ "reg;", "®" ],
	[ "trade;", "™" ],
	[ "pound;", "£" ],
	[ "yen;", "¥" ],
	[ "euro;", "€" ],
	[ "dollar;", "$" ],
	[ "deg;", "°" ],
	[ "asymp;", "≈" ],
	[ "ne;", "≠" ],
] );

// Regex to find all HTML entities.
export const htmlEntitiesRegex = new RegExp( "&(" + [ ...htmlEntities.keys() ].join( "|" ) + ")", "ig" );

// Contains special characters along with their hashed HTML entities (e.g. '#amp;' instead of '&amp;' for the ampersand character '&').
export const hashedHtmlEntities = new Map();
htmlEntities.forEach( ( v, k ) => hashedHtmlEntities.set( "#" + k, v ) );

// Regex to find hashed HTML entities.
export const hashedHtmlEntitiesRegex = new RegExp( "(" + [ ...hashedHtmlEntities.keys() ].join( "|" ) + ")", "g" );
