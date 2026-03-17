import { GradientSparklesIcon } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";
import classNames from "classnames";

/**
 * Component that shows the spark note when the user is on a free trial.
 * 
 * @param {string} className Additional class names to add to the component.
 *
 * @returns {JSX.Element} The spark note component.
 */
export const OneSparkNote = ( { className } ) => (
	<span className={ classNames( "yst-text-sm yst-flex yst-items-center yst-gap-1 yst-justify-center yst-text-slate-500 yst-italic", className ) }>
		<GradientSparklesIcon className="yst-h-3 yst-w-3" />
		{ __( "Using 1 spark", "wordpress-seo" ) }
	</span>
);
