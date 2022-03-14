import { Fragment } from "@wordpress/element";
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
