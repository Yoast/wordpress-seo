import { __, sprintf } from "@wordpress/i18n";
import { PropTypes } from "prop-types";
import { Title  } from "@yoast/ui-library";
import { SEOToolsIntegrations } from "./seo-tools-integrations";
import { pluginIntegrations } from "./plugin-integrations";
import { schemaAPIIntegrations } from "./schema-api-integrations";
import { addLinkToString } from "../helpers/stringHelpers";

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
				<h2 className="yst-mb-2 yst-text-lg yst-font-medium">{ title }</h2>
				<p className="yst-text-tiny">{ description }</p>
			</div>
			<div className="yst-grid yst-grid-cols-1 yst-gap-6 sm:yst-grid-cols-2 md:yst-grid-cols-3 lg:yst-grid-cols-4">
				{ elements }
			</div>
		</section>
	);
};

Section.propTypes = {
	title: PropTypes.string,
	description: PropTypes.string,
	elements: PropTypes.array,
};

/**
 * Renders a grid of integrations subdivided into sections.
 *
 * @returns {WPElement} The integration grid.
*/
export default function IntegrationsGrid() {
	return (
		<div className="yst-h-full yst-flex yst-flex-col yst-bg-white yst-rounded-lg yst-shadow">
			<header className="yst-border-b yst-border-slate-200">
				<div className="yst-max-w-screen-sm yst-p-8">
					<Title
						as="h1"
						className="yst-flex yst-items-center"
					>
						{
							__( "Integrations", "wordpress-seo" )
						}
					</Title>
					<p className="yst-text-tiny yst-mt-3">
						{
							sprintf(
								/* translators: 1: Yoast SEO */
								__( "%s can integrate with third party products. You can enable or disable these integrations below.", "wordpress-seo" ),
								"Yoast SEO"
							)
						}
					</p>
				</div>
			</header>
			<div className="yst-flex-grow yst-max-w-6xl yst-p-8">

				<Section
					title={ __( "SaaS integrations", "wordpress-seo" ) }
					elements={ SEOToolsIntegrations }
				/>

				<hr className="yst-my-12" />

				<Section
					title={ __( "Schema API integrations", "wordpress-seo" ) }
					description={
						addLinkToString(
							sprintf(
								/* translators: 1: anchor tag linking to our schema API docs; 2: closing anchor tag. */
								__( "Many plugins integrate with our %1$sSchema API%2$s to help you get the best results in Google search!", "wordpress-seo" ),
								"<a>",
								"</a>"
							),
							"https://developer.yoast.com/features/schema/api/",
							"schema-api-link"
						)
					}
					elements={ schemaAPIIntegrations }
				/>

				<hr className="yst-my-12" />

				<Section
					title={ __( "Plugin integrations", "wordpress-seo" ) }
					elements={ pluginIntegrations }
				/>

			</div>
		</div>
	);
}
