import domReady from "@wordpress/dom-ready";
import { render } from "@wordpress/element";
import { Root } from "@yoast/ui-library";
import { get } from "lodash";
import Card from "./integrations-page/tailwind-components/card";
import { ReactComponent as AlgoliaLogo } from "../images/algolia-logo.svg";
import { ReactComponent as RyteLogo } from "../images/ryte-logo.svg";
import { ReactComponent as SemrushLogo } from "../images/semrush-logo.svg";
import { ReactComponent as WincherLogo } from "../images/wincher-logo.svg";
import { ReactComponent as ZapierLogo } from "../images/zapier-logo.svg";
import { ReactComponent as WordProofLogo } from "../images/wordproof-logo.svg";
import { ReactComponent as WooCommerce } from "../images/woocommerce-logo.svg";

domReady( () => {
	const context = {
		isRtl: Boolean( get( window, "wpseoScriptData.metabox.isRtl", false ) ),
	};
	const root = document.getElementById( "wpseo-integrations" );
	if ( ! root ) {
		return;
	}

	const seoTools = [
		{
			name: "Semrush",
			description: "The Semrush integration offers suggestions and insights for keywords related to the entered focus keyphrase.",
			isPremium: false,
			logo: <SemrushLogo />,
		},
		{
			name: "Wincher",
			description: "The Wincher integration offers the option to track specific keyphrases and gain insights in their positions.",
			isPremium: false,
			logo: <WincherLogo />,
			usps: [ "this", "is", "an", "example" ],
		},
		{
			name: "Ryte",
			description: "Ryte will check weekly if your site is still indexable by search engines and Yoast SEO will notify you when this is not the case. Read more about how Ryte works.",
			isPremium: false,
			logo: <RyteLogo />,
		},
		{
			name: "WordProof",
			description: "WordProof can be used to timestamp your privacy page. Read more about how WordProof works.",
			isPremium: false,
			logo: <WordProofLogo />,
		},
		{
			name: "Zapier",
			description: "Set up automated actions when you publish or update your content. By connecting Yoast SEO with Zapier, you can easily send out your published posts to any of its 2000+ destinations, such as Twitter, Facebook and more. Find out more about our Zapier integration.",
			isPremium: true,
			logo: <ZapierLogo />,
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
			logo: <WooCommerce />,
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
	 * @param {string} integrationName The integration name.
	 *
	 * @returns {bool} True if the integration is active, false otherwise.
	 */
	const getInitialState = ( integrationName ) => {
		const integration = integrationName === "Ryte" ? "ryte_indexability" : `${ integrationName.toLowerCase() }_integration_active`;
		if ( [ "Elementor", "Jetpack", "WooCommerce", "ACF" ].includes( integrationName ) ) {
			return true;
		}
		return Boolean( window.wpseoIntegrationsData[ integration ] );
	};
	render(
		<Root context={ context }>
			<div className="yst-h-full yst-flex yst-flex-col yst-bg-white">

				<div className="yst-flex-grow yst-max-w-6xl yst-p-8">
					<section>
						<div className="yst-mb-8">
							<h2 className="yst-mb-2 yst-text-lg">SEO tools</h2>
							<p className="yst-text-tiny">Section description...</p>
						</div>
						<div className="yst-grid yst-grid-cols-1 yst-gap-6 sm:yst-grid-cols-2 md:yst-grid-cols-3 lg:yst-grid-cols-4">
							{ seoTools.map( ( integration, index ) => {
								return (
									<Card
									key={ index }
									/* eslint-disable max-len */
									integration={ { name: integration.name, description: integration.description, isActive: getInitialState( integration.name ), isPremium: integration.isPremium, logo: integration.logo, usps: integration.usps } }
									/>
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
									/* eslint-disable max-len */
									integration={ { name: integration.name, description: integration.description, isActive: getInitialState( integration.name ), isPremium: integration.isPremium, logo: integration.logo, usps: integration.usps } }
									/>
									);
								} ) }
						</div>
					</section>
				</div>
			</div>
		</Root>,
		root
	);
} );
