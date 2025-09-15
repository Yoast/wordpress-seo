import { useContext } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { LocationContext } from "@yoast/externals/contexts";
import { ContentBlock } from "./ContentBlock";
import MetaboxCollapsible from "../MetaboxCollapsible";
import SidebarCollapsible from "../SidebarCollapsible";

const CONTENT_BLOCKS = [
	{ title: __( "FAQ", "wordpress-seo" ), name: "yoast/faq-block", isPremiumBlock: false },
	{ title: __( "How-to", "wordpress-seo" ), name: "yoast/how-to-block", isPremiumBlock: false },
	{ title: __( "Breadcrumbs", "wordpress-seo" ), name: "yoast-seo/breadcrumbs", isPremiumBlock: false },
];

const PREMIUM_CONTENT_BLOCKS = [
	{ title: __( "AI Summarize", "wordpress-seo" ), name: "yoast-seo/ai-summarize", isPremiumBlock: true },
	{ title: __( "Estimated reading time", "wordpress-seo" ), name: "yoast-seo/estimated-reading-time", isPremiumBlock: true },
	{ title: __( "Related links", "wordpress-seo" ), name: "yoast-seo/related-links", isPremiumBlock: true },
	{ title: __( "Table of contents", "wordpress-seo" ), name: "yoast-seo/table-of-contents", isPremiumBlock: true },
];

/**
 * Renders the Yoast Content Blocks component.
 *
 * @returns {JSX.Element} The Yoast Custom Blocks component.
 */
export const YoastContentBlocks = () => {
	// Use useContext to access the LocationContext.
	const location = useContext( LocationContext );
	const Collapsible = location === "metabox" ? MetaboxCollapsible : SidebarCollapsible;

	// Render the premium blocks first.
	const allContentBlocks = PREMIUM_CONTENT_BLOCKS.concat( CONTENT_BLOCKS );

	const collapsibleId = `yoast-content-blocks-collapsible-${location}`;

	return (
		<Collapsible
			id={ collapsibleId }
			title={ __( "Content blocks", "wordpress-seo" ) }
			hasNewBadgeLabel={ true }
			className={ "yoast-content-blocks" }
		>
			<div className="yst-mt-2 yst-font-normal yst-text-sm">
				{ __( "While writing your post, add custom Yoast blocks directly from here to enhance your content.", "wordpress-seo" ) }
			</div>
			{
				allContentBlocks.map( ( block ) => (
					<ContentBlock
						key={ block.name }
						blockTitle={ block.title }
						blockName={ block.name }
						isPremiumBlock={ block.isPremiumBlock }
						hasNewBadgeLabel={ block.title === "AI Summarize" }
					/>
				) )
			}
		</Collapsible>
	);
};
