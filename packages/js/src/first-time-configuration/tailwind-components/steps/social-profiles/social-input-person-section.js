import apiFetch from "@wordpress/api-fetch";
import { createInterpolateElement, useCallback, useEffect, Fragment } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";

import Alert from "../../base/alert";
import { socialMedia } from "../../helpers";
import SocialInput from "./social-input";

/* eslint-disable max-len */
/**
 * The SocialInputPersonSection element.
 *
 * @param {Object}  props                The props object.
 * @param {Object}  props.socialProfiles An associative array of the form {facebookUrl : url, twitterUrl : url, otherSocialUrls : { socialmedium : url } }.
 * @param {Object}  props.errorFields    The array containing the names of the fields with an invalid value.
 * @param {Object}  props.dispatch       A dispatch function to communicate with the Stepper store.
 * @param {Boolean} props.canEditUser    Wether the current user can edit the selected person's profile.
 * @param {number}  props.personId       The id of the selected person.
 *
 * @returns {WPElement} The SocialInputPersonSection component.
 */
function SocialInputPersonSection( { socialProfiles, errorFields, dispatch, canEditUser, personId } ) {
	const onChangeHandler = useCallback(
		( newValue, socialMedium ) => {
			dispatch( { type: "CHANGE_PERSON_SOCIAL_PROFILE", payload: { socialMedium, value: newValue } } );
		},
		[ dispatch ]
	);

	useEffect( () => {
		apiFetch( {
			path: `yoast/v1/configuration/person_social_profiles?user_id=${ personId }`,
		} ).then( response => {
			if ( response.success ) {
				dispatch( { type: "INIT_PERSON_SOCIAL_PROFILES", payload: { socialProfiles: response.social_profiles } } );
			}
		} ).catch(
			( e ) => {
				console.error( e.message );
			}
		);
	}, [ personId, dispatch ] );

	return (
		<div>
			{
				// No person has been selected in step 2
				personId === 0 && <Alert type="info" className="yst-mt-5">
					{
						sprintf(
							__(
								// translators: %1$s and %2$s are replaced by opening and closing <b> tags, %3$s and %4$s are replaced by opening and closing anchor tags
								"Please select a name in step 2 for this step to be effective.",
								"wordpress-seo"
							)
						)
					}
				</Alert>
			}
			{
				( ( personId !== 0 ) && ( ! canEditUser ) ) &&
				<Alert type="info" className="yst-mt-5">
					{
						createInterpolateElement(
							sprintf(
								__(
									// translators: %1$s is replaced by the selected person's username
									"You're not allowed to edit the social profiles of the user %1$s. Please ask this user or an admin to do this.",
									"wordpress-seo"
								),
								window.wpseoFirstTimeConfigurationData.personName
							),
							{
								b: <b />,
							}
						)
					}
				</Alert>
			}
			{
				( personId !== 0 ) &&
					<div id="social-input-section" className="yoast-social-profiles-input-fields">
						{ socialMedia.map( ( social, index ) => (
							<SocialInput
								key={ index }
								className="yst-mt-4"
								label={ social.name }
								id={ social.name.toLowerCase() }
								value={ socialProfiles[ social.name.toLowerCase() ] }
								socialMedium={ social.name.toLowerCase() }
								onChange={ onChangeHandler }
								isDisabled={ ! canEditUser }
								placeholder={ social.placeholder }
								feedback={ {
									message: [ social.name === "Twitter"
										? __( "Could not save this value. Please check the URL or username.", "wordpress-seo" )
										: __( "Could not save this value. Please check the URL.", "wordpress-seo" ),
									],
									isVisible: errorFields.includes( social.name.toLowerCase() ),
									type: "error",
								} }
							/>
						) ) }
					</div>
			}
		</div>
	);
}
/* eslint-enable max-len */

export default SocialInputPersonSection;

SocialInputPersonSection.propTypes = {
	dispatch: PropTypes.func.isRequired,
	canEditUser: PropTypes.bool.isRequired,
	socialProfiles: PropTypes.object,
	errorFields: PropTypes.array,
	personId: PropTypes.number,
};

SocialInputPersonSection.defaultProps = {
	socialProfiles: {},
	errorFields: [],
	personId: 0,
};
