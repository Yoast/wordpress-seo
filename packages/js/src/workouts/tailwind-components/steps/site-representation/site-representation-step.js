import { Fragment, useState, useEffect, useCallback } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";

import { addLinkToString } from "../../../../helpers/stringHelpers.js";
import Alert from "../../base/alert";
import SingleSelect, { SelectWithEmpty } from "../../base/single-select";
import TextInput from "../../base/text-input";
import { OrganizationSection } from "./organization-section";
import { PersonSection } from "./person-section";

/* eslint-disable complexity */

/**
 * Doc comment to make linter happy.
 *
 * @returns {WPElement} Example step.
 */
export default function SiteRepresentationStep( { onOrganizationOrPersonChange, dispatch, state, siteRepresentsPerson, onSiteTaglineChange, siteRepresentationEmpty } ) {
	return <Fragment>
		{  window.wpseoWorkoutsData.configuration.knowledgeGraphMessage &&  <Alert type="warning">
			{  window.wpseoWorkoutsData.configuration.knowledgeGraphMessage }
		</Alert> }
		<p className="yst-text-sm yst-whitespace-pre-line yst-w-[463px] yst-mb-8">
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
			{ ( ! state.companyName || ! state.companyLogo ) && <Alert type="warning">
				{ __(
					// eslint-disable-next-line max-len
					"You need to set an organization name and logo for structured data to work properly.",
					"wordpress-seo"
				) }
			</Alert> }
			<OrganizationSection
				dispatch={ dispatch }
				imageUrl={ state.companyLogo }
				organizationName={ state.companyName }
			/>
		</Fragment> }
		{ siteRepresentsPerson && <Fragment>
			{ ( ! state.personLogo || state.personId === 0 ) && <Alert type="warning">
				{ __(
					// eslint-disable-next-line max-len
					"You need to set a person name and logo for structured data to work properly.",
					"wordpress-seo"
				) }
			</Alert> }
			<PersonSection
				dispatch={ dispatch }
				imageUrl={ state.personLogo }
				personId={ state.personId }
			/>
		</Fragment> }
		{ window.wpseoWorkoutsData.canEditWordPressOptions && <TextInput
			id="site-tagline-input"
			name="site-tagline"
			label={ __( "Site tagline", "wordpress-seo" ) }
			description={ sprintf( __( "Add a catchy tagline that describes your site in the best light. Use the keywords you want people to find your site with. Example: %1$s’s tagline is ‘SEO for everyone.’", "wordpress-seo" ), "Yoast" ) }
			value={ state.siteTagline }
			onChange={ onSiteTaglineChange }
		/> }
		{ siteRepresentationEmpty && <Alert type="warning">
			{ __(
				// eslint-disable-next-line max-len
				"Please be aware that you need to set a name and logo in step 2 for structured data to work properly.",
				"wordpress-seo"
			) }
		</Alert> }
	</Fragment>;
}
