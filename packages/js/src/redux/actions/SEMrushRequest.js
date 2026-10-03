export const CHANGE_COUNTRY = "CHANGE_COUNTRY";
export const SET_REQUEST_SUCCEEDED = "SET_REQUEST_SUCCEEDED";
export const SET_REQUEST_FAILED = "SET_REQUEST_FAILED";
export const SET_REQUEST_LIMIT_REACHED = "SET_LIMIT_REACHED";
export const NEW_REQUEST = "NEW_REQUEST";
export const NO_DATA_FOUND = "NO_DATA_FOUND";
export const SET_LOGIN_STATUS = "SET_LOGIN_STATUS";
export const SET_REQUEST_PENDING = "SET_REQUEST_PENDING";

/**
 * An action creator for when the request has succeeded.
 *
 * @param {Object} response The response of the request.
 *
 * @returns {Object} Action object.
 */
export function setSEMrushRequestPending() {
	return {
		type: SET_REQUEST_PENDING,
	};
}

/**
 * An action creator for when the request has succeeded.
 *
 * @param {Object} response The response of the request.
 *
 * @returns {Object} Action object.
 */
export function setSEMrushRequestSucceeded( response ) {
	return {
		type: SET_REQUEST_SUCCEEDED,
		response,
	};
}

/**
 * An action creator for when the request has failed.
 *
 * @param {Object} response of the request.
 *
 * @returns {Object} Action object.
 */
export function setSEMrushRequestFailed( response ) {
	return {
		type: SET_REQUEST_FAILED,
		response,
	};
}

/**
 * An action creator for when the request limit has been reached.
 *
 * @returns {Object} Action object.
 */
export function setSEMrushSetRequestLimitReached() {
	return {
		type: SET_REQUEST_LIMIT_REACHED,
	};
}

/**
 * Sets the country of the database in the dropdown menu.
 *
 * @param {string} countryCode The country code of the database to be set.
 *
 * @returns {Object} Action object.
 */
export function setSEMrushChangeCountry( countryCode ) {
	return {
		type: CHANGE_COUNTRY,
		countryCode,
	};
}

/**
 * An action creator for when no data is returned from SEMrush.
 *
 * @returns {Object} Action object.
 */
export function setSEMrushNoResultsFound() {
	return {
		type: NO_DATA_FOUND,
	};
}

/**
 * An action creator to check if the user is logged in to SEMrush.
 *
 * @param {boolean} loginStatus The login status.
 *
 * @returns {Object} Action object.
 */
export function setSEMrushLoginStatus( loginStatus ) {
	return {
		type: SET_LOGIN_STATUS,
		loginStatus,
	};
}

/**
 * An action creator for starting a new request.
 *
 * @param {Object} countryCode The country code of the database for the SEMrush request.
 * @param {string} keyphrase   The keyphrase for the SEMrush request.
 *
 * @returns {Object} Action object.
 */
export function* setSEMrushNewRequest( countryCode, keyphrase ) {
	try {
		yield setSEMrushRequestPending();

		const response = yield{
			type: NEW_REQUEST,
			countryCode,
			keyphrase,
		};

		if ( response.status === 200 ) {
			if ( response.results.rows.length === 0 ) {
				yield setSEMrushNoResultsFound();
			} else {
				yield setSEMrushRequestSucceeded( response );
			}
		} else if ( response.error && response.error.includes( "TOTAL LIMIT EXCEEDED" ) ) {
			yield setSEMrushSetRequestLimitReached();
		} else {
			yield setSEMrushRequestFailed( response );
		}
	} catch ( error ) {
		yield setSEMrushRequestFailed( error );
	}
}
