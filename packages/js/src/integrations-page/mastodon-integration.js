import CheckIcon from "@heroicons/react/solid/CheckIcon";
import XIcon from "@heroicons/react/solid/XIcon";
import { Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { SimpleIntegration } from "./simple-integration";

/** @typedef {import("./simple-integration").Integration} Integration */

/**
 * Represents the Mastodon integration.
 *
 * @param {Object} props Component props.
 * @param {Integration} props.integration The integration.
 * @param {boolean} [props.isActive=true] The integration state.
 *
 * @returns {JSX.Element} A card representing an integration.
 */
export const MastodonIntegration = ( { integration, isActive = true } ) => {
	return (
		<SimpleIntegration
			integration={ integration }
			isActive={ isActive }
		>
			{ isActive && <Fragment>
				<span className="yst-text-slate-700 yst-font-medium">{ __( "Mastodon profile added", "wordpress-seo" ) }</span>
				<CheckIcon
					className="yst-h-5 yst-w-5 yst-text-green-400 yst-flex-shrink-0"
				/>
			</Fragment> }
			{ ! isActive && <Fragment>
				<span className="yst-text-slate-700 yst-font-medium">
					{
						__( "Mastodon profile not yet added", "wordpress-seo" )
					}
				</span>
				<XIcon
					className="yst-h-5 yst-w-5 yst-text-red-500 yst-flex-shrink-0"
				/>
			</Fragment> }
		</SimpleIntegration>
	);
};
