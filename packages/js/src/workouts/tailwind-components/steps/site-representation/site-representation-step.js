import { Fragment } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";

import { addLinkToString } from "../../../../helpers/stringHelpers.js";
import Alert, { FadeInAlert } from "../../base/alert";
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
		<FadeInAlert
			id="site-representation-empty-alert"
			isVisible={ siteRepresentationEmpty }
			className="yst-mt-6"
		>
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
		</FadeInAlert>
	</Fragment>;
}
