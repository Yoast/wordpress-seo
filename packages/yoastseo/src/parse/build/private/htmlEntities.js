// Contains characters usually converted HTML entities (cf. _wp_specialchars).
export const htmlEntities = new Map( [
	[ "amp;", "&" ],
	[ "lt;", "<" ],
	[ "gt;", ">" ],
	[ "quot;", '"' ],
	[ "#x27;", "'" ],
] );

// Contains characters along with their hashed HTML entities.
export const hashedHtmlEntities = new Map();
htmlEntities.forEach( ( v, k ) => hashedHtmlEntities.set( "#" + k, v ) );

// Regex to find all HTML entities.
export const htmlEntitiesRegex = new RegExp( "&(" + [ ...htmlEntities.keys() ].join( "|" ) + ")", "ig" );

// Regex to find hashed HTML entities at the end of a string.
export const hashedHtmlEntitiesEndRegex = new RegExp( "(" + [ ...hashedHtmlEntities.keys() ].join( "|" ) + ")$" );
