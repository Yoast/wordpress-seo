/**
 * Generates a random separator of a given length.
 *
 * @param length     The length.
 * @param characters The allowed characters.
 *
 * @returns The separator.
 */
export function generateSeparator( length: number, characters: string[] ): string {
	let output = "";

	for ( let i = 0; i < length; i++ ) {
		output += characters[ Math.floor( Math.random() * characters.length ) ];
	}

	return output;
}

/**
 * Generates a unique separator for a given text.
 *
 * @param text       The text.
 * @param characters The allowed characters.
 *
 * @returns The separator.
 */
export function generateUniqueSeparator( text: string, characters: string[] ): string {
	let length = 2;

	while ( true ) {
		const separator = generateSeparator( Math.floor( length ), characters );
		if ( text.indexOf( separator ) === -1 ) {
			return separator;
		}
		length += 0.2;
	}
}
