import { useContext } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { LocationContext } from "@yoast/externals/contexts";
import { ContentBlock } from "./ContentBlock";
import MetaboxCollapsible from "../MetaboxCollapsible";
import SidebarCollapsible from "../SidebarCollapsible";

/**
 * Renders the Yoast Custom Blocks component.
 *
 * @returns {JSX.Element} The Yoast Custom Blocks component.
 */
export const YoastContentBlocks = () => {
	// Use useContext to access the LocationContext.
	const location = useContext( LocationContext );
	const Collapsible = location === "metabox" ? MetaboxCollapsible : SidebarCollapsible;

	const contentBlocks = [
		"FAQ",
		"How-to",
		"Breadcrumbs",
	];

	const premiumContentBlocks = [
		"AI Summarize",
		"Estimated reading time",
		"Related links",
		"Table of contents",
	];

	// Render the premium blocks first.
	const allContentBlocks = premiumContentBlocks.concat( contentBlocks );

	const collapsibleId = `yoast-custom-blocks-collapsible-${location}`;
	return (
		<Collapsible
			id={ collapsibleId }
			title={ __( "Content blocks", "wordpress-seo" ) }
			hasNewBadgeLabel={ true }
		>
			<div className="yst-mt-2 yst-font-normal yst-text-sm">
				{ __( "While writing your post, add custom Yoast blocks directly from here to enhance your content.", "wordpress-seo" ) }
			</div>
			{
				allContentBlocks.map( ( block ) => (
					<ContentBlock
						key={ block }
						blockName={ block }
						isPremiumBlock={ premiumContentBlocks.includes( block ) }
						hasNewBadgeLabel={ block === "AI Summarize" }
					/>
				) )
			}
		</Collapsible>
	);
};
