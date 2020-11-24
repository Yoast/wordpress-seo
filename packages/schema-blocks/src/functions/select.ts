/**
 * Converts an array or object containing strings to an array of options.
 *
 * @param values The array or object.
 *
 * @returns The options.
 */
export function arrayOrObjectToOptions<T extends string>( values: T[] | Record<string, T> ): { label: string; value: T }[] {
	const options = [];

	if ( Array.isArray( values ) ) {
		for ( const value of values ) {
			options.push( { label: value, value } );
		}
		return options;
	}
	for ( const [ label, value ] of Object.entries( values ) ) {
		options.push( { label, value } );
	}

	return options;
}
