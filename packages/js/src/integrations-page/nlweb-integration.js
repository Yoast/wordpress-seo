import CheckIcon from "@heroicons/react/solid/CheckIcon";
import { Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Button } from "@yoast/ui-library";
import { SimpleIntegration } from "./simple-integration";

/**
 * Represents the NLWeb integration.
 *
 * The integration has no toggle of its own: it is driven by the Schema aggregation endpoint
 * setting, so the card reports that setting's state and links to it rather than duplicating it.
 *
 * @param {Object} props Component props.
 * @param {Object} props.integration The integration.
 * @param {string} [props.integration.name] The integration name.
 * @param {import("react").ReactNode} [props.integration.claim] The integration claim, shown as the card heading.
 * @param {string} [props.integration.slug] The integration slug.
 * @param {string} [props.integration.description] The integration description.
 * @param {Array} [props.integration.usps] The unique selling points of the integration.
 * @param {Function} [props.integration.logo] The logo component.
 * @param {boolean} [props.integration.isNew] Whether to show the "New" badge.
 * @param {boolean} [props.isActive=true] The integration state.
 *
 * @returns {JSX.Element} A card representing an integration.
 */
export const NlwebIntegration = ( { integration, isActive = true } ) => {
	return (
		<SimpleIntegration
			integration={ integration }
			isActive={ isActive }
		>
			{ isActive && <Fragment>
				<span className="yst-text-slate-700 yst-font-medium">{ __( "Integration active", "wordpress-seo" ) }</span>
				<CheckIcon
					className="yst-h-5 yst-w-5 yst-text-green-400 yst-flex-shrink-0"
				/>
			</Fragment> }
			{ ! isActive && <Fragment>
				<Button
					id={ `${ integration.slug }-enable-button` }
					type="button"
					as="a"
					variant="secondary"
					href="?page=wpseo_page_settings#/site-features#card-wpseo-enable_schema_aggregation_endpoint"
					className="yst-w-full yst-text-slate-800 yst-text-center"
				>
					{ __( "Enable in Site features", "wordpress-seo" ) }
				</Button>
			</Fragment> }
		</SimpleIntegration>
	);
};
