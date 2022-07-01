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

domReady( () => {
	const context = {
		isRtl: Boolean( get( window, "wpseoScriptData.metabox.isRtl", false ) ),
	};
	const root = document.getElementById( "wpseo-integrations" );
	if ( ! root ) {
		return;
	}

	const integrations = [
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
			logo: <SemrushLogo />,

		},
		{
			name: "Zapier",
			description: "Set up automated actions when you publish or update your content. By connecting Yoast SEO with Zapier, you can easily send out your published posts to any of its 2000+ destinations, such as Twitter, Facebook and more. Find out more about our Zapier integration.",
			isPremium: true,
			logo: <ZapierLogo />,
		},
		{
			name: "Algolia",
			description: "Improve the quality of your site search! Automatically helps your users find your cornerstone and most important content in your internal search results. It also removes noindexed posts & pages from your site’s search results. Find out more about our Algolia integration.",
			isPremium: true,
			logo: <AlgoliaLogo />,
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
		return Boolean( window.wpseoIntegrationsData[ integration ] );
	};
	render(
		<Root context={ context }>
			<div className="yst-flex yst-flex-wrap yst-justify-items-start yst-max-w-[1200px] yst-py-6">
				{ integrations.map( ( integration, index ) => {
					return (
						<Card
							key={ index }
							integration={ { name: integration.name, description: integration.description, isActive: getInitialState( integration.name ), isPremium: integration.isPremium, logo: integration.logo } }
						/>
					);
				} ) }
			</div>
		</Root>,
		root
	);
} );
