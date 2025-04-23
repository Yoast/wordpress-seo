/**
 * Initially forked from Site Kit's own implementation and modified to fit our needs.
 *
 * @see https://github.com/google/site-kit-wp/blob/dc2f9ee544b116ada6ae2dbdf40253ca3db647cc/assets/js/googlesitekit/api/cache.js
 *
 */

const DEFAULT_ORDER = [ "sessionStorage", "localStorage" ];
let storageOrder = [ ...DEFAULT_ORDER ];
let storageBackend;

/**
 * Overrides the storage backend.
 *
 * Largely used for tests. Should not be used directly.
 *
 * @param {*} backend Backend to set for the cache.
 */
export const setSelectedStorageBackend = ( backend ) => {
	storageBackend = backend;
};

/**
 * Overrides the priority of storage mechanisms.
 *
 * Largely used for tests. Implicitly resets the selected storage backend,
 * causing `_getStorage` to re-run its checks for the best available
 * storage backend.
 *
 * @param {Array} order Ordered array of storage backends to use.
 */
export const setStorageOrder = ( order ) => {
	storageOrder = [ ...order ];
	setSelectedStorageBackend( undefined ); // eslint-disable-line no-undefined
};

/**
 * Resets the storage mechanism order.
 *
 * Largely used for tests. Implicitly resets the selected storage backend,
 * causing `_getStorage` to re-run its checks for the best available
 * storage backend.
 */
export const resetDefaultStorageOrder = () => {
	storageOrder = [ ...DEFAULT_ORDER ];
	setSelectedStorageBackend( undefined ); // eslint-disable-line no-undefined
};

/**
 * Detects whether browser storage is both supported and available.
 *
 * @param {"localStorage"|"sessionStorage"} type Browser storage to test. Should be one of `localStorage` or `sessionStorage`.
 * @returns {Promise<boolean>} True if the given storage is available, false otherwise.
 */
export const isStorageAvailable = async( type ) => {
	const storage = global[ type ];

	if ( ! storage ) {
		return false;
	}

	try {
		const x = "__storage_test__";

		storage.setItem( x, x );
		storage.removeItem( x );
		return true;
	} catch ( e ) {
		return (
			e instanceof DOMException &&
			(
				// Everything except Firefox.
				e.code === 22 ||
				// Firefox.
				e.code === 1014 ||
				// Test name field too, because code might not be present.
				// Everything except Firefox.
				e.name === "QuotaExceededError" ||
				// Firefox.
				e.name === "NS_ERROR_DOM_QUOTA_REACHED"
			) &&
			// Acknowledge QuotaExceededError only if there's something already stored.
			storage.length !== 0
		);
	}
};

/**
 * Gets the storage object to use.
 *
 * @returns {Promise<Storage|null>} A storage mechanism (`localStorage` or `sessionStorage`) if available; otherwise returns `null`.
 */
export const getStorage = async() => {
	if ( storageBackend !== undefined ) { // eslint-disable-line no-undefined
		return storageBackend;
	}

	// Only run the logic to determine the storage object once.
	for ( const backend of storageOrder ) {
		if ( storageBackend ) {
			continue;
		}

		if ( await isStorageAvailable( backend ) ) {
			storageBackend = global[ backend ];
		}
	}

	if ( storageBackend === undefined ) { // eslint-disable-line no-undefined
		storageBackend = null;
	}

	return storageBackend;
};

/**
 * Gets cached data.
 *
 * Get cached data from the persistent storage cache.
 *
 * @param {string} key Name of cache key.
 * @returns {Promise} A promise returned, containing an object with the cached value (if found) and whether or not there was a cache hit.
 */
export const getItem = async( key ) => {
	const storage = await getStorage();

	if ( storage ) {
		const cachedData = storage.getItem( key );

		if ( cachedData ) {
			const parsedData = JSON.parse( cachedData );
			const { timestamp, ttl, value } = parsedData;

			// Ensure a timestamp is found, otherwise this isn't a valid cache hit.
			// (We don't check for a truthy `value`, because it could be legitimately
			// false-y if `0`, `null`, etc.)
			if (
				timestamp &&
				// Ensure the cached data isn't too old.
				// The cache dates shouldn't rely on reference
				// dates for cache expiration. This is a case
				// where we actually want to rely on
				// the _actual_ date/time the data was set.
				( ! ttl ||
					Math.round( Date.now() / 1000 ) - timestamp < ttl )
			) {
				return {
					cacheHit: true,
					value,
				};
			}
		}
	}

	return {
		cacheHit: false,
		value: undefined, // eslint-disable-line no-undefined
	};
};

/**
 * Sets cached data using a key.
 *
 * Save data to the relevant local storage mechanism, if available.
 * By default, data is saved with a one hour (60 minute) TTL.
 *
 * @param {string}  key              Name of cache key.
 * @param {*}       value            Value to store in the cache.
 * @param {Object}  args             Optional object containing ttl and timestamp keys.
 * @param {number}  [args.ttl]       Optional. Validity of the cached item in seconds.
 * @param {number}  [args.timestamp] Optional. Timestamp when the cached item was created.
 * @returns {Promise} A promise: resolves to `true` if the value was saved; `false` if not (usually because no storage method was available).
 */
export const setItem = async(
	key,
	value,
	{
		ttl = 60 * 60,
		// Cached times should rely on real times, not the reference date,
		// so the cache timeouts are consistent even when changing
		// the reference dates when developing/testing.
		timestamp = Math.round( Date.now() / 1000 ),
	} = {}
) => {
	const storage = await getStorage();

	if ( storage ) {
		try {
			storage.setItem(
				key,
				JSON.stringify( {
					timestamp,
					ttl,
					value,
				} )
			);

			return true;
		} catch ( error ) {
			global.console.warn(
				"Encountered an unexpected storage error:",
				error
			);
			return false;
		}
	}

	return false;
};
