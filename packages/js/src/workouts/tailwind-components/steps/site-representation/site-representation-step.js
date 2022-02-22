import { Fragment, useState, useCallback } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import AnimateHeight from "react-animate-height";

import { addLinkToString } from "../../../../helpers/stringHelpers.js";
import Alert from "../../base/alert";
import SingleSelect from "../../base/single-select";
import TextInput from "../../base/text-input";
import { OrganizationSection } from "./organization-section";
import { PersonSection } from "./person-section";

/* eslint-disable complexity */

/**
 * Doc comment to make linter happy.
 *
 * @returns {WPElement} Example step.
 */
export default function SiteRepresentationStep( { onOrganizationOrPersonChange, dispatch, state, siteRepresentationEmpty } ) {
	const [ alertOpacity, setAlertOpacity ] = useState( "yst-opacity-0" );
	const startOpacityTransition = useCallback( () => {
		setAlertOpacity( "yst-opacity-100" );
	} );

	return <Fragment>
		{  window.wpseoWorkoutsData.configuration.knowledgeGraphMessage &&  <Alert type="warning">
			{  window.wpseoWorkoutsData.configuration.knowledgeGraphMessage }
		</Alert> }
		<p className="yst-text-sm yst-whitespace-pre-line yst-mb-8">
			{
				addLinkToString(
					sprintf(
						__(
							"Help us out here! Is your site about an organization or a person? " +
							"Completing this step will help Google to understand your website, and improve your chance of getting %1$srich results%2$s.",
							"wordpress-seo"
						),
						"<a>",
						"</a>"
					),
					"https://where-does-this-link.go",
					"yoast-configuration-rich-text-link"
				)
			}
		</p>
		{
			window.wpseoWorkoutsData.configuration.shouldForceCompany === 0 && <SingleSelect
				id="organization-person-select"
				htmlFor="organization-person-select"
				name="organization"
				label={ __( "Does your site represent an Organization or Person?", "wordpress-seo" ) }
				value={ state.companyOrPerson }
				onChange={ onOrganizationOrPersonChange }
				choices={ state.companyOrPersonOptions }
			/>
		}
		{
			window.wpseoWorkoutsData.configuration.shouldForceCompany === 1 && <TextInput
				id="organization-forced-readonly-text"
				name="organization"
				label={ __( "Does your site represent an Organization or Person?", "wordpress-seo" ) }
				value={ state.companyOrPersonLabel }
				readOnly={ true }
			/>
		}
		{ state.companyOrPerson === "company" && <Fragment>
			<OrganizationSection
				dispatch={ dispatch }
				imageUrl={ state.companyLogo }
				organizationName={ state.companyName }
			/>
		</Fragment> }
		{ state.companyOrPerson === "person" && <Fragment>
			<PersonSection
				dispatch={ dispatch }
				imageUrl={ state.personLogo }
				personId={ state.personId }
			/>
		</Fragment> }
		<AnimateHeight
			id="indexation-alert"
			height={ siteRepresentationEmpty ? "auto" : 0 }
			easing="linear"
			duration={ 400 }
			onAnimationEnd={ startOpacityTransition }
		>
			<Alert type="info" className={ "yst-mt-6 yst-transition-opacity yst-duration-300 " + alertOpacity }>
				{
					addLinkToString(
						sprintf(
							__(
								"Please be aware that you need to fill out all settings in this step to get the most value out of structured data. %1$sRead more about the importance of structured data%2$s.",
								"wordpress-seo"
							),
							"<a>",
							"</a>"
						),
						"https://where-does-this-link.go",
						"yoast-configuration-structured-data-link"
					)
				}
			</Alert>
		</AnimateHeight>
	</Fragment>;
}
