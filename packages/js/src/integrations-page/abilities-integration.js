import CheckIcon from "@heroicons/react/solid/CheckIcon";
import XIcon from "@heroicons/react/solid/XIcon";
import { Fragment } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { SimpleIntegration } from "./simple-integration";

/**
 * Represents the WordPress Abilities API integration.
 *
 * The abilities register themselves whenever the Abilities API is present, so the card reports
 * availability rather than offering a switch.
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
export const AbilitiesIntegration = ( { integration, isActive = true } ) => {
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
				<span className="yst-text-slate-700 yst-font-medium">
					{
						sprintf(
							/* translators: 1: Minimum required WordPress version, e.g. 6.9. */
							__( "Requires WordPress %s or newer", "wordpress-seo" ),
							"6.9"
						)
					}
				</span>
				<XIcon
					className="yst-h-5 yst-w-5 yst-text-red-500 yst-flex-shrink-0"
				/>
			</Fragment> }
		</SimpleIntegration>
	);
};
