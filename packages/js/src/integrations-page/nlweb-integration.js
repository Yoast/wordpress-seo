import CheckIcon from "@heroicons/react/solid/CheckIcon";
import { Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Button } from "@yoast/ui-library";
import { SimpleIntegration } from "./simple-integration";

/** @typedef {import("./simple-integration").Integration} Integration */

/**
 * Represents the NLWeb integration.
 *
 * The integration has no toggle of its own: it is driven by the Schema aggregation endpoint
 * setting, so the card reports that setting's state and links to it rather than duplicating it.
 *
 * @param {Object} props Component props.
 * @param {Integration} props.integration The integration.
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
