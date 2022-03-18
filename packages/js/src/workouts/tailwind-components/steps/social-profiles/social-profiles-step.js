import { Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";

import SocialInputSection from "./social-input-section";
import SocialInputPersonSection from "./social-input-person-section.js";


/* eslint-disable max-len, react/prop-types */
/**
 * Doc comment to make linter happy.
 *
 * @returns {JSX.Element} Example step.
 */
export default function SocialProfilesStep( { state, dispatch, setErrorFields, siteRepresentsPerson } ) {
	return <Fragment>
		<p>{
			__(
				"We need a little more help from you! Add your Facebook and Twitter profile so we can optimize the metadata for those platforms too.",
				"wordpress-seo"
			)
		}</p>
		{ [ "company", "emptyChoice" ].includes( state.companyOrPerson ) && <SocialInputSection
			socialProfiles={ state.socialProfiles }
			dispatch={ dispatch }
			errorFields={ state.errorFields }
			setErrorFields={ setErrorFields }
		/> }
		{ siteRepresentsPerson && <SocialInputPersonSection personId={ state.personId } /> }
	</Fragment>;
}

SocialProfilesStep.propTypes = {
	state: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
	setErrorFields: PropTypes.func.isRequired,
	siteRepresentsPerson: PropTypes.bool.isRequired,
};
