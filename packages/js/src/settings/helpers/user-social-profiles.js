import apiFetch from "@wordpress/api-fetch";

const PERSON_SOCIAL_PROFILES_ROUTE = "/yoast/v1/configuration/person_social_profiles";

/**
 * @param {string} userId The ID of the user.
 * @returns {Promise<Object>} The promise of social profiles, can reject.
 */
export const fetchUserSocialProfiles = async( userId ) => {
	try {
		const response = await apiFetch( { path: `${ PERSON_SOCIAL_PROFILES_ROUTE }?user_id=${ userId }` } );

		if ( ! response?.success ) {
			throw new Error( "Route returned failure." );
		}

		return response?.social_profiles || {};
	} catch ( error ) {
		throw new Error( error?.message );
	}
};

/**
 * @param {string} userId The ID of the user.
 * @param {Object} personSocialProfiles The personSocialProfiles.
 * @returns {Promise<void>} Promise of saving, can reject.
 */
export const submitUserSocialProfiles = async( userId, personSocialProfiles ) => {
	try {
		const response = await apiFetch( {
			path: PERSON_SOCIAL_PROFILES_ROUTE,
			method: "POST",
			data: {
				...personSocialProfiles,
				// eslint-disable-next-line camelcase
				user_id: userId,
			},
		} );

		if ( ! response?.json?.success ) {
			throw new Error( `Route returned failure due to: ${ response?.json?.failures?.join( ", " ) }` );
		}
	} catch ( error ) {
		throw new Error( error.message );
	}
};
