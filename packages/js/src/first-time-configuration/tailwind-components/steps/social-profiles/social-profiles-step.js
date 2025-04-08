import { createInterpolateElement, Fragment } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";
import SocialInputSection from "./social-input-section";
import Alert from "../../base/alert";

/**
 * Social profiles step component
 *
 * @param {Object}   props                The props object.
 * @param {Object}   props.state          The container's state.
 * @param {function} props.dispatch       The function to update the container's state.
 * @param {function} props.setErrorFields The function to keep track of which text fields are not valid.
 *
 * @returns {WPElement} The social profiles step.
 */
export default function SocialProfilesStep( { state, dispatch, setErrorFields } ) {
	const noUserSelectedText = __(
		"If you select a Person to represent this site, we will use the social profiles from the selected user's profile page.",
		"wordpress-seo"
	);
	const userSelectedText = createInterpolateElement(
		sprintf(
			// translators: %1$s is replaced by the selected person's username.
			__(
				"You have selected the user %1$s as the person this site represents.",
				"wordpress-seo"
			),
			`<b>${state.personName}</b>`
		),
		{
			b: <b />,
		} );

	const userCanEditText =	createInterpolateElement(
		sprintf(
			// translators: %1$s and %2$s is replaced by a link to the selected person's profile page.
			__(
				"You can %1$supdate or add social profiles to this user profile%2$s.",
				"wordpress-seo"
			),
			"<a>",
			"</a>"

		),
		{	// eslint-disable-next-line jsx-a11y/anchor-has-content
			a: <a
				id="yoast-configuration-person-social-profiles-user-link"
				href={ window.wpseoScriptData.userEditUrl.replace( "{user_id}", state.personId ) }
				target="_blank" rel="noopener noreferrer"
				data-hiive-event-name="clicked_update_or_add_profile | social profiles"
			/>,
		} );

	const userCannotEditText =	__(
		"You're not allowed to edit the social profiles of this user. Please ask this user or an admin to do this.",
		"wordpress-seo"
	);

	if ( [ "company", "emptyChoice" ].includes( state.companyOrPerson ) ) {
		return <Fragment>
			<p>{
				__(
					"Fantastic work! Add your organization's social media accounts below. This allows us to fine-tune the metadata for these platforms.",
					"wordpress-seo"
				)
			}</p>
			<SocialInputSection
				socialProfiles={ state.socialProfiles }
				dispatch={ dispatch }
				errorFields={ state.errorFields }
				setErrorFields={ setErrorFields }
			/>
		</Fragment>;
	}

	return state.personId === 0
		? <Fragment>
			<p>
				{ noUserSelectedText }
			</p>
			{ /* No person has been selected in step 2 */ }
			<Alert type="info" className="yst-mt-5">
				{
					/* translators: please note that "Site representation" here refers to the name of a step in the first-time configuration,
					 * so this occurrence needs to be translated in the same manner as that step's heading.
					 */
					__(
						"Please select a user in the Site representation step.",
						"wordpress-seo"
					)
				}
			</Alert>
		</Fragment>
		: <Fragment>
			<p>
				{  userSelectedText }
				{ " " }
				{ state.canEditUser ? userCanEditText : userCannotEditText }
			</p>
		</Fragment>;
}

SocialProfilesStep.propTypes = {
	state: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
	setErrorFields: PropTypes.func.isRequired,
};
