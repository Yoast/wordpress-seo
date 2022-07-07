import apiFetch from "@wordpress/api-fetch";
import { Button } from "@yoast/ui-library";
import { __, sprintf } from "@wordpress/i18n";
import { Card } from "./card";
import { ReactComponent as AlgoliaLogo } from "../../../images/algolia-logo.svg";
import { ReactComponent as RyteLogo } from "../../../images/ryte-logo.svg";
import { ReactComponent as SemrushLogo } from "../../../images/semrush-logo.svg";
import { ReactComponent as WincherLogo } from "../../../images/wincher-logo.svg";
import { ReactComponent as ZapierLogo } from "../../../images/zapier-logo.svg";
import { ReactComponent as WordProofLogo } from "../../../images/wordproof-logo.svg";
import { ReactComponent as WooCommerceLogo } from "../../../images/woocommerce-logo.svg";


const SEOTools = [
	{
		name: "Semrush",
		slug: "semrush",
		description: "The Semrush integration offers suggestions and insights for keywords related to the entered focus keyphrase.",
		isPremium: false,
		logo: <SemrushLogo />,
	},
	{
		name: "Wincher",
		slug: "wincher",
		description: "The Wincher integration offers the option to track specific keyphrases and gain insights in their positions.",
		isPremium: false,
		logo: <WincherLogo />,
		usps: [ "this", "is", "an", "example" ],
	},
	{
		name: "Ryte",
		slug: "ryte",
		description: "Ryte will check weekly if your site is still indexable by search engines and Yoast SEO will notify you when this is not the case. Read more about how Ryte works.",
		isPremium: false,
		logo: <RyteLogo />,
	},
	{
		name: "WordProof",
		slug: "wordproof",
		description: "WordProof can be used to timestamp your privacy page. Read more about how WordProof works.",
		isPremium: false,
		logo: <WordProofLogo />,

	},
	{
		name: "Zapier",
		slug: "zapier",
		description: "Set up automated actions when you publish or update your content. By connecting Yoast SEO with Zapier, you can easily send out your published posts to any of its 2000+ destinations, such as Twitter, Facebook and more. Find out more about our Zapier integration.",
		isPremium: true,
		logo: <ZapierLogo />,
	},
	{
		name: "Algolia",
		slug: "algolia",
		description: "Improve the quality of your site search! Automatically helps your users find your cornerstone and most important content in your internal search results. It also removes noindexed posts & pages from your site’s search results. Find out more about our Algolia integration.",
		isPremium: true,
		logo: <AlgoliaLogo />,
	},
];

const pluginIntegrations = [
	{
		name: "Elementor",
		description: "Optimize your content right inside the Elementor site builder.",
		isPremium: false,
		logo: null,
	},
	{
		name: "Jetpack",
		description: "Short descriptive copy that tells about the integrations and its value.",
		isPremium: false,
		logo: null,
	},
	{
		name: "WooCommerce",
		description: "Short descriptive copy that tells about the integrations and its value.",
		isPremium: false,
		logo: <WooCommerceLogo />,
	},
	{
		name: "ACF",
		description: "Short descriptive copy that tells about the integrations and its value.",
		isPremium: false,
		logo: null,
	},
];

/**
 * Collects an integration initial state from the window object.
 *
 * @param {string} integrationSlug The integration slug.
 *
 * @returns {bool} True if the integration is active, false otherwise.
 */
const getInitialState = ( integrationSlug ) => {
	const integration = integrationSlug === "ryte" ? "ryte_indexability" : `${ integrationSlug }_integration_active`;
	return Boolean( window.wpseoIntegrationsData[ integration ] );
};
const basePath = "yoast/v1/integrations";

/**
 * Updates an integration state.
 *
 * @param {string} integrationSlug The integration slug.
 * @param {bool} setActive If the integration must be activated.
*
	* @returns {Promise|bool} A promise, or false if the call fails.
	*/
const updateIntegrationState = async( integrationSlug, setActive ) => {
	const response = await apiFetch( {
		path: `${basePath}/set_${integrationSlug}_active`,
		method: "POST",
		data: { active: setActive },
	} );
	return await response.json;
};
const isPremiumInstalled = Boolean( window.wpseoScriptData.isPremium );
const upsellLink = "https://yoa.st/workout-orphaned-content-upsell";

/**
 * The main thing.
 *
 * @param {string} integrationSlug The integration slug.
 * @param {bool} setActive If the integration must be activated.
 *
 * @returns {JSX.Element}the components grid.
*/
export default function IntegrationsGrid() {
	return (
		<div className="yst-h-full yst-flex yst-flex-col yst-bg-white">
			<div className="yst-flex-grow yst-max-w-6xl yst-p-8">
				<section>
					<div className="yst-mb-8">
						<h2 className="yst-mb-2 yst-text-lg">Recommended Integrations</h2>
						<p className="yst-text-tiny">Section description...</p>
					</div>
					<div className="yst-grid yst-grid-cols-1 yst-gap-6 sm:yst-grid-cols-2 md:yst-grid-cols-3 lg:yst-grid-cols-4">
						{ SEOTools.map( ( integration, index ) => {
							const toggleLabel = sprintf(
								// translators: %1$s and %3$s are replaced by opening and closing anchor tags. %2$s is replaced by "Yoast SEO"
								__(
									"Enable %1$s",
									"wordpress-seo"
								),
								integration.name
							);
							return (
								<Card
									key={ index }
									initialState={ getInitialState( integration.slug ) }
									beforeToggle={ updateIntegrationState }
									integrationSlug={ integration.slug }
								>
									<Card.Header>
										{ integration.logo }
									</Card.Header>
									<Card.Content>
										<h4 className="yst-flex yst-items-center yst-text-base yst-mb-3">
											<span>{ integration.name }</span>
										</h4>
										{ integration.description && <p> { integration.description } </p> }
										{ integration.usps && <ul className="yst-space-y-3">
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
										</ul> }
									</Card.Content>
									{ ( ( integration.isPremium && isPremiumInstalled ) || ! integration.isPremium )
										? <Card.ToggleFooter toggleLabel={ toggleLabel } />
										: <Card.Footer>
											<Button id={ `${integration.name}-upsell-button` } type="button" as="a" href={ upsellLink } variant="upsell" className="yst-w-full yst-text-gray-800">
												<svg xmlns="http://www.w3.org/2000/svg" className="yst--ml-1 yst-mr-2 yst-h-5 yst-w-5 yst-text-yellow-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
													<path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
												</svg>
												{ __( "Unlock with Premium", "wordpress-seo" ) }
											</Button>
										</Card.Footer>
									}
								</Card>
							);
						} ) }
					</div>
				</section>

				<hr className="yst-my-12" />

				<section>

					<div className="yst-mb-8">
						<h2 className="yst-mb-2 yst-text-lg">Plugin Integrations</h2>
						<p className="yst-text-tiny">Section description...</p>
					</div>
					<div className="yst-grid yst-grid-cols-1 yst-gap-6 sm:yst-grid-cols-2 md:yst-grid-cols-3 lg:yst-grid-cols-4">
						{ pluginIntegrations.map( ( integration, index ) => {
							return (
								<Card
									key={ index }
									initialState={ true }
									integrationSlug={ integration.slug }
								>
									<Card.Header>
										{ integration.logo && integration.logo }
									</Card.Header>
									<Card.Content>
										<h4 className="yst-flex yst-items-center yst-text-base yst-mb-3">
											<span>{ integration.name }</span>
										</h4>
										{ integration.description && <p> { integration.description } </p> }
										{ integration.usps && <ul className="yst-space-y-3">
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
										</ul> }
									</Card.Content>
									<Card.Footer />
								</Card>
							);
						} ) }
					</div>
				</section>
			</div>
		</div>
	);
}
