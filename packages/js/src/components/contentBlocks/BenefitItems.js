import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import { UserGroupIcon, CollectionIcon } from "@heroicons/react/outline";

import { PREMIUM_CONTENT_BLOCKS, getPremiumBlocksForPages } from "./ContentBlocks";

/**
 * BenefitItems component to render the list of benefits.
 * @param {string} id The id for the benefit items.
 * @returns {JSX.Element} The BenefitItems component.
 */
export const BenefitItems = ( { id } ) => {
	const isPage = Boolean( window?.wpseoScriptData?.isPage );

	// Get premium blocks, merged and sorted alphabetically for pages
	const premiumBlocksForPages = getPremiumBlocksForPages( PREMIUM_CONTENT_BLOCKS, [
		{ title: __( "Siblings", "wordpress-seo" ), name: "yoast-seo/siblings", isPremiumBlock: true },
		{ title: __( "Sub-pages", "wordpress-seo" ), name: "yoast-seo/subpages", isPremiumBlock: true },
	], isPage );

	// Map blocks to include icons for rendering
	const benefits = premiumBlocksForPages.map( block => {
		// Assign icon for page-only blocks
		if ( block.name === "yoast-seo/siblings" ) {
			return { ...block, icon: UserGroupIcon };
		}
		if ( block.name === "yoast-seo/subpages" ) {
			return { ...block, icon: CollectionIcon };
		}
		// For premium blocks, use their existing icon
		return block;
	} );

	return (
		<ul className="yst-my-2">
			{ benefits.map( ( benefit, index ) => {
				const { icon: Icon, title } = benefit;
				return <li key={ `${id}-upsell-benefit-${ index }` } className="yst-flex yst-gap-2 yst-mb-2 yst-items-center">
					<Icon className="yst-w-4 yst-h-4 yst-shrink-0 yst-inline yst-stroke-slate-400" />
					<p className="yst-text-slate-600 yst-font-medium">{ title }</p>
				</li>;
			} ) }
		</ul>
	);
};


BenefitItems.propTypes = {
	id: PropTypes.string.isRequired,
};
