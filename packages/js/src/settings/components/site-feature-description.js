import { __ } from "@wordpress/i18n";
import { Button } from "@yoast/ui-library";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/outline";

/**
 * Site feature description component.
 *
 * @param {boolean} isAllFeaturesOpen Whether all features sections are open or not.
 * @param {function} toggleAllFeatures Callback to toggle all features sections.
 * @returns {JSX.Element} The site feature description component.
 */
export const SiteFeatureDescription = ( { isAllFeaturesOpen, toggleAllFeatures } ) => {
	const ChevronIcon = isAllFeaturesOpen ? ChevronUpIcon : ChevronDownIcon;
	return <>
		<p className="yst-text-tiny yst-mt-3">{ __( "Tell us which features you want to use.", "wordpress-seo" ) }</p>
		<Button
			variant="secondary"
			size="small"
			className="yst-mt-3 yst-ps-2"
			onClick={ toggleAllFeatures }
		>
			<ChevronIcon className="yst-h-4 yst-w-4 yst-text-slate-400 yst-me-1.5" />
			{ isAllFeaturesOpen ? __( "Collapse all", "wordpress-seo" ) : __( "Expand all", "wordpress-seo" ) }
		</Button>
	</>;
};
