import { createInterpolateElement, Fragment } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { useCallback, useState, useEffect } from "@wordpress/element";
import PropTypes from "prop-types";
import apiFetch from "@wordpress/api-fetch";

import { Alert } from "@yoast/components";
import { addLinkToString } from "../../../../helpers/stringHelpers.js";
import TextInput from "../../base/text-input";

/* eslint-disable max-len */
/**
 * The SocialInputPersonSection element, which is a screenshot and some conditionally changing text.
 *
 * @param {Object} props          The props object.
 * @param {number} props.personId The id of the selected person.
 *
 * @returns {WPElement} The SocialInputPersonSection element
 */
function SocialInputPersonSection( { personId } ) {
	const socialUrls = [ "Facebook", "Instagram", "LinkedIn", "MySpace", "Pinterest", "SoundCloud", "Tumblr", "Twitter", "YouTube", "Wikipedia" ];
	const [ socials, setSocials ] = useState( {} );
	const [ canUserEdit, setCanUserEdit ] = useState( true );

	const onChangeHandler = useCallback( ( event ) => {
		// eslint-disable-next-line no-console
		setSocials( prevState => {
			return { ...prevState, [ event.target.dataset.socialmedium ]: event.target.value };
		} );
	}, [ setSocials ] );

	useEffect( () => {
		apiFetch( {
			path: `yoast/v1/workouts/person_social_profiles?person_id=${ personId }`,
		} ).then( response => {
			setCanUserEdit( response.success );
			if( response.success ) {
				setSocials( response.social_profiles );
			}
		} );
	}, [] );

	return (
		<div>
			{
				// No person has been selected in step 2
				personId === 0 && <Fragment>
					<Alert type="info">
						{
							createInterpolateElement(
								sprintf(
									__(
										// translators: %1$s and %2$s are replaced by opening and closing <b> tags, %3$s and %4$s are replaced by opening and closing anchor tags
										"%1$sImportant%2$s: Please select a name in step 2 for this step to be effective.",
										"wordpress-seo"
									),
									"<b>",
									"</b>"
								),
								{
									b: <b />,
								}
							)
						}
					</Alert>
					<p>
						{
							createInterpolateElement(
								sprintf(
									__(
										// translators: %1$s and %2$s are replaced by opening and closing anchor tags
										"In this step, you need to add the personal social profiles of the person your site represents. To do that, you should go to the %1$sUsers%2$s > Profile page in a new browser tab. Alternatively, ask the user or an admin to do it if you are not allowed.",
										"wordpress-seo"
									),
									"<a>",
									"</a>"
								),
								{
									b: <b />,
									// eslint-disable-next-line jsx-a11y/anchor-has-content
									a: <a id="yoast-configuration-workout-user-page-link-1" href={ window.wpseoWorkoutsData.usersPageUrl } target="_blank" rel="noopener noreferrer" />,
								}
							)
						}
					</p>
					<p>
						{
							addLinkToString(
								sprintf(
									__(
										// translators: %1$s and %2$s are replaced by opening and closing anchor tags.
										"On the %1$sUsers%2$s page, hover your mouse over the username you want to edit. Click ‘Edit’ to access the user’s profile. Then, scroll down to the ‘Contact info’ section (see screenshot below) and fill in the URLs of the personal social profiles you want to add.",
										"wordpress-seo"
									),
									"<a>",
									"</a>"
								),
								window.wpseoWorkoutsData.usersPageUrl,
								"yoast-configuration-workout-user-page-link-2"
							)
						}
					</p>
				</Fragment>
			}
			{
				( personId !== 0 && canUserEdit ) && <Fragment>
					<div id="social-input-section" className="yoast-social-profiles-input-fields">
						{ socialUrls.map( ( social, index ) => (
							<TextInput
								key={ index }
								className="yst-mt-4"
								label={ __( social, "wordpress-seo" ) }
								id={ social.toLowerCase() }
								value={ socials[ social.toLowerCase() ] }
								data-socialmedium={ social.toLowerCase() }
								onChange={ onChangeHandler }
								error={ {
									message: [ __( "Error", "wordpress-seo" ) ],
									isVisible: false,
								} }
							/>
						) ) }
					</div>
				</Fragment>
			}
		</div>
	);
}
/* eslint-enable max-len */

export default SocialInputPersonSection;

SocialInputPersonSection.propTypes = {
	personId: PropTypes.number,
};

SocialInputPersonSection.defaultProps = {
	personId: 0,
};

