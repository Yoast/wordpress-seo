import { Title, useSvgAria } from "@yoast/ui-library";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
import { FeatureItem } from "./feature-item";
import { useCallback } from "@wordpress/element";
import { useSelectSettings, useDispatchSettings } from "../hooks";
import { __ } from "@wordpress/i18n";

/**
 *
 * @param {string} title The title of the features section.
 * @param {Array} features An array of feature objects to display.
 * @param {string} id The ID of the features section.
 *
 * @returns {JSX.Element} The FeaturesSection component.
 */
export const FeaturesSection = ( { id, title, features = [] } ) => {
	const isOpen = useSelectSettings( "selectIsSiteFeatureOpen", [], id );
	const { toggleFeatureSection } = useDispatchSettings();
	const handleToggle = useCallback( () => {
		toggleFeatureSection( id );
	}, [ toggleFeatureSection, id ] );
	const featureCount = features.length;
	const ChevronIcon = isOpen ? ChevronUpIcon : ChevronDownIcon;
	const svgAriaProps = useSvgAria();
	return (
		<fieldset>
			<div className="yst-flex yst-justify-between yst-items-center yst-py-3.5 yst-border-b-slate-200 yst-border-b">
				<Title size="4" as="h2" className="">{ `${title} (${ featureCount })` }</Title>
				<button onClick={ handleToggle } type="button">
					<ChevronIcon className="yst-h-5 yst-w-5 yst-text-slate-400 yst-shrink-0" { ...svgAriaProps } />
					<span className="yst-sr-only">{ `${isOpen ? __( "Collapse", "wordpress-seo" ) : __( "Expand", "wordpress-seo" )} ${title}` }</span>
				</button>

			</div>
			{ isOpen && <ul className="yst-mb-2">
				{ features.map( ( feature ) => (
					<li key={ feature.id } className="yst-border-b-slate-200 yst-border-b last:yst-border-0 yst-py-4">
						<FeatureItem { ...feature } />
					</li>
				) ) }
			</ul> }
		</fieldset>
	);
};
