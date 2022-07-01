import domReady from "@wordpress/dom-ready";
import { render } from "@wordpress/element";
import { Root } from "@yoast/ui-library";
import { get } from "lodash";
import Card from "./integrations-page/tailwind-components/card";

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
			description: "Semrush Description",
			isPremium: false,
		},
		{
			name: "Wincher",
			description: "Wincher Description",
			isPremium: false,
		},
		{
			name: "Zapier",
			description: "Zapier Description",
			isPremium: true,
		},
		{
			name: "WordProof",
			description: "WordProof Description",
			isPremium: false,
		},
		{
			name: "Ryte",
			description: "Ryte Description",
			isPremium: false,
		},
		{
			name: "Algolia",
			description: "Algolia Description",
			isPremium: true,
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
			<div className="yst-flex yst-flex-wrap yst-justify-items-start yst-py-6">
				{ integrations.map( ( integration, index ) => {
					return (
						<Card
							key={ index }
							integration={ { name: integration.name, description: `${integration.description} description`, isActive: getInitialState( integration.name ), isPremium: integration.isPremium } }
						/>
					);
				} ) }
			</div>
		</Root>,
		root
	);
} );
