import { ClockIcon, LinkIcon, SparklesIcon, ViewListIcon } from "@heroicons/react/outline";
import { useCallback, useContext } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { LocationContext } from "@yoast/externals/contexts";
import { Badge } from "@yoast/ui-library";
import { ContentBlock } from "./ContentBlock";
import MetaboxCollapsible from "../MetaboxCollapsible";
import SidebarCollapsible from "../SidebarCollapsible";

const CONTENT_BLOCKS = [
	{ title: __( "Breadcrumbs", "wordpress-seo" ), name: "yoast-seo/breadcrumbs", isPremiumBlock: false },
	{ title: __( "FAQ", "wordpress-seo" ), name: "yoast/faq-block", isPremiumBlock: false },
	{ title: __( "How-to", "wordpress-seo" ), name: "yoast/how-to-block", isPremiumBlock: false },
];

export const PREMIUM_CONTENT_BLOCKS = [
	{
		title: __( "AI Summarize", "wordpress-seo" ),
		name: "yoast-seo/ai-summarize",
		isPremiumBlock: true,
		icon: SparklesIcon,
	},
	{
		title: __( "Estimated reading time", "wordpress-seo" ),
		name: "yoast-seo/estimated-reading-time",
		isPremiumBlock: true,
		icon: ClockIcon,
	},
	{
		title: __( "Related links", "wordpress-seo" ),
		name: "yoast-seo/related-links",
		isPremiumBlock: true,
		icon: LinkIcon,
	},
	{
		title: __( "Table of contents", "wordpress-seo" ),
		name: "yoast-seo/table-of-contents",
		isPremiumBlock: true,
		icon: ViewListIcon,
	},
];

/**
 * Gets the appropriate premium blocks based on AI feature availability.
 *
 * @param {boolean} isAIFeatureEnabled - Whether AI feature is enabled.
 * @returns {Array} Array of premium blocks.
 */
const getPremiumBlocks = ( isAIFeatureEnabled ) => {
	if ( isAIFeatureEnabled ) {
		return PREMIUM_CONTENT_BLOCKS;
	}
	return PREMIUM_CONTENT_BLOCKS.filter(
		block => block.name !== "yoast-seo/ai-summarize"
	);
};

/**
 * Gets page-only blocks for pages.
 *
 * @param {boolean} isPage - Whether the current post type is a page.
 * @returns {Array} Array of page-only blocks.
 */
const getPageOnlyBlocks = ( isPage ) => {
	if ( ! isPage ) {
		return [];
	}
	return [
		{ title: __( "Siblings", "wordpress-seo" ), name: "yoast-seo/siblings", isPremiumBlock: true },
		{ title: __( "Subpages", "wordpress-seo" ), name: "yoast-seo/subpages", isPremiumBlock: true },
	];
};

/**
 * Arranges blocks in the correct order.
 *
 * @param {Array} premiumBlocks - Array of premium blocks.
 * @param {Array} pageOnlyBlocks - Array of page-only blocks.
 * @param {boolean} isPage - Whether the current post type is a page.
 * @returns {Array} All content blocks in the correct order.
 */
const arrangeContentBlocks = ( premiumBlocks, pageOnlyBlocks, isPage ) => {
	const tableOfContentsBlock = premiumBlocks.find( block => block.name === "yoast-seo/table-of-contents" );
	const otherPremiumBlocks = premiumBlocks.filter( block => block.name !== "yoast-seo/table-of-contents" );

	if ( isPage ) {
		return otherPremiumBlocks.concat(
			pageOnlyBlocks,
			tableOfContentsBlock ? [ tableOfContentsBlock ] : [],
			CONTENT_BLOCKS
		);
	}
	return premiumBlocks.concat( CONTENT_BLOCKS );
};

/**
 * Renders the Yoast Content Blocks component.
 *
 * @returns {JSX.Element} The Yoast Custom Blocks component.
 */
export const ContentBlocks = () => {
	// Use useContext to access the LocationContext.
	const location = useContext( LocationContext );
	const Collapsible = location === "metabox" ? MetaboxCollapsible : SidebarCollapsible;

	/*
	 * Check if the AI feature is enabled.
	 * It's a conscious decision not to use getIsAiFeatureEnabled selector here.
	 * This is because that selector depends on the Premium store.
	 * In this component we also want to know if the AI feature is enabled for Free users.
	 * The window.wpseoAiGenerator global is set in both Free and Premium.
	 */
	const isAIFeatureEnabled = !! window.wpseoAiGenerator;
	const premiumBlocks = getPremiumBlocks( isAIFeatureEnabled );

	// Conditionally include Siblings and Sub-pages for pages only.
	const isPage = Boolean( window?.wpseoScriptData?.isPage );
	const pageOnlyBlocks = getPageOnlyBlocks( isPage );

	// Render premium blocks, then page-only blocks, then table of contents (on pages), then content blocks
	const allContentBlocks = arrangeContentBlocks( premiumBlocks, pageOnlyBlocks, isPage );

	/*
	 * The MetaboxCollapsible is using Collapsible from the old @yoast/components package,
	 * which doesn't have support for the `@yoast/ui-library` Badge component.
	 * Therefore, we need to create a custom render function for the "New" badge label here,
	 * and pass it as a prop.
	 */
	const renderNewBadgeLabel = useCallback( () => {
		return (
			<div className="yst-root">
				<Badge variant="info" size="small">{ __( "New", "wordpress-seo" ) }</Badge>
			</div>
		);
	}, [] );

	const collapsibleId = `yoast-content-blocks-collapsible-${location}`;

	return (
		<Collapsible
			id={ collapsibleId }
			title={ __( "Content blocks", "wordpress-seo" ) }
			hasNewBadgeLabel={ true }
			renderNewBadgeLabel={ renderNewBadgeLabel }
		>
			<div className="yst-font-normal yst-text-sm">
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
						renderNewBadgeLabel={ renderNewBadgeLabel }
						location={ location }
					/>
				) )
			}
		</Collapsible>
	);
};
