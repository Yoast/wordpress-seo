import { __, sprintf } from "@wordpress/i18n";
import { Alert, Title } from "@yoast/ui-library";
import { get } from "lodash";
import { PropTypes } from "prop-types";
import { addLinkToString } from "../helpers/stringHelpers";
import { safeCreateInterpolateElement } from "../helpers/i18n";
import { OtherIntegrations } from "./other-integrations";
import { pluginIntegrations } from "./plugin-integrations";
import { RecommendedIntegrations } from "./recommended-integrations";
import { schemaAPIIntegrations } from "./schema-api-integrations";

/**
 * Renders a section.
 *
 * @param {string} [title] The section title.
 * @param {JSX.Element} [description] The section description.
 * @param {JSX.Element} [alert] Optional alert to show when the schema is disabled.
 * @param {Array<JSX.Element>} [elements] Array of elements to be rendered.
 *
 * @returns {JSX.Element} The section.
 */
const Section = ( { title = "", description = "", alert = null, elements = [] } ) => {
	return (
		<section>
			<div className="yst-mb-8">
				<h2 className="yst-mb-2 yst-text-lg yst-font-medium">{ title }</h2>
				<p className="yst-text-tiny">{ description }</p>
			</div>
			{ alert && <div className="yst-mb-8 yst-max-w-xl">{ alert }</div> }
			<div className="yst-grid yst-grid-cols-1 yst-gap-6 sm:yst-grid-cols-2 md:yst-grid-cols-3 lg:yst-grid-cols-4">
				{ elements }
			</div>
		</section>
	);
};

Section.propTypes = {
	title: PropTypes.string,
	description: PropTypes.node,
	alert: PropTypes.node,
	elements: PropTypes.array,
};

/**
 * Renders a grid of integrations subdivided into sections.
 *
 * @returns {JSX.Element} The integration grid.
 */
export default function IntegrationsGrid() {
	const isSchemaFrameworkDisabled = ! get( window, "wpseoIntegrationsData.schema_framework_enabled", true );

	const schemaDisabledAlert = safeCreateInterpolateElement(
		sprintf(
			/* translators: 1: anchor tag linking to the schema framework settings page; 2: closing anchor tag. */
			__( "To make use of the Schema API integrations enable the %1$sSchema Framework%2$s.", "wordpress-seo" ),
			"<a>",
			"</a>"
		),
		{
			// eslint-disable-next-line jsx-a11y/anchor-has-content
			a: <a id="schema-framework-settings-link" href="admin.php?page=wpseo_page_settings#/schema-framework" />,
		}
	);

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
								__( "%s can integrate with other products, to help you further improve your website. You can enable or disable these integrations below.", "wordpress-seo" ),
								"Yoast SEO"
							)
						}
					</p>
				</div>
			</header>
			<div className="yst-flex-grow yst-max-w-6xl yst-p-8">

				<Section
					title={ __( "Recommended integrations", "wordpress-seo" ) }
					elements={ RecommendedIntegrations }
				/>

				<hr className="yst-my-12" />

				<Section
					title={ __( "Schema API integrations", "wordpress-seo" ) }
					description={
						addLinkToString(
							sprintf(
								/* translators: 1: anchor tag linking to our schema API docs; 2: closing anchor tag. */
								__( "Unlock rich results in Google search by using plugins that integrate with the %1$sYoast Schema API%2$s.", "wordpress-seo" ),
								"<a>",
								"</a>"
							),
							"https://developer.yoast.com/features/schema/api/",
							"schema-api-link"
						)
					}
					alert={ isSchemaFrameworkDisabled && (
						<Alert id="schema-disabled-alert" variant="info">
							<span className="yst-block yst-font-medium yst-mb-2">{ __( "All Schema API integrations are disabled", "wordpress-seo" ) }</span>
							{ schemaDisabledAlert }
						</Alert>
					) }
					elements={ schemaAPIIntegrations }
				/>

				<hr className="yst-my-12" />

				<Section
					title={ __( "Plugin integrations", "wordpress-seo" ) }
					elements={ pluginIntegrations }
				/>

				<hr className="yst-my-12" />

				<Section
					title={ __( "Other integrations", "wordpress-seo" ) }
					elements={ OtherIntegrations }
				/>

			</div>
		</div>
	);
}
