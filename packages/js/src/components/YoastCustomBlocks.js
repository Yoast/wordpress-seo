import { useContext } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { LocationContext } from "@yoast/externals/contexts";
import { SvgIcon } from "@yoast/components";
import { Badge } from "@yoast/ui-library";
import MetaboxCollapsible from "./MetaboxCollapsible";
import SidebarCollapsible from "./SidebarCollapsible";

/**
 * Renders the Yoast Custom Blocks component.
 *
 * @returns {JSX.Element} The Yoast Custom Blocks component.
 */
export const YoastCustomBlocks = () => {
	// Use useContext to access the LocationContext.
	const location = useContext( LocationContext );
	const Collapsible = location === "metabox" ? MetaboxCollapsible : SidebarCollapsible;

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
			<hr style={ { borderTop: "0" } } />
			<div className="yst-flex yst-items-center">
				<div className="yst-flex yst-items-center yst-flex-grow yst-p-0 yst-gap-2 yst-relative yst-w-[152px] yst-h-5 yst-left-4">
					<SvgIcon icon="circle" size="4px" />
					<span className="yst-ms-1 yst-font-medium">AI Summarize</span>
					<div className="yst-root">
						<Badge variant="info" size="small">{ __( "New", "wordpress-seo" ) }</Badge>
					</div>
				</div>
			</div>
		</Collapsible>
	);
};
