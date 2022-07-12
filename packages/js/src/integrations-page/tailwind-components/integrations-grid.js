import apiFetch from "@wordpress/api-fetch";
import { Slot } from "@wordpress/components";
import { useState, useCallback } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { PropTypes } from "prop-types";

import { Button, Badge, ToggleField } from "@yoast/ui-library";
import { Card } from "./card";
import AlgoliaLogo from "../../../images/algolia-logo.svg";
import ElementorLogo from "../../../images/elementor-logo.svg";
import JetpackLogo from "../../../images/jetpack-logo.svg";
import RyteLogo from "../../../images/ryte-logo.svg";
import SemrushLogo from "../../../images/semrush-logo.svg";
import WincherLogo from "../../../images/wincher-logo.svg";
import ZapierLogo from "../../../images/zapier-logo.svg";
import WordproofLogo from "../../../images/wordproof-logo.svg";
import WoocommerceLogo from "../../../images/woocommerce-logo.svg";

const isPremiumInstalled = Boolean( window.wpseoScriptData.isPremium );
const upsellLink         = "https://yoa.st/workout-orphaned-content-upsell";

const SEOTools = [
	{
		name: "Semrush",
		type: "toggleable",
		slug: "semrush",
		description: __( "The Semrush integration offers suggestions and insights for keywords related to the entered focus keyphrase.", "wordpress-seo" ),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: true,
		logo: SemrushLogo,
	},
	{
		name: "Wincher",
		type: "toggleable",
		slug: "wincher",
		description: __( "The Wincher integration offers the option to track specific keyphrases and gain insights in their positions.", "wordpress-seo" ),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: false,
		logo: WincherLogo,
	},
	{
		name: "Ryte",
		type: "toggleable",
		slug: "ryte",
		description: __( "Ryte will check weekly if your site is still indexable by search engines and Yoast SEO will notify you when this is not the case. Read more about how Ryte works.", "wordpress-seo" ),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: true,
		logo: RyteLogo,
	},
	{
		name: "WordProof",
		type: "toggleable",
		slug: "wordproof",
		description: __( "Together with WordProof, we've built an integration that will allow you to timestamp your privacy page. Using the blockchain, you can protect your content and help the web become more trustworthy. For yourself, as well as for SEO, since trust is a big factor for search engines as well.", "wordpress-seo" ),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: false,
		logo: WordproofLogo,

	},
	{
		name: "Zapier",
		type: "toggleable",
		slug: "zapier",
		description: __( "Seed up your workflow with automated actions when you publish or update your content.", "wordpress-seo" ),
		usps: [ __( "Automatically share your content on the platforms of your choice", "wordpress-seo" ), __( "Stay in control of how your content is being shared", "wordpress-seo" ), __( "Save time and focus on the tasks that need your attention", "wordpress-seo" ) ],
		isPremium: true,
		isNew: false,
		isMultisiteAvailable: true,
		logo: ZapierLogo,
	},
];

const pluginIntegrations = [
	{
		name: "Elementor",
		type: "builtin",
		description: __( "Optimize your content right inside the Elementor site builder.", "wordpress-seo" ),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: true,
		logo: ElementorLogo,
	},
	{
		name: "Jetpack",
		type: "builtin",
		description: __( "Short descriptive copy that tells about the integrations and its value.", "wordpress-seo" ),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: true,
		logo: JetpackLogo,
	},
	{
		name: "Algolia",
		type: "toggleable",
		slug: "algolia",
		description: __( "Improve the quality of your site search! Automatically helps your users find your cornerstone and most important content in your internal search results. It also removes noindexed posts & pages from your site’s search results. Find out more about our Algolia integration.", "wordpress-seo" ),
		usps: [ __( "Search results based on internal link count", "wordpress-seo" ), __( "Have your most important content show up first", "wordpress-seo" ), __( "Removes redundant articles like noindexed post and pages", "wordpress-seo" ) ],
		isPremium: true,
		isNew: false,
		isMultisiteAvailable: true,
		logo: AlgoliaLogo,
	},
	{
		name: "WooCommerce",
		type: "simple",
		description: __( "Short descriptive copy that tells about the integrations and its value.", "wordpress-seo" ),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: true,
		logo: WoocommerceLogo,
	},
	{
		name: "ACF",
		type: "simple",
		description: __( "Short descriptive copy that tells about the integrations and its value.", "wordpress-seo" ),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: true,
		logo: null,
	},
];

const partnerships = [
	{
		name: "Bertha",
		type: "simple",
		description: __( "Optimize your content right inside the Elementor site builder.", "wordpress-seo" ),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: true,
		logo: null,
	},
];

/**
 * Checks if an integration is active.
 *
 * @param {object} integration The integration.
 *
 * @returns {bool} True if the integration is active, false otherwise.
 */
const getInitialState = ( integration ) => {
	const integrationOption = `${ integration.slug }_integration_active`;
	return Boolean( window.wpseoIntegrationsData[ integrationOption ] );
};

/**
 * Checks if an integration is network-enabled.
 *
 * @param {object} integration The integration.
 *
 * @returns {bool} True if the integration is active, false otherwise.
 */
const getIsNetworkControlEnabled = ( integration ) => {
	if ( ! window.wpseoIntegrationsData.is_multisite ) {
		return true;
	}

	const integrationOption = `allow_${ integration.slug }_integration`;

	return Boolean( window.wpseoIntegrationsData[ integrationOption ] );
};

/**
 * Checks if an integration is network-enabled.
 *
 * @param {object} integration The integration.
 *
 * @returns {bool} True if the integration is active, false otherwise.
 */
const getIsMultisiteAvailable = ( integration ) => {
	if ( ! window.wpseoIntegrationsData.is_multisite ) {
		return true;
	}

	return integration.isMultisiteAvailable;
};

/**
 * Checks if an integration available under those two circumstances:
 * 1) is a free integration;
 * 2) is premium and premium is active.
 *
 * @param {object} integration The integration.
 *
 * @returns {bool} True if the integration is available to the user.
 */
const getIsFreeIntegrationOrPremiumAvailable = ( integration ) => {
	return ( integration.isPremium && isPremiumInstalled ) || ! integration.isPremium;
};

/* eslint-disable complexity */
/**
 * Checks the conditions for which a card is active
 *
 * @param {object} integration The integration
 * @param {bool}   activeState True if the integration is active.
 *
 * @returns {bool} True if the integration is active, false otherwise.
 */
const getIsCardActive = ( integration, activeState ) => {
	const cardActive =  activeState;
	const networkControlEnabled = getIsNetworkControlEnabled( integration );
	const multisiteAvailable = getIsMultisiteAvailable( integration );
	const premium = getIsFreeIntegrationOrPremiumAvailable( integration );

	if ( premium ) {
		return cardActive && networkControlEnabled && multisiteAvailable;
	}

	return networkControlEnabled && multisiteAvailable;
};
/* eslint-enable complexity */

/**
 * Updates an integration state.
 *
 * @param {string} integration The integration.
 * @param {bool} setActive If the integration must be activated.
 *
 * @returns {Promise|bool} A promise, or false if the call fails.
*/
const updateIntegrationState = async( integration, setActive ) => {
	const basePath = "yoast/v1/integrations";

	const response = await apiFetch( {
		path: `${basePath}/set_${integration.slug}_active`,
		method: "POST",
		data: { active: setActive },
	} );
	return await response.json;
};

/* eslint-disable complexity */
/**
 * An integration which can be toggled on and off.
 *
 * @param {object}    integration             The integration.
 * @param {bool}      InitialActivationState  True if the integration has been activated by the user.
 * @param {bool}      isNetworkControlEnabled True if the integration is network-enabled.
 * @param {string}    toggleLabel             The toggle label.
 * @param {function}  beforeToggle            Check function to call before toggling the integration.
 *
 * @returns {WPElement} A card representing an integration which can be toggled active by the user.
 */
const ToggleableIntegration = ( {
	integration,
	InitialActivationState,
	isNetworkControlEnabled,
	isMultisiteAvailable,
	toggleLabel,
	beforeToggle } ) => {
	const [ isActive, setIsActive ] = useState( InitialActivationState );

	/**
	 * The toggle management.
	 *
	 * @returns {Boolean} The footer.
	 */
	 const toggleActive = useCallback(
	 async() => {
		 let canToggle = true;
		 const newState = ! isActive;
		 // Immediately switch the toggle for enhanced UX
		 setIsActive( newState );

		 if ( beforeToggle ) {
			 canToggle = false;
			 canToggle = await beforeToggle( integration, newState );
		 }
		 if ( ! canToggle ) {
			 // If something went wrong, switch the toggle back
			 setIsActive( ! newState );
		 }
	 }, [ isActive, beforeToggle, setIsActive ] );

	 return (
		<Card>
			<Card.Header>
				{ integration.logo && <img src={ integration.logo } alt={ `${ integration.name } logo` } className={ `${ getIsCardActive( integration, isActive ) ? "" : "yst-opacity-50 yst-filter yst-grayscale" }` } /> }
				{ ( ! isNetworkControlEnabled && isMultisiteAvailable ) && <Badge className="yst-absolute yst-top-2 yst-right-2">{ __( "Network Disabled", "wordpress-seo" ) }</Badge> }
				{ ( isNetworkControlEnabled && integration.isNew ) && <Badge className="yst-absolute yst-top-2 yst-right-2">{ __( "New", "wordpress-seo" ) }</Badge> }
			</Card.Header>
			<Card.Content>
				<div className={ `${ ( getIsCardActive( integration, isActive ) ) ? "" : "yst-opacity-50  yst-filter yst-grayscale" }` }>
					<h4 className="yst-flex yst-items-center yst-text-base yst-mb-3 yst-font-medium yst-text-[#111827]">
						<span>{ integration.name }</span>
					</h4>
					{ getIsFreeIntegrationOrPremiumAvailable( integration )
						? <p> { integration.description } </p>
						: <ul className="yst-space-y-3">
							{ integration.usps.map( ( usp, idx ) => {
								return (
									<li key={ idx } className="yst-flex yst-items-start">
										<svg xmlns="http://www.w3.org/2000/svg" className="yst-h-5 yst-w-5 yst-mr-2 yst-text-green-400 yst-flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
											<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
										</svg>
										<span> { usp } </span>
									</li>
								);
							} ) }
						</ul>
					}
				</div>
				{ isActive &&
					<Slot
						name={ `${integration.name}Slot` }
					/> }
			</Card.Content>
			<Card.Footer>
				{ ! getIsFreeIntegrationOrPremiumAvailable( integration ) && <Button id={ `${ integration.name }-upsell-button` } type="button" as="a" href={ upsellLink } variant="upsell" className="yst-w-full yst-text-gray-800">
					<svg xmlns="http://www.w3.org/2000/svg" className="yst--ml-1 yst-mr-2 yst-h-5 yst-w-5 yst-text-yellow-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
						<path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
					</svg>
					{ __( "Unlock with Premium", "wordpress-seo" ) }
				</Button>
				}
				{ getIsFreeIntegrationOrPremiumAvailable( integration ) && ! getIsMultisiteAvailable( integration ) && <p className="yst-flex yst-items-start yst-justify-between">
					<span className="yst-text-gray-700 yst-font-medium">{ __( "Integration unavailable for multisites", "wordpress-seo" ) }</span>
					<svg xmlns="http://www.w3.org/2000/svg" className="yst-h-5 yst-w-5 yst-text-green-500 yst-flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
						<path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
					</svg>
				</p>  }
				{ getIsFreeIntegrationOrPremiumAvailable( integration ) && getIsMultisiteAvailable( integration ) && <ToggleField checked={ isActive } label={ toggleLabel } onChange={ toggleActive } disabled={ ! isNetworkControlEnabled || ! isMultisiteAvailable }  className={ `${ getIsCardActive( integration, isActive ) ? "" : "yst-opacity-50 yst-filter yst-grayscale" }` } /> }
			</Card.Footer>
		</Card>
	 );
};

ToggleableIntegration.propTypes = {
	integration: PropTypes.shape( {
		name: PropTypes.string,
		type: PropTypes.string,
		slug: PropTypes.string,
		description: __( PropTypes.string, "wordpress-seo" ),
		usps: PropTypes.array,
		logo: PropTypes.string,
		isPremium: PropTypes.bool,
		isNew: PropTypes.bool,
		isMultisiteAvailable: PropTypes.bool,
	} ),
	InitialActivationState: PropTypes.bool,
	isNetworkControlEnabled: PropTypes.bool,
	isMultisiteAvailable: PropTypes.bool,
	toggleLabel: PropTypes.string,
	beforeToggle: PropTypes.func,
};

/* eslint-disable complexity */
/**
 * Represents an integration.
 *
 * @param {string} name                    The integration name.
 * @param {array}  usps                    The array of upselling points.
 * @param {string} description             The integration description.
 * @param {bool}   isBuiltin               True if the integration is builtin in the plugin
 * @param {bool}   isNew                   True if the integration must display the 'new' badge.
 * @param {bool}   isMultisiteAvailable    True if the integration can be used in WP multisite installations.
 * @param {string} logo                    The integration logo
 *
 * @returns {WPElement} A card representing an integration.
*/
const SimpleIntegration = ( {
	name,
	usps,
	description,
	isBuiltin,
	isNew,
	isMultisiteAvailable,
	logo } ) => {
	return (
		<Card>
			<Card.Header>
				{ logo && <img src={ logo } alt={ `${name} logo` } /> }
				{ ( isNew ) && <Badge className="yst-absolute yst-top-2 yst-right-2">{ __( "New", "wordpress-seo" ) }</Badge> }
			</Card.Header>
			<Card.Content>
				<h4 className="yst-flex yst-items-center yst-text-base yst-mb-3 yst-font-medium yst-text-[#111827]">
					<span>{ name }</span>
				</h4>
				{ description && <p> { description } </p> }
				{ usps && <ul className="yst-space-y-3">
					{ usps.map( ( usp, idx ) => {
						return (
							<li key={ idx } className="yst-flex yst-items-start">
								<svg xmlns="http://www.w3.org/2000/svg" className="yst-h-5 yst-w-5 yst-mr-2 yst-text-green-400 yst-flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
									<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
								</svg>
								<span> { usp } </span>
							</li>
						);
					} ) }
				</ul> }
			</Card.Content>
			<Card.Footer />
		</Card>
	);
};

SimpleIntegration.propTypes = {
	name: PropTypes.string,
	usps: PropTypes.array,
	isBuiltin: PropTypes.bool,
	isNew: PropTypes.bool,
	isMultisiteAvailable: PropTypes.bool,
	description: __( PropTypes.string, "wordpress-seo" ),
	logo: PropTypes.string,
};

/**
 * Renders a section.
 *
 * @param {string} title       The section title.
 * @param {string} description The section description.
 * @param {array}  elements    Array of elements to be rendered.
 *
 * @returns {WPElement} The section.
 */
const Section = ( { title, description, elements } ) => {
	return (
		<section>
			<div className="yst-mb-8">
				<h2 className="yst-mb-2 yst-text-lg">{ title }</h2>
				<p className="yst-text-tiny">{ description }</p>
			</div>
			<div className="yst-grid yst-grid-cols-1 yst-gap-6 sm:yst-grid-cols-2 md:yst-grid-cols-3 lg:yst-grid-cols-4">
				{ elements.map( ( integration, index ) => {
					const label = sprintf(
						// translators: %1$s expands to the name of the integration
						__(
							"Enable %1$s",
							"wordpress-seo"
						),
						integration.name
					);
					switch ( integration.type ) {
						case "toggleable":
							return (
								<ToggleableIntegration
									key={ index }
									integration={ integration }
									toggleLabel={ label }
									InitialActivationState={ getInitialState( integration ) }
									isNetworkControlEnabled={ getIsNetworkControlEnabled( integration ) }
									isMultisiteAvailable={ getIsMultisiteAvailable( integration ) }
									beforeToggle={ updateIntegrationState }
								/>
							);
						case "simple":
						case "builtin":
							return (
								<SimpleIntegration
									key={ index }
									name={ integration.name }
									isBuiltin={ integration.type === "builtin" }
									isNew={ integration.isNew }
									isMultisiteAvailable={ getIsMultisiteAvailable( integration ) }
									usps={ integration.usps }
									description={ integration.description }
									logo={ integration.logo }
								/>
							);
						default:
							break;
					}
				} ) }
			</div>
		</section>
	);
};

Section.propTypes = {
	title: PropTypes.string,
	description: __( PropTypes.string, "wordpress-seo" ),
	elements: PropTypes.array,
};

/**
 * Renders a grid of integrations subdivided into sections.
 *
 * @returns {WPElement} The integration grid.
*/
export default function IntegrationsGrid() {
	return (
		<div className="yst-h-full yst-flex yst-flex-col yst-bg-white">
			<div className="yst-flex-grow yst-max-w-6xl yst-p-8">

				<Section
					title={ __( "Recommended Integrations", "wordpress-seo" ) }
					description="description"
					elements={ SEOTools }
				/>

				<hr className="yst-my-12" />

				<Section
					title={ __( "Plugin Integrations", "wordpress-seo" ) }
					description="description"
					elements={ pluginIntegrations }
				/>

				<hr className="yst-my-12" />

				<Section
					title={ __( "Partnerships", "wordpress-seo" ) }
					description="description"
					elements={ partnerships }
				/>

			</div>
		</div>
	);
}
