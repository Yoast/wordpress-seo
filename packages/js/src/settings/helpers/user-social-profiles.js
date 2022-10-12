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
 * @param {Object} values The values.
 * @returns {Promise<void>} Promise of saving, can reject.
 */
export const submitUserSocialProfiles = async( values ) => {
	const { person_social_profiles: personSocialProfiles } = values;
	const { company_or_person: companyOrPerson, company_or_person_user_id: userId } = values.wpseo_titles;

	if ( companyOrPerson !== "person" || userId < 1 ) {
		// A person is not represented.
		return;
	}

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
