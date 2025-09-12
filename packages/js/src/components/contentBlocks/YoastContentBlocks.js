import { useContext } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { LocationContext } from "@yoast/externals/contexts";
import { ContentBlock } from "./ContentBlock";
import MetaboxCollapsible from "../MetaboxCollapsible";
import SidebarCollapsible from "../SidebarCollapsible";

const CONTENT_BLOCKS = [
	{ title: "FAQ", name: "yoast/faq-block" },
	{ title: "How-to", name: "yoast/how-to-block" },
	{ title: "Breadcrumbs", name: "yoast/breadcrumbs-block" },
];

const PREMIUM_CONTENT_BLOCKS = [
	{ title: "AI Summarize", name: "yoast-seo/ai-summarize" },
	{ title: "Estimated reading time", name: "yoast-seo/estimated-reading-time" },
	{ title: "Related links", name: "yoast-seo/related-links" },
	{ title: "Table of contents", name: "yoast-seo/table-of-contents" },
];

/**
 * Renders the Yoast Custom Blocks component.
 *
 * @returns {JSX.Element} The Yoast Custom Blocks component.
 */
export const YoastContentBlocks = () => {
	// Use useContext to access the LocationContext.
	const location = useContext( LocationContext );
	const Collapsible = location === "metabox" ? MetaboxCollapsible : SidebarCollapsible;

	// Render the premium blocks first.
	const allContentBlocks = PREMIUM_CONTENT_BLOCKS.concat( CONTENT_BLOCKS );

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
				allContentBlocks.map( ( { title, name } ) => (
					<ContentBlock
						key={ name }
						blockTitle={ title }
						blockName={ name }
						isPremiumBlock={ name.startsWith( "yoast-seo/" ) }
						hasNewBadgeLabel={ title === "AI Summarize" }
					/>
				) )
			}
		</Collapsible>
	);
};
