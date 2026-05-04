import { __ } from "@wordpress/i18n";
import classNames from "classnames";
import { IntentBadge, intentBadgeProps } from "./intent-badge";

/**
 * Callout box showing the intent badge and reasoning for the suggestion.
 * Background and border colors adapt to the intent type.
 *
 * @param {object} props The component props.
 * @param {string} props.intent The intent type (e.g. "informational").
 * @param {string} props.description The reason for the suggestion.
 *
 * @returns {JSX.Element} The IntentCallout component.
 */
export const IntentCallout = ( { intent, description } ) => {
	const badge = intentBadgeProps[ intent ];
	const calloutClasses = badge ? badge.calloutClasses : "yst-bg-slate-50 yst-border-slate-200";
	const textClasses = badge ? badge.calloutTextClasses : "yst-text-slate-900";

	return (
		<div
			role="note"
			className={ classNames( "yst-border yst-rounded-md yst-p-4 yst-flex yst-flex-col yst-gap-2", calloutClasses ) }
		>
			<div className="yst-flex yst-items-center yst-gap-2">
				<IntentBadge intent={ intent } tooltipPosition="bottom-right" />
				<span className={ classNames( "yst-font-medium yst-text-sm", textClasses ) }>
					{ __( "Why this content?", "wordpress-seo" ) }
				</span>
			</div>
			<p className={ classNames( "yst-text-sm", textClasses ) }>{ description }</p>
		</div>
	);
};
