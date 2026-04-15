import { __ } from "@wordpress/i18n";
import { IntentBadge } from "./intent-badge";

/**
 * Blue callout box showing the intent badge and reasoning for the suggestion.
 *
 * @param {string} intent The intent type (e.g. "informational").
 * @param {string} description The reason for the suggestion.
 *
 * @returns {JSX.Element} The IntentCallout component.
 */
export const IntentCallout = ( { intent, description } ) => {
	return (
		<div role="note" className="yst-bg-blue-50 yst-border yst-border-blue-200 yst-rounded-md yst-p-4 yst-flex yst-flex-col yst-gap-2">
			<div className="yst-flex yst-items-center yst-gap-2">
				<IntentBadge intent={ intent } />
				<span className="yst-font-medium yst-text-sm yst-text-blue-900">
					{ __( "Why this content?", "wordpress-seo" ) }
				</span>
			</div>
			<p className="yst-text-sm yst-text-blue-900">{ description }</p>
		</div>
	);
};
