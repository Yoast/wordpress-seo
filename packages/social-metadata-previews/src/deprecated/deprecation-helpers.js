import { noop } from "lodash";

const logged = {};

/**
 * Logs a message once per given scope.
 *
 * @param {string} scope The scope.
 * @param {string} message The message.
 * @param {Object} options The options.
 * @param {function} options.log The log function.
 *
 * @returns {void}
 */
export const logOnce = ( scope, message, { log = console.warn } = {} ) => {
	if ( ! logged[ scope ] ) {
		logged[ scope ] = true;
		log( message );
	}
};

/**
 * Wraps an object with a getter/setter for every property.
 *
 * @param {Object} source The source object that will still be used.
 * @param {function} callback The callback that gets called in set/get.
 *
 * @returns {Object} The wrapped object.
 */
export const createObjectWrapper = ( source, callback = noop ) => {
	const wrapped = {};

	for ( const key in source ) {
		if ( ! Object.hasOwn( source, key ) ) {
			continue;
		}

		Object.defineProperty( wrapped, key, {
			set: ( value ) => {
				source[ key ] = value;
				callback( "set", key, value );
			},
			get: () => {
				callback( "get", key );
				return source[ key ];
			},
		} );
	}

	return wrapped;
};
