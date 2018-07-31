/**
 * Creates an object with a regex and a replacement pair to be processed.
 *
 * @param {Array} array An array with pairs or triplets of strings of which the first one is the regex to match and
 * the second (and the third) is the replacement.
 *
 * @returns {Array} Array of objects to be used in the regex-based rules.
 */
export default function( array ) {
	return array.map( function( pair ) {
		if ( pair.length === 2 ) {
			return {
				reg: new RegExp( pair[ 0 ], "i" ),
				repl: pair[ 1 ],
			};
		}
		if ( pair.length === 3 ) {
			return {
				reg: new RegExp( pair[ 0 ], "i" ),
				repl1: pair[ 1 ],
				repl2: pair[ 2 ],
			};
		}
	} );
};
