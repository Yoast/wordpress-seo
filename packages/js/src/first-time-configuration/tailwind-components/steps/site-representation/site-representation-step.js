import { Fragment, useCallback, useState } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import classNames from "classnames";
import PropTypes from "prop-types";
import ReactAnimateHeight from "react-animate-height";

import Alert, { FadeInAlert } from "../../base/alert";
import SingleSelect from "../../base/single-select";
import TextInput from "../../base/text-input";
import { OrganizationSection } from "./organization-section";
import { PersonSection } from "./person-section";
import { safeCreateInterpolateElement } from "../../../../helpers/i18n";
import { ExternalLinkIcon } from "@heroicons/react/solid";
import { LocationMarkerIcon, ShoppingCartIcon } from "@heroicons/react/outline";
import { Button } from "@yoast/ui-library";
import UpsellNotice from "../../base/upsell-notice";

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
	}, [ setSectionOpacity ] );

	const handleWebsiteNameChange = useCallback( ( event ) => {
		dispatch( { type: "CHANGE_WEBSITE_NAME", payload: event.target.value } );
	}, [ dispatch ] );

	const richResultsMessage = safeCreateInterpolateElement(
		sprintf(
			/* translators: %1$s expands to opening 'span' HTML tag, %2$s expands to closing 'span' HTML tag,
			%3$s expands to opening 'a' HTML tag, %4$s expands to closing 'a' HTML tag. */
			__( "Completing this step helps Google to understand your site even better. %1$sBonus%2$s: You'll improve your chance of getting %3$srich results%4$s!", "wordpress-seo" ),
			"<span>",
			"</span>",
			"<a>",
			"</a>"
		),
		{
			span: <span className="yst-text-slate-800 yst-font-medium" />,
			// eslint-disable-next-line jsx-a11y/anchor-has-content
			a: <a
				id="yoast-configuration-rich-text-link"
				href="https://yoa.st/config-workout-rich-results"
				target="_blank"
				rel="noopener noreferrer"
			/>,
		}
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
						{ __( "Tell us! Is your site about an organization or a person?", "wordpress-seo" ) }
						<br />
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
		{ ! state.isPremium && state.isWooCommerceActive && ! state.isWooCommerceSeoActive && <UpsellNotice className="yst-mt-6 yst-gap-2">
			<div className="yst-flex yst-flex-col yst-gap-1">
				<div className="yst-flex yst-gap-2 yst-items-center">
					<ShoppingCartIcon className="yst-text-primary-300 yst-w-4 yst-h-4 yst-inline-block" />
					<p className="yst-font-medium yst-text-slate-800">
						{ __( "Running an online store?", "wordpress-seo" ) }
					</p>
				</div>
				<p>
					{
						sprintf(
							/* translators: %s expands to Yoast WooCommerce SEO. */
							__( "%s helps your products stand out in Google Shopping and Rich Results.", "wordpress-seo" ),
							"Yoast WooCommerce SEO"
						)
					}
				</p>
			</div>
			<p className="yst-mt-4">
				<Button
					id="ftc-indexing-learn-more"
					as="a"
					href={ window.wpseoFirstTimeConfigurationData.shortlinks.reprWoocommerceLearnMore }
					variant="tertiary"
					target="_blank"
					className="yst-p-0"
				>
					{
						sprintf(
							/* translators: %s expands to WooCommerce SEO. */
							__( "Learn more about %s", "wordpress-seo" ),
							"WooCommerce SEO"
						)
					}
					<span className="yst-sr-only">
						{
							/* translators: Hidden accessibility text. */
							__( "(Opens in a new browser tab)", "wordpress-seo" )
						}
					</span>
					<ExternalLinkIcon className="yst-ms-1 yst-w-4 yst-h-4 yst-icon-rtl" />
				</Button>
			</p>
		</UpsellNotice> }
		{ state.companyOrPerson === "company" && ! state.isPremium && ! state.isWooCommerceActive && <UpsellNotice className="yst-mt-6 yst-gap-2">
			<div className="yst-flex yst-flex-col yst-gap-1">
				<div className="yst-flex yst-gap-2 yst-items-center">
					<LocationMarkerIcon className="yst-text-primary-300 yst-w-4 yst-h-4 yst-inline-block" />
					<p className="yst-font-medium yst-text-slate-800">
						{ __( "Have a physical location?", "wordpress-seo" ) }
					</p>
				</div>
				<p>
					{
						sprintf(
							/* translators: %s expands to Yoast Local SEO. */
							__( "%s helps you show up in Google Maps and local results. Complete your visibility where it matters most!", "wordpress-seo" ),
							"Yoast Local SEO"
						)
					}
				</p>
			</div>
			<p className="yst-mt-4">
				<Button
					id="ftc-indexing-learn-more"
					as="a"
					href={ window.wpseoFirstTimeConfigurationData.shortlinks.reprLocalLearnMore }
					variant="tertiary"
					target="_blank"
					className="yst-p-0"
				>
					{
						sprintf(
							/* translators: %s expands to Local SEO. */
							__( "Learn more about %s", "wordpress-seo" ),
							"Local SEO"
						)
					}
					<span className="yst-sr-only">
						{
							/* translators: Hidden accessibility text. */
							__( "(Opens in a new browser tab)", "wordpress-seo" )
						}
					</span>
					<ExternalLinkIcon className="yst-ms-1 yst-w-4 yst-h-4 yst-icon-rtl" />
				</Button>
			</p>
		</UpsellNotice> }
	</Fragment>;
}

SiteRepresentationStep.propTypes = {
	onOrganizationOrPersonChange: PropTypes.func.isRequired,
	dispatch: PropTypes.func.isRequired,
	state: PropTypes.object.isRequired,
	siteRepresentationEmpty: PropTypes.bool.isRequired,
};
