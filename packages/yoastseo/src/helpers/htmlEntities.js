// Contains 1) special characters usually converted into HTML entities (cf. _wp_specialchars).
// And 2) their corresponding HTML entities, stripped from the initial ampersand (e.g. 'lt;' instead of '&lt;').
const htmlEntities = new Map( [
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
	[ "nbsp;", " " ],
] );

// Regex to find all HTML entities.
const htmlEntitiesRegex = new RegExp( "&(" + [ ...htmlEntities.keys() ].join( "|" ) + ")", "ig" );

// Contains special characters along with their hashed HTML entities (e.g. '#amp;' instead of '&amp;' for the ampersand character '&').
const hashedHtmlEntities = new Map();
htmlEntities.forEach( ( value, key ) => hashedHtmlEntities.set( "#" + key, value ) );

// Regex to find hashed HTML entities attached to the beginning (hashedHtmlEntitiesRegexStart) or to the end of a string (hashedHtmlEntitiesRegexEnd).
const hashedHtmlEntitiesRegexStart = new RegExp( "^(" + [ ...hashedHtmlEntities.keys() ].join( "|" ) + ")" );
const hashedHtmlEntitiesRegexEnd = new RegExp( "(" + [ ...hashedHtmlEntities.keys() ].join( "|" ) + ")$" );

export {
	htmlEntities,
	htmlEntitiesRegex,
	hashedHtmlEntities,
	hashedHtmlEntitiesRegexStart,
	hashedHtmlEntitiesRegexEnd,
};
