import { Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";

import SocialInputSection from "./social-input-section";
import SocialInputPersonSection from "./social-input-person-section.js";


/* eslint-disable max-len, react/prop-types */
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
	if ( [ "company", "emptyChoice" ].includes( state.companyOrPerson ) ) {
		return <Fragment>
			<p>{
				__(
					"We need a little more help from you! Add your organization's Facebook and Twitter profile so we can optimize the metadata for those platforms too.",
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

	return <Fragment>
		<p>{
			__(
				"We need a little more help from you! Add your Facebook and Twitter profile so we can optimize the metadata for those platforms too.",
				"wordpress-seo"
			)
		}</p>
		<SocialInputPersonSection
			socialProfiles={ state.personSocialProfiles }
			dispatch={ dispatch }
			canEditUser={ !! state.canEditUser }
			personId={ state.personId }
			errorFields={ state.errorFields }
		/>
	</Fragment>;
}

SocialProfilesStep.propTypes = {
	state: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
	setErrorFields: PropTypes.func.isRequired,
};
