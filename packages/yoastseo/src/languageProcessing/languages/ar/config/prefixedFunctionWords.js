export const PREFIXED_FUNCTION_WORDS = [ "ل", "ب", "ك", "و", "ف", "س", "أ", "ال", "وب", "ول", "لل", "فس", "فب", "فل", "وس",
	"وال", "بال", "فال", "كال", "ولل", "وبال" ];
// Sort the prefixes by length, so we can match the longest prefix first.
const DESCENDING_PREFIXES = [ ...PREFIXED_FUNCTION_WORDS ].sort( ( a, b ) => b.length - a.length );
export const PREFIXED_FUNCTION_WORDS_REGEX = new RegExp( `^(${DESCENDING_PREFIXES.join( "|" )})` );
