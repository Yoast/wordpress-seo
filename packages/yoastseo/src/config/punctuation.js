
// Whitespace is always a word boundary.
// "\u00a0" = NBSP (non-breaking space)
const whitespaces = [ " ", "\n", "\r", "\t", "\u00a0" ];

export const doubleQuotes = [ "\"", "»", "«", "”", "“", "〝", "〞", "〟", "‟", "„", "『", "』" ];
export const doubleQuotesForRegex = doubleQuotes.map( ( boundary ) => "\\" + boundary ).join( "" )

// ‘’‛`‹›
export const singleQuotes = [ "‘",  "’", "‛", "`" ]; //, "'" "‹", "›"
export const singleQuotesForRegex = singleQuotes.map( ( boundary ) => "\\" + boundary ).join( "" );

const genericPunctuation = [ ".", ",", "(", ")", "+", ";", "!", "?", ":", "/", "<", ">", "¡", "¿",
//   \u2014 - em dash
	"\u2014" ];

// The hyphen was removed from the list of word boundaries.
const hyphen = [ "-" ];

const misc = [

	// \u06d4 - Urdu full stop
	"\u06d4",
	// \u061f - Arabic question mark
	"\u061f",
	// \u060C - Arabic comma
	"\u060C",
	// \u061B - Arabic semicolon
	"\u061B",
	" " ];

const quotes = [].concat( doubleQuotes, singleQuotes );

export const wordBoundaries = [].concat( whitespaces, quotes, genericPunctuation, misc );
export const wordBoundariesStringForRegex = wordBoundaries.map( ( boundary ) => "\\" + boundary ).join( "" );
