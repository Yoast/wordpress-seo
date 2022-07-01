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

	const integrations = [ "semrush", "wincher", "zapier", "wordproof", "ryte", "algolia" ];

	/**
	 * Collects an integration initial state from the window object.
	 *
	 * @param {string} integrationName The integration name.
	 *
	 * @returns {bool} True if the integration is active, false otherwise.
	 */
	const getInitialState = ( integrationName ) => {
		const integration = integrationName === "ryte" ? "ryte_indexability" : `${ integrationName}_integration_active`;
		return Boolean( window.wpseoIntegrationsData[ integration ] );
	};
	render(
		<Root context={ context }>
			<div className="yst-flex yst-flex-wrap yst-justify-items-start yst-py-6">
				{ integrations.map( ( integrationName, index ) => {
					return (
						<Card
							key={ index }
							integration={ { name: integrationName, description: `${integrationName} description`, isActive: getInitialState( integrationName ) } }
						/>
					);
				} ) };
			</div>
		</Root>,
		root
	);
} );
