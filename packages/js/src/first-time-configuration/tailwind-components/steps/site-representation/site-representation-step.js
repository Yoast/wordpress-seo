import { Fragment, useState, useCallback } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";
import ReactAnimateHeight from "react-animate-height";
import classNames from "classnames";

import { addLinkToString } from "../../../../helpers/stringHelpers.js";
import Alert, { FadeInAlert } from "../../base/alert";
import SingleSelect from "../../base/single-select";
import TextInput from "../../base/text-input";
import { OrganizationSection } from "./organization-section";
import { PersonSection } from "./person-section";

/* eslint-disable complexity */

/**
 * The site representation step.
 *
 * @param {function} onOrganizationOrPersonChange Function to call when the organization/person select changes.
 * @param {function} dispatch                     A dispatch function to communicate with the Stepper store.
 * @param {Object}   state                        The Stepper store.
 * @param {boolean}  siteRepresentationEmpty      Whether the person or organization inputs are empty.
 *
 * @returns {WPElement} The site representation step component.
 */
export default function SiteRepresentationStep( { onOrganizationOrPersonChange, dispatch, state, siteRepresentationEmpty } ) {
	const [ sectionOpacity, setSectionOpacity ] = useState( state.companyOrPerson === "emptyChoice" ? "yst-opacity-0" : "yst-opacity-100" );
	const startOpacityTransition = useCallback( () => {
		setSectionOpacity( "yst-opacity-100" );
	} );

	const handleWebsiteNameChange = useCallback( ( event ) => {
		dispatch( { type: "CHANGE_WEBSITE_NAME", payload: event.target.value } );
	} );

	const richResultsMessage = addLinkToString(
		sprintf(
			/* translators: %1$s expands to opening 'a' HTML tag, %2$s expands to closing 'a' HTML tag. */
			__( "Completing this step helps Google to understand your site even better. Bonus: You'll improve your chance of getting %1$srich results%2$s!", "wordpress-seo" ),
			"<a>",
			"</a>"
		),
		"https://yoa.st/config-workout-rich-results",
		"yoast-configuration-rich-text-link"
	);

	/**
	 * Determines if the default values notice should be displayed.
	 *
	 * @returns {boolean} if the notices should be displayed.
	 */
	function shouldDisplayDefaultValuesNotice() {
		if ( state.companyOrPerson === "company" && state.companyName && state.companyLogo ) {
			return false;
		}

		if ( state.companyOrPerson === "company" && ! state.companyLogoFallback ) {
			return false;
		}

		if ( state.companyOrPerson === "person" && state.personLogo ) {
			return false;
		}

		if ( state.companyOrPerson === "person" && ! state.personLogoFallback ) {
			return false;
		}

		return true;
	}

	return <Fragment>
		{ window.wpseoFirstTimeConfigurationData.knowledgeGraphMessage && <Alert type="info">
			{ window.wpseoFirstTimeConfigurationData.knowledgeGraphMessage }
		</Alert> }
		<p className={ classNames( "yst-text-sm yst-whitespace-pre-line yst-mb-6", state.shouldForceCompany ? "yst-mt-4" : "yst-mt-0" ) }>
			{
				state.shouldForceCompany
					? richResultsMessage
					: <Fragment>
						{ __( "Tell us! Is your site about an organization or a person? ", "wordpress-seo" ) }
						{ richResultsMessage }
					</Fragment>
			}
		</p>

		<SingleSelect
			id="organization-person-select"
			htmlFor="organization-person-select"
			name="organization"
			label={ __( "Does your site represent an Organization or Person?", "wordpress-seo" ) }
			value={ state.shouldForceCompany ? "company" : state.companyOrPerson }
			onChange={ onOrganizationOrPersonChange }
			choices={ state.companyOrPersonOptions }
			disabled={ !! state.shouldForceCompany }
		/>

		{ shouldDisplayDefaultValuesNotice() && <Alert type="info" className="yst-mt-6">
			{ __( "We took the liberty of using your website name and logo for the organization name and logo. Feel free to change them below.", "wordpress-seo" ) }
		</Alert> }

		<TextInput
			className="yst-my-6"
			id="website-name-input"
			name="website-name"
			label={ __( "Website name", "wordpress-seo" ) }
			value={ state.websiteName || state.fallbackWebsiteName }
			onChange={ handleWebsiteNameChange }
			feedback={ {
				isVisible: state.errorFields.includes( "website_name" ),
				message: [ __( "We could not save the website name. Please check the value.", "wordpress-seo" ) ],
				type: "error",
			} }
		/>

		<ReactAnimateHeight
			height={ [ "company", "person" ].includes( state.companyOrPerson ) ? "auto" : 0 }
			duration={ 400 }
			easing="linear"
			onAnimationEnd={ startOpacityTransition }
		>
			<div className={ classNames( "yst-transition-opacity yst-duration-300 yst-mt-6", sectionOpacity ) }>
				{ state.companyOrPerson === "company" && <OrganizationSection
					dispatch={ dispatch }
					imageUrl={ state.companyLogo }
					fallbackImageUrl={ state.companyLogoFallback }
					organizationName={ state.companyName }
					fallbackOrganizationName={ state.fallbackCompanyName }
					errorFields={ state.errorFields }
				/> }
				{ state.companyOrPerson === "person" && <PersonSection
					dispatch={ dispatch }
					imageUrl={ state.personLogo }
					fallbackImageUrl={ state.personLogoFallback }
					person={ {
						id: state.personId,
						name: state.personName,
					} }
					canEditUser={ !! state.canEditUser }
					errorFields={ state.errorFields }
				/> }
			</div>
		</ReactAnimateHeight>
		<FadeInAlert
			id="site-representation-empty-alert"
			isVisible={ siteRepresentationEmpty }
			className="yst-mt-6"
		>
			{ __( "You're almost there! Complete all settings in this step so search engines know what your site is about.", "wordpress-seo" ) }
		</FadeInAlert>
	</Fragment>;
}

SiteRepresentationStep.propTypes = {
	onOrganizationOrPersonChange: PropTypes.func.isRequired,
	dispatch: PropTypes.func.isRequired,
	state: PropTypes.object.isRequired,
	siteRepresentationEmpty: PropTypes.bool.isRequired,
};
