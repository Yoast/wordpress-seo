/**
 * Posts the dismissal to the API.
 *
 * @param {String} alertKey The key of the Alert that needs to be dismissed.
 *
 * @returns {Object} The API Post followed by a resolve.
 */
export function	DISMISS_ALERT( { alertKey } ) {
	return new Promise( ( resolve ) =>
		window.wpseoApi.post( "alerts/dismiss", { key: alertKey }, () => resolve() )
		// We want the Alert to always hide on dismiss.
		// So when the POST isn't succesfull, we still resolve.
	);
}
